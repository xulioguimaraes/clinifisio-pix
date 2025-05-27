import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string | null;
    username: string;
    avatar_url: string | null;
  }
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string | null;
    username: string;
    avatar_url: string | null;
  }
}

