import { Plan } from "@/lib/generated/prisma/client";

type UserWithPlan = {
  plan: Plan;
  trialEndsAt: Date | null;
  stripeCurrentPeriodEnd: Date | null;
};

export function isTrialActive(user: UserWithPlan): boolean {
  return (
    user.plan === "TRIAL" &&
    user.trialEndsAt !== null &&
    new Date(user.trialEndsAt) > new Date()
  );
}

export function isSubscribed(user: UserWithPlan): boolean {
  return (
    user.plan === "PRO" &&
    user.stripeCurrentPeriodEnd !== null &&
    new Date(user.stripeCurrentPeriodEnd) > new Date()
  );
}

export function hasAccess(user: UserWithPlan): boolean {
  return isTrialActive(user) || isSubscribed(user);
}

export function daysLeftInTrial(user: UserWithPlan): number {
  if (!user.trialEndsAt || user.plan !== "TRIAL") return 0;
  const diff = new Date(user.trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// Plan limits
export const PLAN_LIMITS = {
  FREE: {
    maxWishlistItems: 20,
    maxPriceAlerts: 3,
    monthlyListEnabled: false,
  },
  TRIAL: {
    maxWishlistItems: Infinity,
    maxPriceAlerts: Infinity,
    monthlyListEnabled: true,
  },
  PRO: {
    maxWishlistItems: Infinity,
    maxPriceAlerts: Infinity,
    monthlyListEnabled: true,
  },
} as const;

export async function checkUsageLimit(
  user: UserWithPlan,
  resource: "wishlistItems" | "priceAlerts" | "monthlyList",
  currentCount: number
): Promise<{ allowed: boolean; limit: number; current: number }> {
  const limits = PLAN_LIMITS[user.plan];

  switch (resource) {
    case "wishlistItems":
      return {
        allowed: currentCount < limits.maxWishlistItems,
        limit: limits.maxWishlistItems,
        current: currentCount,
      };
    case "priceAlerts":
      return {
        allowed: currentCount < limits.maxPriceAlerts,
        limit: limits.maxPriceAlerts,
        current: currentCount,
      };
    case "monthlyList":
      return {
        allowed: limits.monthlyListEnabled,
        limit: limits.monthlyListEnabled ? Infinity : 0,
        current: currentCount,
      };
  }
}
