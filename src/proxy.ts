import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function proxy(request: NextRequest) {
  const pathname = normalizePathname(request.nextUrl.pathname);

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isLoginRoute = pathname === "/admin/login";
  const session = request.cookies.get("admin_session");
  const isAuthenticated = session?.value === "authenticated";

  if (isLoginRoute) {
    if (isAuthenticated) {
      const adminUrl = request.nextUrl.clone();
      adminUrl.pathname = "/admin";
      return NextResponse.redirect(adminUrl);
    }

    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
