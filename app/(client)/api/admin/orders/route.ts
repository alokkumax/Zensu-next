import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

// Get all orders (admin only)
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (you can implement your own admin check logic)
    // For now, we'll allow any authenticated user to access this
    // In production, you should implement proper admin role checking

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = `*[_type == 'orders'] | order(orderDate desc)`;
    
    if (status) {
      query = `*[_type == 'orders' && orderStatus == $status] | order(orderDate desc)`;
    }

    const orders = await backendClient.fetch(
      `${query}[$offset...$limit]{
        _id,
        orderNumber,
        products[]{
          productName,
          productId,
          quantity,
          price,
          image
        },
        selectedAddress,
        userDetails,
        stripePaymentDetails,
        orderTotals,
        orderDate,
        orderStatus,
        trackingNumber,
        shippingMethod,
        notes
      }`,
      { 
        status, 
        limit: offset + limit, 
        offset 
      }
    );

    const totalCount = await backendClient.fetch(
      `count(*[_type == 'orders'${status ? ` && orderStatus == "${status}"` : ''}])`
    );

    return NextResponse.json({ 
      orders: orders || [],
      totalCount,
      hasMore: offset + limit < totalCount
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Update order (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (implement your admin check logic)

    const body = await req.json();
    const { orderId, updates } = body;

    if (!orderId || !updates) {
      return NextResponse.json({ error: "Order ID and updates are required" }, { status: 400 });
    }

    // Verify the order exists
    const existingOrder = await backendClient.fetch(
      `*[_type == 'orders' && _id == $orderId][0]`,
      { orderId }
    );

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update the order
    const updatedOrder = await backendClient
      .patch(orderId)
      .set(updates)
      .commit();

    return NextResponse.json({ 
      success: true, 
      order: updatedOrder 
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Delete order (admin only)
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (implement your admin check logic)

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Verify the order exists
    const existingOrder = await backendClient.fetch(
      `*[_type == 'orders' && _id == $orderId][0]`,
      { orderId }
    );

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Delete the order
    await backendClient.delete(orderId);

    return NextResponse.json({ 
      success: true, 
      message: "Order deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
