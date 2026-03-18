import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { monthlyListSchema } from "@/lib/validations";
import { PLAN_LIMITS } from "@/lib/subscription";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const lists = await db.monthlyList.findMany({
      where: { userId: session.user.id },
      orderBy: { month: "desc" },
    });

    return NextResponse.json(lists);
  } catch (error) {
    console.error("[MONTHLY_LIST_GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar listas mensais" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = monthlyListSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Check if monthly list is enabled for the user's plan
    const dbUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, trialEndsAt: true, stripeCurrentPeriodEnd: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const limits = PLAN_LIMITS[dbUser.plan];
    if (!limits.monthlyListEnabled) {
      return NextResponse.json(
        { error: "Recurso disponível apenas no plano PRO" },
        { status: 403 }
      );
    }

    // Upsert: create or update for the same month
    const list = await db.monthlyList.upsert({
      where: {
        userId_month: {
          userId: session.user.id,
          month: parsed.data.month,
        },
      },
      create: {
        ...parsed.data,
        userId: session.user.id,
      },
      update: {
        budget: parsed.data.budget,
        itemIds: parsed.data.itemIds,
      },
    });

    return NextResponse.json(list, { status: 201 });
  } catch (error) {
    console.error("[MONTHLY_LIST_POST]", error);
    return NextResponse.json(
      { error: "Erro ao salvar lista mensal" },
      { status: 500 }
    );
  }
}
