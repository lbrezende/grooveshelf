import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db, hasDatabase } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...(hasDatabase ? { adapter: PrismaAdapter(db as any) } : {}),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "placeholder",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "placeholder",
    }),
    ...(process.env.AUTH_RESEND_KEY
      ? [
          Resend({
            apiKey: process.env.AUTH_RESEND_KEY,
            from: process.env.RESEND_FROM_EMAIL || "noreply@grooveshelf.com",
          }),
        ]
      : []),
  ],
  secret: process.env.AUTH_SECRET || "dev-secret-change-me-in-production",
  pages: {
    signIn: "/login",
    error: "/login",
  },
  events: {
    async createUser({ user }) {
      if (!hasDatabase) return;
      await db.user.update({
        where: { id: user.id },
        data: {
          plan: "TRIAL",
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      });
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && hasDatabase) {
        session.user.id = user.id;
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: {
            plan: true,
            trialEndsAt: true,
            stripeCurrentPeriodEnd: true,
          },
        });
        if (dbUser) {
          (session.user as any).plan = dbUser.plan;
          (session.user as any).trialEndsAt = dbUser.trialEndsAt;
          (session.user as any).stripeCurrentPeriodEnd =
            dbUser.stripeCurrentPeriodEnd;
        }
      }
      return session;
    },
  },
});
