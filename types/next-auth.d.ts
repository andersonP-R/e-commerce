import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      _id: string;
      name: string;
      email: string;
      password?: string;
      role: string;
    };
  }
}
