import { defineField, defineType } from "sanity";

export const couponType = defineType({
  name: "coupon",
  title: "Coupon",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "code",
      title: "Code",
      type: "string",
      description: "Enter the coupon code users will type",
      validation: (rule) => rule.required().regex(/^[A-Z0-9_-]+$/i, { name: "alphanumeric" }).min(3).max(32),
    }),
    defineField({
      name: "percentOff",
      title: "% Discount",
      type: "number",
      description: "Percentage to discount from MRP/Subtotal",
      validation: (rule) => rule.required().min(1).max(100),
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "startsAt",
      title: "Start Date",
      type: "datetime",
    }),
    defineField({
      name: "endsAt",
      title: "End Date",
      type: "datetime",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "code" },
  },
});


