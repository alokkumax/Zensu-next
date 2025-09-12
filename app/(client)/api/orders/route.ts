import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getMyOrders } from "@/sanity/queries";

export async function GET(req: NextRequest) {
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
