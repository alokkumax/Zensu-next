import { NextResponse } from "next/server";
import { getSalesTabs } from "@/sanity/queries";

export async function GET() {
  try {
    const tabs = await getSalesTabs();
    return NextResponse.json({ tabs });
  } catch (e) {
    return NextResponse.json({ tabs: [] });
  }
}


