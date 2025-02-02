import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
} from "next-auth/adapters";
import { destroyCookie, parseCookies } from "nookies";
import { prisma } from "../prisma";

export function PrismaAdapter(
  req: NextApiRequest | NextPageContext["req"],
  res: NextApiResponse | NextPageContext["res"]
): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      const { "@call:userId": userIdOnCookies } = parseCookies({ req });

      if (!userIdOnCookies) {
        throw new Error("User ID not found on cookies");
      }

      const primaryUser = await prisma.user.update({
        where: { id: userIdOnCookies },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      });

      destroyCookie({ res }, "@call:userId", { path: "/" });
      return {
        id: primaryUser.id,
        email: primaryUser.email!,
        name: primaryUser.name,
        username: primaryUser.username,
        emailVerified: null,
        avatar_url: primaryUser.avatar_url!,
      };
    },

    async getUser(id: string) {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) return null;

      return {
        id: user.id,
        email: user.email!,
        name: user.name,
        username: user.username,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      };
    },

    async getUserByEmail(email: string) {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) return null;

      return {
        id: user.id,
        email: user.email!,
        name: user.name,
        username: user.username,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      };
    },

    async getUserByAccount({
      providerAccountId,
      provider,
    }: {
      providerAccountId: string;
      provider: string;
    }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: { user: true },
      });

      if (!account) return null;

      const { user } = account;

      return {
        id: user.id,
        email: user.email!,
        name: user.name,
        username: user.username,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      };
    },

    async updateUser(user: Partial<AdapterUser>) {
      if (!user.id) {
        throw new Error("User ID is required for update.");
      }

      const prismaUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      });

      return {
        id: prismaUser.id,
        email: prismaUser.email!,
        name: prismaUser.name,
        username: prismaUser.username,
        emailVerified: null,
        avatar_url: prismaUser.avatar_url!,
      };
    },

    async deleteUser(userId: string) {
      await prisma.user.delete({ where: { id: userId } });
    },

    async linkAccount(account: AdapterAccount) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      });
    },

    async unlinkAccount({
      providerAccountId,
      provider,
    }: {
      providerAccountId: string;
      provider: string;
    }) {
      await prisma.account.delete({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
      });
    },

    async createSession({ sessionToken, userId, expires }: AdapterSession) {
      await prisma.session.create({
        data: { session_token: sessionToken, expires, user_id: userId },
      });

      return { userId, sessionToken, expires };
    },

    async getSessionAndUser(sessionToken: string) {
      const prismaSession = await prisma.session.findUnique({
        where: { session_token: sessionToken },
        include: { user: true },
      });

      if (!prismaSession) return null;

      const { user, ...session } = prismaSession;

      return {
        session: {
          expires: session.expires,
          sessionToken: session.session_token,
          userId: session.user_id,
        },
        user: {
          id: user.id,
          email: user.email!,
          name: user.name,
          username: user.username,
          emailVerified: null,
          avatar_url: user.avatar_url!,
        },
      };
    },

    async updateSession(
      session: Partial<AdapterSession> & { sessionToken: string }
    ) {
      if (!session.sessionToken) {
        throw new Error("Session token is required for update.");
      }

      const prismaSession = await prisma.session.update({
        where: { session_token: session.sessionToken },
        data: {
          expires: session.expires ?? new Date(), // Garante que não seja undefined
          user_id: session.userId,
        },
      });

      return {
        expires: prismaSession.expires,
        sessionToken: prismaSession.session_token,
        userId: prismaSession.user_id,
      };
    },

    async deleteSession(sessionToken: string) {
      await prisma.session.delete({ where: { session_token: sessionToken } });
    },
  };
}
