import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const requestedPage = req.nextUrl.pathname;
  const validRoles = ["admin", "super-user", "SEO"];

  if (!session) {
    const url = req.nextUrl.clone();
    console.log(url);
    url.pathname = `/auth/login`;
    console.log(url);
    url.search = `p=${requestedPage}`;

    // if (requestedPage.includes("/api")) {
    //   return new Response(JSON.stringify({ message: "No autorizado" }), {
    //     status: 401,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    // }

    return NextResponse.redirect(url);
  }

  if (
    requestedPage.startsWith("/admin") &&
    !validRoles.includes(session.user.role)
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

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
  matcher: [
    "/admin/:path*",
    "/api/orders/:path*",
    "/api/admin/:path*",
    "/checkout/:path*",
  ],
};
