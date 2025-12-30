import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const SECRET_KEY = process.env.JWT_KEY || "";

export async function proxy(req: NextRequest) {
  const enc = new TextEncoder();
  if (req.nextUrl.pathname === "/fire" && req.cookies.get("token")) {
    const token = req.cookies.get("token")?.value;
    try {
      const verified = await jose.jwtVerify(
        token?.split(" ")[1] || "",
        enc.encode(SECRET_KEY),
      );
      if (verified) {
        return NextResponse.redirect(new URL("/dboard", req.url));
      }
    } catch (error) {
      return NextResponse.next();
    }
  }
  if (req.nextUrl.pathname === "/dboard" && !req.cookies.get("token")) {
    return NextResponse.redirect(new URL("/fire", req.url));
  }
  if (req.nextUrl.pathname === "/dboard" && req.cookies.get("token")) {
    const token = req.cookies.get("token")?.value;
    try {
      const verified = await jose.jwtVerify(
        token?.split(" ")[1] || "",
        enc.encode(SECRET_KEY),
      );
      if (verified) {
        return NextResponse.next();
      }
    } catch (error) {
      //
    }
    return NextResponse.redirect(new URL("/fire", req.url));
  }
  if (req.nextUrl.pathname.startsWith("/api")) {
    if (req.cookies.get("token")) {
      const token = req.cookies.get("token")?.value;
      if (
        await jose.jwtVerify(token?.split(" ")[1] || "", enc.encode(SECRET_KEY))
      ) {
        return NextResponse.next();
      }
    }
    return NextResponse.error();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/fire", "/dboard", "/api/:path*"],
};
