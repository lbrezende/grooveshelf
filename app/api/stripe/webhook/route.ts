import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";
import { requireDatabase } from "@/lib/api-guard";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const dbError = requireDatabase(); if (dbError) return dbError;
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("[STRIPE_WEBHOOK] Signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data
          .object as Stripe.Checkout.Session;

        const userId = checkoutSession.metadata?.userId;
        if (!userId) break;

        const customerId = checkoutSession.customer as string;
        const subscriptionId = checkoutSession.subscription as string;

        // Retrieve subscription to get price and period end
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);

        const priceId = subscription.items.data[0]?.price.id;

        // Retrieve latest invoice to get current_period_end
        const latestInvoiceId =
          typeof subscription.latest_invoice === "string"
            ? subscription.latest_invoice
            : subscription.latest_invoice?.id;

        let periodEnd: Date | undefined;
        if (latestInvoiceId) {
          const invoice =
            await stripe.invoices.retrieve(latestInvoiceId);
          if (invoice.period_end) {
            periodEnd = new Date(invoice.period_end * 1000);
          }
        }

        await db.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            plan: "PRO",
            ...(periodEnd
              ? { stripeCurrentPeriodEnd: periodEnd }
              : {}),
          },
        });

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        // Stripe SDK v20+: subscription moved to parent.subscription_details
        const subscriptionId =
          (invoice as any).parent?.subscription_details?.subscription ??
          (invoice as any).subscription;

        if (!subscriptionId) break;

        const user = await db.user.findUnique({
          where: { stripeSubscriptionId: String(subscriptionId) },
        });

        if (!user) break;

        await db.user.update({
          where: { id: user.id },
          data: {
            stripeCurrentPeriodEnd: new Date(
              invoice.period_end * 1000
            ),
          },
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data
          .object as Stripe.Subscription;

        const user = await db.user.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (!user) break;

        const status = subscription.status;
        const priceId = subscription.items.data[0]?.price.id;

        await db.user.update({
          where: { id: user.id },
          data: {
            stripePriceId: priceId,
            plan:
              status === "active" || status === "trialing"
                ? "PRO"
                : "FREE",
          },
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data
          .object as Stripe.Subscription;

        const user = await db.user.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (!user) break;

        await db.user.update({
          where: { id: user.id },
          data: {
            plan: "FREE",
            stripePriceId: null,
            stripeSubscriptionId: null,
            stripeCurrentPeriodEnd: null,
          },
        });

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[STRIPE_WEBHOOK] Error handling event:", error);
    return NextResponse.json(
      { error: "Webhook handler error" },
      { status: 500 }
    );
  }
}
