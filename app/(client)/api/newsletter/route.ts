import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body?.email as string)?.trim();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      return NextResponse.json({ error: "Please use a valid @gmail.com address" }, { status: 400 });
    }

    const { userId } = await auth();
    let accountEmail: string | null = null;
    let accountName: string | null = null;
    if (userId) {
      const user = await currentUser();
      accountEmail = user?.emailAddresses?.[0]?.emailAddress || null;
      accountName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || null;
    }

    const doc = await backendClient.create({
      _type: "newsletterSubscription",
      email,
      clerkUserId: userId || null,
      accountEmail,
      accountName,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, id: doc._id });
  } catch (err) {
    console.error("Newsletter subscribe error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 