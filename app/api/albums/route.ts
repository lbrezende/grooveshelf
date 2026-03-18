import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { albumSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const artistId = searchParams.get("artistId");

    const albums = await db.album.findMany({
      where: {
        artist: { userId: session.user.id },
        ...(artistId ? { artistId } : {}),
      },
      include: {
        artist: { select: { id: true, name: true, imageUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(albums);
  } catch (error) {
    console.error("[ALBUMS_GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar albums" },
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
    const parsed = albumSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Verify the artist belongs to the user
    const artist = await db.artist.findFirst({
      where: { id: parsed.data.artistId, userId: session.user.id },
    });

    if (!artist) {
      return NextResponse.json(
        { error: "Artista nao encontrado" },
        { status: 404 }
      );
    }

    const album = await db.album.create({
      data: parsed.data,
      include: {
        artist: { select: { id: true, name: true, imageUrl: true } },
      },
    });

    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    console.error("[ALBUMS_POST]", error);
    return NextResponse.json(
      { error: "Erro ao criar album" },
      { status: 500 }
    );
  }
}
