import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  Calendar, 
  Mail, 
  User, 
  Package, 
  Download, 
  MapPin,
  CreditCard 
} from "lucide-react";
import { format } from "date-fns";

interface OrderDetailsDialogProps {
  order: MY_ORDERS_QUERYResult[number] | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package size={20} />
            Order Details - #{order?.orderNumber?.slice(-8)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <User size={16} />
                Customer Information
              </h3>
              <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-md">
                <div className="flex items-start gap-2">
                  <User size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">{order.customerName || "N/A"}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="break-all">
                    <span className="text-gray-600">{order.email || "N/A"}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-600">
                      {order.orderDate 
                        ? format(new Date(order.orderDate), "dd MMM yyyy 'at' HH:mm")
                        : "N/A"
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <CreditCard size={16} />
                Order Information
              </h3>
              <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  {order.status ? getStatusBadge(order.status) : (
                    <Badge className="bg-gray-100 text-gray-800 border-0 text-xs">
                      Unknown
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-mono text-xs">#{order?.orderNumber?.slice(-8)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Currency:</span>
                  <span className="uppercase text-xs">{order.currency || "USD"}</span>
                </div>
                {order?.invoice?.number && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Invoice:</span>
                    <span className="font-mono text-xs">{order.invoice.number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div className="space-y-3">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <MapPin size={16} />
                Shipping Address
              </h3>
              <div className="bg-gray-50 p-4 rounded-md text-sm">
                <div className="font-medium">{order.address.name}</div>
                <div className="text-gray-600 break-words">{order.address.address}</div>
                <div className="text-gray-600">{order.address.city}, {order.address.state} {order.address.zip}</div>
              </div>
            </div>
          )}

          {/* Products */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Ordered Products</h3>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-sm font-medium w-2/5">Product</TableHead>
                    <TableHead className="text-center text-sm font-medium w-16">Qty</TableHead>
                    <TableHead className="text-right text-sm font-medium w-24">Unit Price</TableHead>
                    <TableHead className="text-right text-sm font-medium w-24">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.products?.map((product, index) => (
                    <TableRow key={index} className="border-b">
                      <TableCell className="py-4">
                        <div className="flex items-start gap-3">
                          {product?.product?.images && (
                            <Image
                              src={urlFor(product?.product?.images[0]).url()}
                              alt="productImage"
                              width={60}
                              height={60}
                              className="border rounded object-cover flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm mb-1">
                              {product?.product?.name || "Unknown Product"}
                            </div>
                            {product?.product?.description && (
                              <div className="text-xs text-gray-500 leading-relaxed">
                                {product.product.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <span className="font-medium text-sm">{product?.quantity || 0}</span>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <PriceFormatter
                          amount={product?.product?.price}
                          className="text-black font-medium text-sm"
                        />
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <PriceFormatter
                          amount={(product?.product?.price || 0) * (product?.quantity || 0)}
                          className="text-black font-semibold text-sm"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2 bg-gray-50 p-4 rounded-md">
              {order?.amountDiscount && order.amountDiscount > 0 && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <PriceFormatter
                      amount={(order?.totalPrice || 0) + (order?.amountDiscount || 0)}
                      className="text-black font-medium"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <PriceFormatter
                      amount={-order.amountDiscount}
                      className="font-medium"
                    />
                  </div>
                </>
              )}
              <div className="border-t pt-2">
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total:</span>
                  <PriceFormatter
                    amount={order?.totalPrice}
                    className="text-black"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Download */}
          {order?.invoice?.hosted_invoice_url && (
            <div className="flex justify-center pt-2">
              <Button asChild className="bg-green-600 hover:bg-green-700 text-sm">
                <Link 
                  href={order.invoice.hosted_invoice_url} 
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <Download size={14} />
                  Download Invoice
                </Link>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;