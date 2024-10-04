import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/signin',
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("Sign In Callback:", { user, account, profile, email, credentials });
      if (account?.error) {
        console.error("Sign In Error:", account.error);
        return false;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect Callback:", { url, baseUrl });
      if (url.startsWith("/")) {
        const finalUrl = `${baseUrl}${url}`;
        console.log("Redirecting to relative URL:", finalUrl);
        return finalUrl;
      } else if (new URL(url).origin === baseUrl) {
        console.log("Redirecting to same-origin URL:", url);
        return url;
      }
      console.log("Redirecting to base URL:", baseUrl);
      return baseUrl;
    },
    async session({ token, session }) {
      console.log("Session Callback:", { token, session });
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }
      return session
    },
    async jwt({ token, user }) {
      console.log("JWT Callback:", { token, user });
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
  },
  debug: true, // Enable debug messages
}
