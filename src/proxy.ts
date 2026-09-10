import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isAdminRequest(req: NextRequest) {
  return req.nextUrl.pathname.startsWith("/admin");
}

export function proxy(req: NextRequest) {
  if (isAdminRequest(req)) {
    const cookie = req.cookies.get("admin_pin")?.value;
    if (!cookie || cookie !== process.env.ADMIN_PIN) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.rewrite(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
