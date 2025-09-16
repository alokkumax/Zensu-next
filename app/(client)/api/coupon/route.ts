import { NextRequest, NextResponse } from "next/server";
import { getCouponByCode } from "@/sanity/queries";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.trim() || "";
    if (!code) {
      return NextResponse.json({ valid: false, reason: "Invalid Code" }, { status: 400 });
    }
    const coupon = await getCouponByCode(code);
    if (!coupon) {
      return NextResponse.json({ valid: false, reason: "Invalid Code" }, { status: 200 });
    }
    return NextResponse.json({ valid: true, coupon });
  } catch {
    return NextResponse.json({ valid: false, reason: "Invalid Code" }, { status: 200 });
  }
}


