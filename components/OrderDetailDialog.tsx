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
                    <span className="font-medium">{order.userDetails?.userName || "N/A"}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="break-all">
                    <span className="text-gray-600">{order.userDetails?.userEmail || "N/A"}</span>
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
                  {order.orderStatus ? getStatusBadge(order.orderStatus) : (
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
                  <span className="uppercase text-xs">{order.stripePaymentDetails?.currency || "INR"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="text-xs">{order.stripePaymentDetails?.status || "Unknown"}</span>
                </div>
                {order.stripePaymentDetails?.last4 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Card:</span>
                    <span className="font-mono text-xs">****{order.stripePaymentDetails.last4}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.selectedAddress && (
            <div className="space-y-3">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <MapPin size={16} />
                Shipping Address
              </h3>
              <div className="bg-gray-50 p-4 rounded-md text-sm">
                <div className="font-medium">{order.selectedAddress.fullName}</div>
                <div className="text-gray-600 break-words">{order.selectedAddress.address}</div>
                <div className="text-gray-600">{order.selectedAddress.city}, {order.selectedAddress.state} {order.selectedAddress.pinCode}</div>
                {order.selectedAddress.phone && (
                  <div className="text-gray-600">Phone: {order.selectedAddress.phone}</div>
                )}
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
                  {order.products?.map((item, index) => (
                    <TableRow key={index} className="border-b">
                      <TableCell className="py-4">
                        <div className="flex items-start gap-3">
                          {item?.product?.images?.[0] && (
                            <Image
                              src={urlFor(item.product.images[0]).url()}
                              alt="productImage"
                              width={60}
                              height={60}
                              className="border rounded object-cover flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm mb-1">
                              {item?.product?.name || "Unknown Product"}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {item?.product?._id || "N/A"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <span className="font-medium text-sm">{item?.quantity || 0}</span>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <PriceFormatter
                          amount={item?.price || 0}
                          currency={order?.stripePaymentDetails?.currency}
                          className="text-black font-medium text-sm"
                        />
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <PriceFormatter
                          amount={(item?.price || 0) * (item?.quantity || 0)}
                          currency={order?.stripePaymentDetails?.currency}
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
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <PriceFormatter
                  amount={order?.totalPrice || 0}
                  currency={order?.stripePaymentDetails?.currency}
                  className="text-black font-medium"
                />
              </div>
              {order?.amountDiscount && order.amountDiscount > 0 && (
                <div className="flex items-center justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <PriceFormatter
                    amount={-order.amountDiscount}
                    currency={order?.stripePaymentDetails?.currency}
                    className="font-medium"
                  />
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total Paid:</span>
                  <PriceFormatter
                    amount={order?.stripePaymentDetails?.amount || order?.totalPrice || 0}
                    currency={order?.stripePaymentDetails?.currency}
                    className="text-black"
                  />
                </div>
              </div>
              
              {/* Download Invoice Button */}
              {order?.invoice?.hosted_invoice_url && (
                <div className="border-t pt-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-2 border-gray-200 hover:border-gray-400"
                  >
                    <Link
                      href={order.invoice.hosted_invoice_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Download size={16} />
                      Download Invoice
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Order Info */}
          {order?.trackingNumber && (
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Tracking Information</h3>
              <div className="bg-gray-50 p-4 rounded-md text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tracking Number:</span>
                  <span className="font-mono">{order.trackingNumber}</span>
                </div>
                {order.shippingMethod && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600">Shipping Method:</span>
                    <span>{order.shippingMethod}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Notes */}
          {order?.notes && (
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Order Notes</h3>
              <div className="bg-gray-50 p-4 rounded-md text-sm">
                <p className="text-gray-700">{order.notes}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;