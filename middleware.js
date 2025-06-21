import { NextResponse } from "next/server"

export function middleware(request) {
  const token = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

  // Public routes that don't need authentication
  const publicRoutes = ["/login", "/otp"]
  const isPublicRoute = publicRoutes.includes(pathname)

  // If user has token and tries to access login/otp, redirect to dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If user doesn't have token and tries to access protected route, redirect to login
  if (!token && !isPublicRoute && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If user accesses root path
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } else {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
