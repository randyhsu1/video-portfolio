import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the request is for the admin area (except login)
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.includes("/login")) {
    // Check if the user is authenticated
    const isAuthenticated = request.cookies.get("admin_authenticated")?.value === "true"

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

