"use server";

import stripe from "@/lib/stripe";
import { Address } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "@/store";
import { getProductPriceByCurrency } from "@/lib/currencyUtils";
import Stripe from "stripe";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address?: Address | null;
  phone?: string;
  couponCode?: string;
  couponPercent?: number;
  originalTotal?: number;
  discountedTotal?: number;
  currency?: string;
}

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

async function createOrGetCoupon(couponCode: string, percentOff: number): Promise<string> {
  try {
    // Create coupon ID from the code
    const couponId = couponCode.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    try {
      // Try to retrieve existing coupon by ID
      const existingCoupon = await stripe.coupons.retrieve(couponId);
      return existingCoupon.id;
    } catch (retrieveError: any) {
      // If coupon doesn't exist (404), create a new one
      if (retrieveError.code === 'resource_missing') {
        const coupon = await stripe.coupons.create({
          id: couponId,
          percent_off: percentOff,
          duration: 'once',
          name: `Coupon: ${couponCode}`,
        });
        return coupon.id;
      }
      throw retrieveError;
    }
  } catch (error) {
    console.error('Error creating/getting coupon:', error);
    throw error;
  }
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata,
  currency: string = "INR"
) {
  try {
    // Retrieve existing customer or create a new one
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });
    const customerId = customers?.data?.length > 0 ? customers.data[0].id : "";

    // Calculate totals using currency-aware pricing
    const originalTotal = metadata.originalTotal || items.reduce((sum, item) => {
      const { price } = getProductPriceByCurrency(item.product, currency as any);
      return sum + (price * item.quantity);
    }, 0);
    const discountAmount = metadata.couponPercent ? (originalTotal * metadata.couponPercent) / 100 : 0;
    const discountedTotal = metadata.discountedTotal || (originalTotal - discountAmount);

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      metadata: {
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        clerkUserId: metadata.clerkUserId!,
        address: metadata.address ? JSON.stringify(metadata.address) : '',
        phone: metadata.phone || '',
        couponCode: metadata.couponCode || '',
        couponPercent: metadata.couponPercent?.toString() || '',
        originalTotal: originalTotal.toString(),
        discountedTotal: discountedTotal.toString(),
        currency: currency,
      },
      mode: "payment",
      payment_method_types: ["card"],
      invoice_creation: {
        enabled: true,
      },
      success_url: `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      line_items: items?.map((item) => {
        const { price } = getProductPriceByCurrency(item.product, currency as any);
        return {
          price_data: {
            currency: currency === 'UAE' ? 'AED' : currency, 
            unit_amount: Math.round(price * 100),
            product_data: {
              name: item?.product?.name || "Unknown Product",
              description: item?.product?.description,
              metadata: { id: item?.product?._id },
              images:
                item?.product?.images && item?.product?.images?.length > 0
                  ? [urlFor(item?.product?.images[0]).url()]
                  : undefined,
            },
          },
          quantity: item?.quantity,
        };
      }),
    };

    // Add discount if coupon is applied, otherwise allow promotion codes
    if (metadata.couponCode && metadata.couponPercent && discountAmount > 0) {
      sessionPayload.discounts = [{
        coupon: await createOrGetCoupon(metadata.couponCode, metadata.couponPercent),
      }];
    } else {
      sessionPayload.allow_promotion_codes = true;
    }
    if (customerId) {
      sessionPayload.customer = customerId;
    } else {
      sessionPayload.customer_email = metadata.customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);
    return session.url;
  } catch (error) {
    console.error("Error creating Checkout Session", error);
    throw error;
  }
}