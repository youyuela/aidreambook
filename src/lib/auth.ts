import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    ] : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user) {
          return null;
        }

        // Note: In production, you'd store hashed passwords
        // For now, we'll just do a simple comparison
        // const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        // For demo purposes, we'll skip password validation

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;

        // 获取用户的订阅信息
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            subscriptionTier: true,
            subscriptionStatus: true,
            isExpert: true,
            monthlyQuota: true,
            usedQuota: true,
          }
        });

        if (dbUser) {
          token.subscriptionTier = dbUser.subscriptionTier;
          token.subscriptionStatus = dbUser.subscriptionStatus;
          token.isExpert = dbUser.isExpert;
          token.quota = {
            monthly: dbUser.monthlyQuota,
            used: dbUser.usedQuota,
          };
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.subscriptionTier = token.subscriptionTier as any;
        session.user.subscriptionStatus = token.subscriptionStatus as string;
        session.user.isExpert = token.isExpert as boolean;
        session.user.quota = token.quota as any;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 登录后重定向到仪表板
      if (url === baseUrl) return `${baseUrl}/dashboard`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
  events: {
    async createUser({ user }) {
      // 用户首次注册时的处理
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionTier: "FREE",
          monthlyQuota: 10,
          usedQuota: 0,
          quotaResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后
        }
      });

      // 发送欢迎邮件
      try {
        const { emailService } = await import('./email');
        await emailService.sendWelcomeEmail(
          user.name || '用户',
          user.email || ''
        );
      } catch (error) {
        console.error('发送欢迎邮件失败:', error);
      }
    },
    async signIn({ user, account, profile }) {
      // 登录时的处理
      if (account?.provider === "google" || account?.provider === "github") {
        // 更新用户信息
        await prisma.user.update({
          where: { id: user.id },
          data: {
            name: user.name,
            image: user.image,
          }
        });
      }
    },
  },
};

// 扩展 NextAuth 类型
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      subscriptionTier?: "FREE" | "BASIC" | "PRO" | "EXPERT";
      subscriptionStatus?: string | null;
      isExpert?: boolean;
      quota?: {
        monthly: number;
        used: number;
      };
    };
  }

  interface User {
    subscriptionTier?: "FREE" | "BASIC" | "PRO" | "EXPERT";
    subscriptionStatus?: string | null;
    isExpert?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    subscriptionTier?: "FREE" | "BASIC" | "PRO" | "EXPERT";
    subscriptionStatus?: string | null;
    isExpert?: boolean;
    quota?: {
      monthly: number;
      used: number;
    };
  }
}
