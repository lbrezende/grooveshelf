import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { wishlistItemSchema } from "@/lib/validations";
import { PLAN_LIMITS } from "@/lib/subscription";
import { requireDatabase } from "@/lib/api-guard";

export async function GET() {
  const dbError = requireDatabase(); if (dbError) return dbError;
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
  const dbError = requireDatabase(); if (dbError) return dbError;
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

export async function PATCH(request: Request) {
  const dbError = requireDatabase(); if (dbError) return dbError;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 }
      );
    }

    const item = await db.wishlistItem.update({
      where: { id },
      data: { status },
      include: { album: { include: { artist: true } } },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[WISHLIST_PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const dbError = requireDatabase(); if (dbError) return dbError;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await db.wishlistItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[WISHLIST_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    );
  }
}
