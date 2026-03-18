import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { wishlistItemSchema } from "@/lib/validations";
import { PLAN_LIMITS } from "@/lib/subscription";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const items = await db.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        album: {
          include: {
            artist: { select: { id: true, name: true, imageUrl: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("[WISHLIST_GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar wishlist" },
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
    const parsed = wishlistItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Check plan limits
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

    const count = await db.wishlistItem.count({
      where: { userId: session.user.id },
    });

    const limits = PLAN_LIMITS[dbUser.plan];
    if (count >= limits.maxWishlistItems) {
      return NextResponse.json(
        { error: "Limite atingido" },
        { status: 403 }
      );
    }

    const item = await db.wishlistItem.create({
      data: {
        ...parsed.data,
        userId: session.user.id,
      },
      include: {
        album: {
          include: {
            artist: { select: { id: true, name: true, imageUrl: true } },
          },
        },
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("[WISHLIST_POST]", error);
    return NextResponse.json(
      { error: "Erro ao adicionar à wishlist" },
      { status: 500 }
    );
  }
}
