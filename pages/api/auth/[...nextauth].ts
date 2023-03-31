import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "@/database";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Custom login",
      credentials: {
        email: {
          label: "Correo",
          type: "email",
          placeholder: "example@gmail.com",
        },
        password: {
          label: "Contraseña",
          type: "password",
          placeholder: "******",
        },
      },
      async authorize(credentials): Promise<any> {
        // console.log({ credentials });
        return await dbUsers.checkUserEmailPassWord(
          credentials!.email,
          credentials!.password
        );
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],

  // Custom pages
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },

  // Establecer la duración de la sesión
  session: {
    maxAge: 2592000, // duración de la sesión (30 días en este caso )
    strategy: "jwt", // a través de
    updateAge: 86400, // se actualiza cada (1 día en este caso)
  },

  // Callbacks
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {
          case "oauth":
            token.user = await dbUsers.oAuthToDbUser(
              user?.email || "",
              user?.name || ""
            );
            break;

          case "credentials":
            token.user = user;
            break;
        }
      }

      return token;
    },

    async session({ session, token, user }) {
      session.accessToken = token.accessToken as string;
      session.user = token.user as any;

      return session;
    },
  },
};

export default NextAuth(authOptions);
