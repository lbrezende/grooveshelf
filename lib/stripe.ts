import Stripe from "stripe";

// Lazy-init proxy to avoid crash at build time when env vars are missing
function createStripeProxy(): Stripe {
  let instance: Stripe | null = null;
  return new Proxy({} as Stripe, {
    get(_target, prop) {
      if (!instance) {
        instance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: "2026-02-25.clover",
          typescript: true,
        });
      }
      return (instance as any)[prop];
    },
  });
}

export const stripe = createStripeProxy();

export async function createCheckoutSession(
  userId: string,
  email: string,
  stripeCustomerId?: string | null
) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: stripeCustomerId || undefined,
    customer_email: stripeCustomerId ? undefined : email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID_PRO!,
        quantity: 1,
      },
    ],
    metadata: { userId },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
  });

  return session;
}

export async function createCustomerPortalSession(
  stripeCustomerId: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  });

  return session;
}
