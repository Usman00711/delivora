import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/dashboard")) {
      if (token?.role === "CLIENT") {
        return NextResponse.redirect(new URL("/client", req.url));
      }
    }

    if (pathname.startsWith("/client")) {
      if (token?.role === "AGENCY_OWNER" || token?.role === "AGENCY_MEMBER") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        return Boolean(token);
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/client/:path*"],
};
