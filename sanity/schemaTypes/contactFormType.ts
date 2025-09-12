import { defineField, defineType } from "sanity";

export const contactFormType = defineType({
  name: "contactForm",
  title: "Contact Form",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "subject", title: "Subject", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text" }),
    defineField({ name: "clerkUserId", title: "Clerk User ID", type: "string" }),
    defineField({ name: "accountEmail", title: "Account Email", type: "string" }),
    defineField({ name: "accountName", title: "Account Name", type: "string" }),
    defineField({ name: "createdAt", title: "Created At", type: "datetime" }),
  ],
  preview: {
    select: { title: "subject", subtitle: "email" },
  },
}); 