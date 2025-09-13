import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const addressType = defineType({
  name: "address",
  title: "Address",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "userEmail",
      title: "User Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
      description: "Email address of the user who owns this address"
    }),
    defineField({
      name: "name",
      title: "Address Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Name for this address (e.g., Home, Office, etc.)"
    }),
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Recipient's full name"
    }),
    defineField({
      name: "address",
      title: "Full Address",
      type: "text",
      validation: (Rule) => Rule.required(),
      description: "Complete address including street, building, etc."
    }),
    defineField({
      name: "road",
      title: "Road/Street",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Road or street name"
    }),
    defineField({
      name: "pinCode",
      title: "PIN Code",
      type: "string",
      validation: (Rule) => Rule.required().min(6).max(6),
      description: "6-digit PIN code"
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "India"
    }),
    defineField({
      name: "state",
      title: "State",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "State or province"
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "City name"
    }),
    defineField({
      name: "isDefault",
      title: "Default Address",
      type: "boolean",
      initialValue: false,
      description: "Set as default address for this user"
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
      validation: (Rule) => Rule.required().min(10).max(15),
      description: "Contact phone number"
    })
  ],
  preview: {
    select: {
      name: "name",
      fullName: "fullName",
      address: "address",
      city: "city",
      state: "state",
      userEmail: "userEmail"
    },
    prepare(selection) {
      const { name, fullName, address, city, state, userEmail } = selection;
      return {
        title: `${name} - ${fullName}`,
        subtitle: `${address}, ${city}, ${state} (${userEmail})`,
        media: HomeIcon,
      };
    },
  },
});