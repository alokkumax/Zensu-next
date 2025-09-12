"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import OrdersComponent from "@/components/OrdersComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileX, Loader2 } from "lucide-react";
import Link from "next/link";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import toast from "react-hot-toast";
import { client } from "@/sanity/lib/client";

const OrdersPage = () => {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState<MY_ORDERS_QUERYResult>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoaded) {
        console.log("Orders Page - Clerk not loaded yet");
        return;
      }
      
      if (!user) {
        console.log("Orders Page - No user found, redirecting");
        redirect("/");
        return;
      }

      console.log("Orders Page - User found:", user.id, user.emailAddresses?.[0]?.emailAddress);

      try {
        setLoading(true);
        setError(null);
        
        console.log("Orders Page - Fetching orders from API...");
        const response = await fetch("/api/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensure cookies are sent
        });
        
        console.log("Orders Page - API Response status:", response.status);
        const data = await response.json();
        console.log("Orders Page - API Response data:", data);
        
        if (!response.ok) {
          // If API fails, try direct Sanity query as fallback
          console.log("Orders Page - API failed, trying direct Sanity query...");
          const directOrders = await client.fetch(
            `*[_type == 'order' && clerkUserId == $userId] | order(orderDate desc){
              ...,products[]{
                ...,product->
              }
            }`,
            { userId: user.id }
          );
          console.log("Orders Page - Direct Sanity query result:", directOrders?.length);
          setOrders(directOrders || []);
        } else {
          setOrders(data.orders || []);
          console.log("Orders Page - Orders set:", data.orders?.length);
        }
      } catch (err) {
        console.error("Orders Page - Error fetching orders:", err);
        
        // Final fallback - try direct Sanity query
        try {
          console.log("Orders Page - Trying final fallback with direct Sanity query...");
          const directOrders = await client.fetch(
            `*[_type == 'order' && clerkUserId == $userId] | order(orderDate desc){
              ...,products[]{
                ...,product->
              }
            }`,
            { userId: user.id }
          );
          console.log("Orders Page - Fallback Sanity query result:", directOrders?.length);
          setOrders(directOrders || []);
        } catch (fallbackErr) {
          console.error("Orders Page - Fallback also failed:", fallbackErr);
          setError(err instanceof Error ? err.message : "Failed to fetch orders");
          toast.error("Failed to load orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <Container className="py-10">
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Loading your orders...</h2>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Please wait while we fetch your order history.
          </p>
          {!isLoaded && (
            <p className="mt-2 text-xs text-gray-500">
              Clerk is loading...
            </p>
          )}
          {isLoaded && loading && (
            <p className="mt-2 text-xs text-gray-500">
              User: {user?.id ? "Authenticated" : "Not authenticated"}
            </p>
          )}
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-10">
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <FileX className="h-24 w-24 text-red-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900">Error loading orders</h2>
          <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
            {error}
          </p>
          
          {/* Debug Information */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs text-left max-w-md">
            <h3 className="font-semibold mb-2">Debug Information:</h3>
            <p><strong>Clerk Loaded:</strong> {isLoaded ? "Yes" : "No"}</p>
            <p><strong>User ID:</strong> {user?.id || "Not available"}</p>
            <p><strong>User Email:</strong> {user?.emailAddresses?.[0]?.emailAddress || "Not available"}</p>
            <p><strong>Authentication Status:</strong> {user ? "Authenticated" : "Not authenticated"}</p>
          </div>
          
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-6"
          >
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Container className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">My Orders</h1>
          <p className="text-gray-600">View and manage your order history</p>
        </div>

        {orders?.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-none shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 font-poppins">Order History</h2>
                <span className="text-sm text-gray-500">
                  {orders.length} order{orders.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Number
                    </TableHead>
                    <TableHead className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </TableHead>
                    <TableHead className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </TableHead>
                    <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <OrdersComponent orders={orders} />
              </Table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-gray-50 border border-gray-200 rounded-none p-8 text-center max-w-md">
              <FileX className="h-16 w-16 text-gray-400 mb-4 mx-auto" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h2>
              <p className="text-sm text-gray-600 mb-6">
                It looks like you haven&apos;t placed any orders yet. Start shopping to see your orders here!
              </p>
              <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-none">
                <Link href="/shop">Browse Products</Link>
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrdersPage;
