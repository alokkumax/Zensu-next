import { Metadata } from "@/actions/createCheckoutSession";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "No Signature found for stripe" },
      { status: 400 }
    );
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.log("Stripe webhook secret is not set");
    return NextResponse.json(
      {
        error: "Stripe webhook secret is not set",
      },
      { status: 400 }
    );
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      {
        error: `Webhook Error: ${error}`,
      },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoice = session.invoice
      ? await stripe.invoices.retrieve(session.invoice as string)
      : null;

    try {
      await createOrderInSanity(session, invoice);
    } catch (error) {
      console.error("Error creating order in sanity:", error);
      return NextResponse.json(
        {
          error: `Error creating order: ${error}`,
        },
        { status: 400 }
      );
    }
  }
  return NextResponse.json({ received: true });
}

async function createOrderInSanity(
  session: Stripe.Checkout.Session,
  invoice: Stripe.Invoice | null
) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    total_details,
  } = session;
  const { orderNumber, customerName, customerEmail, clerkUserId, address, couponCode, couponPercent, originalTotal } =
    metadata as unknown as Metadata & { address: string };
  const parsedAddress = address ? JSON.parse(address) : null;

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    { expand: ["data.price.product"] }
  );

  // Create Sanity product references and prepare stock updates
  const sanityProducts = [];
  const stockUpdates = [];
  for (const item of lineItemsWithProduct.data) {
    const productId = (item.price?.product as Stripe.Product)?.metadata?.id;
    const quantity = item?.quantity || 0;

    if (!productId) continue;

    sanityProducts.push({
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        _ref: productId,
      },
      quantity,
      price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
    });
    stockUpdates.push({ productId, quantity });
  }
  //   Create order in Sanity

  // Derive first product name for schema's required productName field
  const firstItem = lineItemsWithProduct.data[0];
  const firstProduct = firstItem?.price?.product as Stripe.Product | undefined;
  const productName = firstProduct?.name || firstItem?.description || "Unknown Product";

  const order = await backendClient.create({
    _type: "order",
    orderNumber,

    // Keep existing fields for backward compatibility
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName,
    stripeCustomerId: customerEmail,
    clerkUserId: clerkUserId,
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0,
    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
    // Add coupon information
    couponCode: couponCode || null,
    couponPercent: couponPercent ? Number(couponPercent) : null,
    originalTotal: originalTotal ? Number(originalTotal) : null,
    invoice: invoice
      ? {
          id: invoice.id,
          number: invoice.number,
          hosted_invoice_url: invoice.hosted_invoice_url,
        }
      : null,
    address: parsedAddress
      ? {
          state: parsedAddress.state,
          zip: parsedAddress.zip,
          city: parsedAddress.city,
          address: parsedAddress.address,
          name: parsedAddress.name,
        }
      : null,

    // Add required schema fields so user appears linked in UI
    productName,
    selectedAddress: parsedAddress
      ? {
          fullName: parsedAddress.fullName || parsedAddress.name,
          address: parsedAddress.address,
          city: parsedAddress.city,
          state: parsedAddress.state,
          pinCode: parsedAddress.pinCode || parsedAddress.zip,
        }
      : undefined,
    userDetails: {
      userId: clerkUserId || "",
      userName: customerName || "",
      userEmail: customerEmail || "",
    },
    stripePaymentDetails: {
      paymentIntentId: (payment_intent as string) || "",
      checkoutSessionId: id,
      amount: amount_total ? amount_total / 100 : 0,
      currency,
      status: "succeeded",
    },
    orderStatus: "processing",
  });

  // Update stock levels in Sanity

  await updateStockLevels(stockUpdates);
  return order;
}

// Function to update stock levels
async function updateStockLevels(
  stockUpdates: { productId: string; quantity: number }[]
) {
  for (const { productId, quantity } of stockUpdates) {
    try {
      // Fetch current stock
      const product = await backendClient.getDocument(productId);

      if (!product || typeof product.stock !== "number") {
        console.warn(
          `Product with ID ${productId} not found or stock is invalid.`
        );
        continue;
      }

      const newStock = Math.max(product.stock - quantity, 0); // Ensure stock does not go negative

      // Update stock in Sanity
      await backendClient.patch(productId).set({ stock: newStock }).commit();
    } catch (error) {
      console.error(`Failed to update stock for product ${productId}:`, error);
    }
  }
}