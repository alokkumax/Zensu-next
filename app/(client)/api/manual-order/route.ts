import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Manual order creation request:", body);
    
    // Create order manually with provided data
    const orderData = {
      _type: "order",
      orderNumber: body.orderNumber || `MANUAL-${Date.now()}`,
      stripeCheckoutSessionId: body.sessionId || "manual-session",
      stripePaymentIntentId: body.paymentIntent || "manual-payment",
      customerName: body.customerName || "Manual Test Customer",
      stripeCustomerId: body.customerEmail || "manual@example.com",
      clerkUserId: body.clerkUserId || "manual-user",
      email: body.customerEmail || "manual@example.com",
      currency: "INR",
      amountDiscount: 0,
      products: body.products || [],
      totalPrice: body.totalPrice || 100,
      status: "paid",
      orderDate: new Date().toISOString(),
      address: body.address || {
        state: "Test State",
        zip: "123456",
        city: "Test City",
        address: "Test Address",
        name: "Test Name",
      },
    };

    console.log("Creating manual order with data:", orderData);
    
    const order = await backendClient.create(orderData);
    console.log("Manual order created successfully:", order);
    
    return NextResponse.json({ 
      success: true, 
      order: order,
      message: "Order created successfully in Sanity"
    });
  } catch (error) {
    console.error("Error creating manual order:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
