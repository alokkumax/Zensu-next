import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getMyOrders } from "@/sanity/queries";
import { backendClient } from "@/sanity/lib/backendClient";

export async function GET() {
  try {
    const { userId } = await auth();
    
    console.log("API Route - User ID:", userId); // Debug log
    
    if (!userId) {
      console.log("API Route - No user ID found"); // Debug log
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 });
    }

    // Get user details for additional verification
    const user = await currentUser();
    console.log("API Route - User details:", user?.id); // Debug log

    const orders = await getMyOrders(userId);
    console.log("API Route - Orders fetched:", orders?.length); // Debug log
    
    return NextResponse.json({ 
      orders: orders || [],
      userId: userId,
      userEmail: user?.emailAddresses?.[0]?.emailAddress 
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, updates } = body;

    if (!orderId || !updates) {
      return NextResponse.json({ error: "Order ID and updates are required" }, { status: 400 });
    }

    // Verify the order belongs to the user
    const existingOrder = await backendClient.fetch(
      `*[_type == 'orders' && _id == $orderId && userDetails.userId == $userId][0]`,
      { orderId, userId }
    );

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found or unauthorized" }, { status: 404 });
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
