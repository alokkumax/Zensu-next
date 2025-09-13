"use client";

import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import { TableBody, TableCell, TableRow } from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import PriceFormatter from "./PriceFormatter";
import { format } from "date-fns";
import { Eye, Package } from "lucide-react";
import { useState } from "react";
import OrderDetailDialog from "./OrderDetailDialog";
import { Badge } from "./ui/badge";

const OrdersComponent = ({ orders }: { orders: MY_ORDERS_QUERYResult }) => {
  const [selectedOrder, setSelectedOrder] = useState<
    MY_ORDERS_QUERYResult[number] | null
  >(null);

  if (!orders || orders.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={8} className="px-6 py-12 text-center text-gray-500">
            <div className="flex flex-col items-center gap-2">
              <Package size={24} className="text-gray-400" />
              <span className="text-sm">No orders found</span>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { color: "bg-green-100 text-green-800", label: "Paid" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      processing: { color: "bg-blue-100 text-blue-800", label: "Processing" },
      shipped: { color: "bg-purple-100 text-purple-800", label: "Shipped" },
      delivered: { color: "bg-green-100 text-green-800", label: "Delivered" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { color: "bg-gray-100 text-gray-800", label: status };

    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <>
      <TableBody>
        <TooltipProvider>
          {orders.map((order, index) => (
            <Tooltip key={order?._id || order?.orderNumber || index}>
              <TooltipTrigger asChild>
                <TableRow
                  className="cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200"
                  onClick={() => setSelectedOrder(order)}
                >
                  <TableCell className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-gray-400" />
                      <span className="font-mono text-sm">
                        {order.orderNumber ? `#${order.orderNumber.slice(-8)}` : "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell px-6 py-4">
                    {order?.orderDate ? (
                      <div className="text-sm">
                        <div>{format(new Date(order.orderDate), "dd/MM/yyyy")}</div>
                        <div className="text-gray-500 text-xs">
                          {format(new Date(order.orderDate), "HH:mm")}
                        </div>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="font-medium text-sm">{order.userDetails?.userName || "N/A"}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell px-6 py-4">
                    <div className="text-sm text-gray-600 truncate max-w-[150px]">
                      {order.userDetails?.userEmail || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <PriceFormatter
                      amount={order?.orderTotals?.total ? order.orderTotals.total / 100 : 0}
                      className="text-black font-semibold text-sm"
                    />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {order?.orderStatus ? getStatusBadge(order.orderStatus) : (
                      <Badge className="bg-gray-100 text-gray-800 border-0 text-xs">
                        Unknown
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell px-6 py-4">
                    {order?.stripePaymentDetails?.checkoutSessionId ? (
                      <div className="text-sm font-mono">
                        {order.stripePaymentDetails.checkoutSessionId.slice(-8)}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No session</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <Eye 
                        size={16} 
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to view order details</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </TableBody>
      <OrderDetailDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};

export default OrdersComponent;