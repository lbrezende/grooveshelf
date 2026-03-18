import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { artistSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const artists = await db.artist.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(artists);
  } catch (error) {
    console.error("[ARTISTS_GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar artistas" },
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
    const parsed = artistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const artist = await db.artist.create({
      data: {
        ...parsed.data,
        userId: session.user.id,
      },
    });

    return NextResponse.json(artist, { status: 201 });
  } catch (error) {
    console.error("[ARTISTS_POST]", error);
    return NextResponse.json(
      { error: "Erro ao criar artista" },
      { status: 500 }
    );
  }
}
