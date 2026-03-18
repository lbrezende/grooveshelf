import { Plan } from "@/lib/generated/prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: Plan;
      trialEndsAt: Date | null;
      stripeCurrentPeriodEnd: Date | null;
    } & DefaultSession["user"];
  }
}
