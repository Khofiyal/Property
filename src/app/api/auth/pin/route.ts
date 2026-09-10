import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json();
    const expected = process.env.ADMIN_PIN;
    if (!expected || pin !== expected) {
      return NextResponse.json({ error: "PIN salah" }, { status: 401 });
    }
    const res = NextResponse.redirect(new URL("/admin", req.url));
    res.cookies.set("admin_pin", pin, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 hari
      path: "/",
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
