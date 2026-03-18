import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { listeningSessionSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sessions = await db.listeningSession.findMany({
      where: { userId: session.user.id },
      include: {
        album: {
          include: {
            artist: { select: { id: true, name: true, imageUrl: true } },
          },
        },
      },
      orderBy: { listenedAt: "desc" },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("[LISTENING_GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar sessões" },
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
    const parsed = listeningSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Verify the album belongs to the user
    const album = await db.album.findFirst({
      where: {
        id: parsed.data.albumId,
        artist: { userId: session.user.id },
      },
    });

    if (!album) {
      return NextResponse.json(
        { error: "Album nao encontrado" },
        { status: 404 }
      );
    }

    const listeningSession = await db.listeningSession.create({
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

    return NextResponse.json(listeningSession, { status: 201 });
  } catch (error) {
    console.error("[LISTENING_POST]", error);
    return NextResponse.json(
      { error: "Erro ao criar sessão" },
      { status: 500 }
    );
  }
}
