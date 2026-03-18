import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  createCheckoutSession,
  createCustomerPortalSession,
} from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { action } = body;

    const dbUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true, email: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    if (action === "portal") {
      if (!dbUser.stripeCustomerId) {
        return NextResponse.json(
          { error: "Nenhuma assinatura encontrada" },
          { status: 400 }
        );
      }

      const portalSession = await createCustomerPortalSession(
        dbUser.stripeCustomerId
      );

      return NextResponse.json({ url: portalSession.url });
    }

    // Default: create checkout session
    const checkoutSession = await createCheckoutSession(
      session.user.id,
      dbUser.email,
      dbUser.stripeCustomerId
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[BILLING_POST]", error);
    return NextResponse.json(
      { error: "Erro ao processar billing" },
      { status: 500 }
    );
  }
}
