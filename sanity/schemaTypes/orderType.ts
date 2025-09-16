import { BasketIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "productName",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "selectedAddress",
      title: "Selected Address",
      type: "object",
      fields: [
        defineField({
          name: "fullName",
          title: "Full Name",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "address",
          title: "Address",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "state",
          title: "State",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "pinCode",
          title: "PIN Code",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "userDetails",
      title: "Logged In User Details",
      type: "object",
      fields: [
        defineField({
          name: "userId",
          title: "User ID",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "userName",
          title: "User Name",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "userEmail",
          title: "User Email",
          type: "string",
          validation: (Rule) => Rule.required().email(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stripePaymentDetails",
      title: "Stripe Payment Details",
      type: "object",
      fields: [
        defineField({
          name: "paymentIntentId",
          title: "Payment Intent ID",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "checkoutSessionId",
          title: "Checkout Session ID",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "amount",
          title: "Amount",
          type: "number",
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: "currency",
          title: "Currency",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "status",
          title: "Payment Status",
          type: "string",
          options: {
            list: [
              { title: "Pending", value: "pending" },
              { title: "Succeeded", value: "succeeded" },
              { title: "Failed", value: "failed" },
              { title: "Cancelled", value: "cancelled" },
            ],
          },
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "orderStatus",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "price",
              title: "Price Paid",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
              description: "The actual price paid for this item at the time of order",
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      orderNumber: "orderNumber",
      productName: "productName",
      userName: "userDetails.userName",
      amount: "stripePaymentDetails.amount",
      currency: "stripePaymentDetails.currency",
      orderDate: "orderDate",
    },
    prepare(select) {
      const date = select.orderDate ? new Date(select.orderDate).toLocaleDateString() : "No date";
      return {
        title: `Order ${select.orderNumber}`,
        subtitle: `${select.productName} - ${select.userName} - ${select.amount} ${select.currency} - ${date}`,
        media: BasketIcon,
      };
    },
  },
});
