import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  console.log("Middleware called for path:", req.nextUrl.pathname);
  const token = await getToken({ req })
  console.log("Token:", token ? "exists" : "does not exist");
  const isAuth = !!token
  const isAuthPage = req.nextUrl.pathname.startsWith("/signin")

  if (isAuthPage) {
    if (isAuth) {
      console.log("Redirecting authenticated user from signin to dashboard");
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    console.log("Allowing access to signin page");
    return null
  }

  if (!isAuth) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    console.log("Redirecting unauthenticated user to signin");
    return NextResponse.redirect(
      new URL(`/signin?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  console.log("Allowing access to protected route");
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/api/auth/callback/:path*"],
}
