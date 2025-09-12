import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body || {};

    const { userId } = await auth();
    let accountEmail: string | null = null;
    let accountName: string | null = null;
    if (userId) {
      const user = await currentUser();
      accountEmail = user?.emailAddresses?.[0]?.emailAddress || null;
      accountName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || null;
    }

    const doc = await backendClient.create({
      _type: "contactForm",
      name: name || accountName,
      email: email || accountEmail,
      phone: phone || "",
      subject: subject || "General inquiry",
      message: message || "",
      clerkUserId: userId || null,
      accountEmail,
      accountName,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, id: doc._id });
  } catch (err) {
    console.error("Contact form error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 