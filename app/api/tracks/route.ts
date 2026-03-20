import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { trackSchema } from "@/lib/validations";
import { requireDatabase } from "@/lib/api-guard";

export async function GET(request: Request) {
  const dbError = requireDatabase(); if (dbError) return dbError;
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get("albumId");

    const tracks = await db.track.findMany({
      where: {
        album: { artist: { userId: session.user.id } },
        ...(albumId ? { albumId } : {}),
      },
      orderBy: { title: "asc" },
    });

    return NextResponse.json(tracks);
  } catch (error) {
    console.error("[TRACKS_GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar faixas" },
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
    const parsed = trackSchema.safeParse(body);

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

    const track = await db.track.create({
      data: parsed.data,
    });

    return NextResponse.json(track, { status: 201 });
  } catch (error) {
    console.error("[TRACKS_POST]", error);
    return NextResponse.json(
      { error: "Erro ao criar faixa" },
      { status: 500 }
    );
  }
}
