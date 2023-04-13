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

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
