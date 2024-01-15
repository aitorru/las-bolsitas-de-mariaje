import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
//import jwt from 'jsonwebtoken';
import jwt from "@tsndr/cloudflare-worker-jwt";
const SECRET_KEY = process.env.JWT_KEY || "";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/fire" && req.cookies.get("token")) {
    const token = req.cookies.get("token")?.value;
    try {
      if (await jwt.verify(token?.split(" ")[1] || "", SECRET_KEY)) {
        return NextResponse.redirect(new URL("/dboard", req.url));
      }
    } catch (error) {
      return NextResponse.next();
    }
  }
  if (req.nextUrl.pathname === "/dboard" && !req.cookies.get("token")) {
    console.log("No token found");
    return NextResponse.redirect(new URL("/fire", req.url));
  }
  if (req.nextUrl.pathname === "/dboard" && req.cookies.get("token")) {
    console.log("Token found");
    const token = req.cookies.get("token")?.value;
    console.log(token);
    if (await jwt.verify(token?.split(" ")[1] || "", SECRET_KEY)) {
      console.log("Token verified");
      return NextResponse.next();
    }
    console.log("Token not verified");
    return NextResponse.redirect(new URL("/fire", req.url));
  }
  if (
    req.nextUrl.pathname.startsWith("/api") &&
    !req.nextUrl.pathname.startsWith("/api/login")
  ) {
    if (req.cookies.get("token")) {
      const token = req.cookies.get("token")?.value;
      if (await jwt.verify(token?.split(" ")[1] || "", SECRET_KEY)) {
        return NextResponse.next();
      }
    }
    return NextResponse.error();
  }
  return NextResponse.next();
}
