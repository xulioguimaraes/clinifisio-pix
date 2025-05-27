import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function buildNextAuthOption(
  req: NextApiRequest | NextPageContext["req"],
  res: NextApiResponse | NextPageContext["res"]
): NextAuthOptions {
  return {
    secret: process.env.NEXT_AUTH_SECRET,
    session: {
      strategy: "jwt",
    },
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password required");
          }

          const {
            data: { user },
            error,
          } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !user) {
            throw new Error(error?.message || "Invalid credentials");
          }

          // Get user profile using Prisma
          const profile = await prisma.user.findUnique({
            where: {
              email: user.email,
            },
          });
      

          if (!profile) {
            throw new Error("User profile not found");
          }

          return {
            id: user.id,
            name: profile.name,
            email: profile.email,
            username: profile.username,
            avatar_url: profile.avatar_url,
            created_at: profile.created_at,
          };
        },
      }),
    ],

    callbacks: {
      async session({ session, token }) {
        if (token) {
          session.user.id = token.id;
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.username = token.username;
        
          session.user.avatar_url = token.avatar_url;
        }
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.username = user.username;
          token.avatar_url = user.avatar_url;
        }
        return token;
      },
    },
    pages: {
      signIn: "/login",
    },
  };
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOption(req, res));
}
