import { auth } from "@/src/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  // Allow unauthenticated POST to these routes (warga submits without login)
  const isPublicPost = (req.nextUrl.pathname.startsWith("/api/permohonan") ||
                        req.nextUrl.pathname.startsWith("/api/pengaduan")) &&
                       req.method === "POST";
  const isProtectedApi = req.nextUrl.pathname.startsWith("/api/permohonan") ||
                          req.nextUrl.pathname.startsWith("/api/pengaduan");

  if ((isDashboard || (isProtectedApi && !isPublicPost)) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/permohonan/:path*", "/api/pengaduan/:path*"],
};
