import { defineField, defineType } from "sanity";

export const newsletterSubscriptionType = defineType({
  name: "newsletterSubscription",
  title: "Newsletters Subscriptions",
  type: "document",
  fields: [
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "clerkUserId", title: "Clerk User ID", type: "string" }),
    defineField({ name: "accountEmail", title: "Account Email", type: "string" }),
    defineField({ name: "accountName", title: "Account Name", type: "string" }),
    defineField({ name: "createdAt", title: "Created At", type: "datetime" }),
  ],
  preview: {
    select: { title: "email", subtitle: "accountEmail" },
  },
}); 