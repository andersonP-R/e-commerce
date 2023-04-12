import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const requestedPage = req.nextUrl.pathname;
  const validRoles = ["admin", "super-user", "SEO"];
  // const url = req.nextUrl.clone();
  // url.pathname = `/auth/login`;
  // url.search = `p=${requestedPage}`;

  // if (!session) return NextResponse.redirect(new URL("/", req.url));

  if (session.user!.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // if (requestedPage.includes("/api")) {
  //   return new Response(JSON.stringify({ message: "No autorizado" }), {
  //     status: 401,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  // }

  // if (
  //   requestedPage.startsWith("/admin") &&
  //   !validRoles.includes(session.user.role)
  // ) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  // if (
  //   requestedPage.includes("/api/admin") &&
  //   !validRoles.includes(session.user.role)
  // ) {
  //   return new Response(JSON.stringify({ message: "No autorizado" }), {
  //     status: 401,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  // }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
