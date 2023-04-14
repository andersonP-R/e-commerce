import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/category/kid", req.url));
  }
}

export const config = { matcher: "/admin/users" };
