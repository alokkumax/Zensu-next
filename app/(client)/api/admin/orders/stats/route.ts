import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (implement your admin check logic)

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30'; // days
    const days = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateISO = startDate.toISOString();

    // Get order statistics
    const [
      totalOrders,
      totalRevenue,
      ordersByStatus,
      recentOrders,
      topProducts,
      revenueByDay
    ] = await Promise.all([
      // Total orders in period
      backendClient.fetch(
        `count(*[_type == 'orders' && orderDate >= $startDate])`,
        { startDate: startDateISO }
      ),
      
      // Total revenue in period
      backendClient.fetch(
        `*[_type == 'orders' && orderDate >= $startDate && orderStatus != 'cancelled' && orderStatus != 'refunded'] | order(orderDate desc) {
          orderTotals.total
        }`,
        { startDate: startDateISO }
      ).then(orders => 
        orders.reduce((sum, order) => sum + (order.orderTotals?.total || 0), 0)
      ),
      
      // Orders by status
      backendClient.fetch(
        `*[_type == 'orders' && orderDate >= $startDate] {
          orderStatus
        }`,
        { startDate: startDateISO }
      ).then(orders => {
        const statusCounts = orders.reduce((acc, order) => {
          const status = order.orderStatus || 'unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        return statusCounts;
      }),
      
      // Recent orders
      backendClient.fetch(
        `*[_type == 'orders' && orderDate >= $startDate] | order(orderDate desc)[0...10] {
          _id,
          orderNumber,
          userDetails.userName,
          orderTotals.total,
          orderStatus,
          orderDate
        }`,
        { startDate: startDateISO }
      ),
      
      // Top products
      backendClient.fetch(
        `*[_type == 'orders' && orderDate >= $startDate] {
          products[] {
            productName,
            productId,
            quantity
          }
        }`,
        { startDate: startDateISO }
      ).then(orders => {
        const productCounts = {};
        orders.forEach(order => {
          order.products?.forEach(item => {
            if (item.productId) {
              const productId = item.productId;
              const productName = item.productName || 'Unknown Product';
              if (!productCounts[productId]) {
                productCounts[productId] = { name: productName, quantity: 0, orders: 0 };
              }
              productCounts[productId].quantity += item.quantity || 0;
              productCounts[productId].orders += 1;
            }
          });
        });
        
        return Object.values(productCounts)
          .sort((a: any, b: any) => b.quantity - a.quantity)
          .slice(0, 10);
      }),
      
      // Revenue by day
      backendClient.fetch(
        `*[_type == 'orders' && orderDate >= $startDate && orderStatus != 'cancelled' && orderStatus != 'refunded'] {
          orderDate,
          orderTotals.total
        }`,
        { startDate: startDateISO }
      ).then(orders => {
        const dailyRevenue = {};
        orders.forEach(order => {
          const date = new Date(order.orderDate).toISOString().split('T')[0];
          dailyRevenue[date] = (dailyRevenue[date] || 0) + (order.orderTotals?.total || 0);
        });
        
        return Object.entries(dailyRevenue)
          .map(([date, revenue]) => ({ date, revenue: revenue / 100 }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      })
    ]);

    const stats = {
      period: `${days} days`,
      totalOrders,
      totalRevenue: totalRevenue / 100, // Convert from cents
      averageOrderValue: totalOrders > 0 ? (totalRevenue / 100) / totalOrders : 0,
      ordersByStatus,
      recentOrders: recentOrders.map(order => ({
        ...order,
        total: order.orderTotals?.total ? order.orderTotals.total / 100 : 0
      })),
      topProducts,
      revenueByDay
    };

    return NextResponse.json({ 
      success: true,
      stats
    });
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch order statistics", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
