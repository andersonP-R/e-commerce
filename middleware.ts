import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    console.log(req.nextUrl.pathname);
  }
  // {
  //   callbacks: {
  //     authorized: ({ token }: any) => token?.user.role === "admin",
  //   },
  // }
);

export const config = { matcher: ["/search"] };
