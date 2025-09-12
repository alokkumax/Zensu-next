import { defineField, defineType } from "sanity";

export const salesTabType = defineType({
  name: "salesTab",
  title: "Sales Tab",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: "isCoupon",
      title: "Is Coupon Item?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "couponCode",
      title: "Coupon Code",
      type: "string",
      hidden: ({ parent }) => !parent?.isCoupon,
      validation: (rule) => rule.custom((val, ctx) => {
        if (ctx.parent?.isCoupon && !val) return "Coupon code required when item is coupon";
        return true;
      }),
    }),
    defineField({
      name: "percentOff",
      title: "% Discount (optional)",
      type: "number",
      hidden: ({ parent }) => !parent?.isCoupon,
      validation: (rule) => rule.min(1).max(100).optional(),
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "priority",
      title: "Priority (lower shows first)",
      type: "number",
      initialValue: 10,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "couponCode" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? `Code: ${subtitle}` : "Info",
    }),
  },
});


