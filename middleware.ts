import { auth } from "@/src/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isApi = req.nextUrl.pathname.startsWith("/api/permohonan") ||
                req.nextUrl.pathname.startsWith("/api/pengaduan");

  if ((isDashboard || isApi) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/permohonan/:path*", "/api/pengaduan/:path*"],
};
