import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

function createPrismaClient() {
  const connectionString =
    process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

  if (connectionString?.startsWith("prisma+postgres")) {
    return new PrismaClient({
      accelerateUrl: connectionString,
    } as any);
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool as any);
  return new PrismaClient({ adapter } as any);
}

const prisma = createPrismaClient();

// Fixed IDs for idempotent upserts
const DEMO_USER_ID = "seed_demo_user_001";

const SEED_DATA = [
  {
    artistId: "seed_artist_taylor_swift",
    name: "Taylor Swift",
    genre: "Pop",
    imageUrl: "https://placehold.co/300x300/1a1a2e/e94560?text=Taylor+Swift",
    album: {
      id: "seed_album_tortured_poets",
      title: "The Tortured Poets Department",
      year: 2024,
      label: "Republic Records",
      coverUrl:
        "https://placehold.co/300x300/1a1a2e/e94560?text=Tortured+Poets",
      format: "LP",
      targetPrice: 35,
    },
  },
  {
    artistId: "seed_artist_billie_eilish",
    name: "Billie Eilish",
    genre: "Alternative Pop",
    imageUrl: "https://placehold.co/300x300/1a1a2e/e94560?text=Billie+Eilish",
    album: {
      id: "seed_album_hit_me_hard",
      title: "Hit Me Hard and Soft",
      year: 2024,
      label: "Darkroom/Interscope",
      coverUrl:
        "https://placehold.co/300x300/1a1a2e/e94560?text=Hit+Me+Hard",
      format: "LP",
      targetPrice: 32,
    },
  },
  {
    artistId: "seed_artist_sabrina_carpenter",
    name: "Sabrina Carpenter",
    genre: "Pop",
    imageUrl:
      "https://placehold.co/300x300/1a1a2e/e94560?text=Sabrina+Carpenter",
    album: {
      id: "seed_album_short_n_sweet",
      title: "Short n' Sweet",
      year: 2024,
      label: "Island Records",
      coverUrl:
        "https://placehold.co/300x300/1a1a2e/e94560?text=Short+n+Sweet",
      format: "LP",
      targetPrice: 28,
    },
  },
  {
    artistId: "seed_artist_chappell_roan",
    name: "Chappell Roan",
    genre: "Pop",
    imageUrl:
      "https://placehold.co/300x300/1a1a2e/e94560?text=Chappell+Roan",
    album: {
      id: "seed_album_midwest_princess",
      title: "The Rise and Fall of a Midwest Princess",
      year: 2023,
      label: "Island Records",
      coverUrl:
        "https://placehold.co/300x300/1a1a2e/e94560?text=Midwest+Princess",
      format: "LP",
      targetPrice: 30,
    },
  },
  {
    artistId: "seed_artist_tyler_creator",
    name: "Tyler, the Creator",
    genre: "Hip-Hop",
    imageUrl:
      "https://placehold.co/300x300/1a1a2e/e94560?text=Tyler+Creator",
    album: {
      id: "seed_album_chromakopia",
      title: "Chromakopia",
      year: 2024,
      label: "Columbia Records",
      coverUrl:
        "https://placehold.co/300x300/1a1a2e/e94560?text=Chromakopia",
      format: "LP",
      targetPrice: 38,
    },
  },
  {
    artistId: "seed_artist_kendrick_lamar",
    name: "Kendrick Lamar",
    genre: "Hip-Hop",
    imageUrl:
      "https://placehold.co/300x300/1a1a2e/e94560?text=Kendrick+Lamar",
    album: {
      id: "seed_album_gnx",
      title: "GNX",
      year: 2024,
      label: "pgLang/Interscope",
      coverUrl: "https://placehold.co/300x300/1a1a2e/e94560?text=GNX",
      format: "LP",
      targetPrice: 35,
    },
  },
  {
    artistId: "seed_artist_beyonce",
    name: "Beyonce",
    genre: "R&B/Country",
    imageUrl: "https://placehold.co/300x300/1a1a2e/e94560?text=Beyonce",
    album: {
      id: "seed_album_cowboy_carter",
      title: "Cowboy Carter",
      year: 2024,
      label: "Parkwood/Columbia",
      coverUrl:
        "https://placehold.co/300x300/1a1a2e/e94560?text=Cowboy+Carter",
      format: "LP",
      targetPrice: 40,
    },
  },
  {
    artistId: "seed_artist_radiohead",
    name: "Radiohead",
    genre: "Alternative Rock",
    imageUrl: "https://placehold.co/300x300/1a1a2e/e94560?text=Radiohead",
    album: {
      id: "seed_album_ok_computer",
      title: "OK Computer",
      year: 1997,
      label: "Parlophone/Capitol",
      coverUrl:
        "https://placehold.co/300x300/1a1a2e/e94560?text=OK+Computer",
      format: "LP",
      targetPrice: 45,
    },
  },
  {
    artistId: "seed_artist_daft_punk",
    name: "Daft Punk",
    genre: "Electronic",
    imageUrl: "https://placehold.co/300x300/1a1a2e/e94560?text=Daft+Punk",
    album: {
      id: "seed_album_random_access",
      title: "Random Access Memories",
      year: 2013,
      label: "Columbia Records",
      coverUrl:
        "https://placehold.co/300x300/1a1a2e/e94560?text=Random+Access",
      format: "LP",
      targetPrice: 42,
    },
  },
  {
    artistId: "seed_artist_arctic_monkeys",
    name: "Arctic Monkeys",
    genre: "Indie Rock",
    imageUrl:
      "https://placehold.co/300x300/1a1a2e/e94560?text=Arctic+Monkeys",
    album: {
      id: "seed_album_am",
      title: "AM",
      year: 2013,
      label: "Domino Recording",
      coverUrl: "https://placehold.co/300x300/1a1a2e/e94560?text=AM",
      format: "LP",
      targetPrice: 30,
    },
  },
];

async function main() {
  console.log("🌱 Starting seed...\n");

  // Step 1: Find or create a demo user
  let user = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });

  if (!user) {
    console.log("  Creating demo user...");
    user = await prisma.user.upsert({
      where: { id: DEMO_USER_ID },
      update: {},
      create: {
        id: DEMO_USER_ID,
        email: "demo@grooveshelf.dev",
        name: "Demo User",
      },
    });
    console.log(`  ✓ Demo user created: ${user.email}\n`);
  } else {
    console.log(`  ✓ Using existing user: ${user.email}\n`);
  }

  // Step 2: Seed artists and albums
  for (const entry of SEED_DATA) {
    // Upsert artist
    const artist = await prisma.artist.upsert({
      where: { id: entry.artistId },
      update: {
        name: entry.name,
        genre: entry.genre,
        imageUrl: entry.imageUrl,
      },
      create: {
        id: entry.artistId,
        name: entry.name,
        genre: entry.genre,
        imageUrl: entry.imageUrl,
        userId: user.id,
      },
    });
    console.log(`  ✓ Artist: ${artist.name}`);

    // Upsert album
    const album = await prisma.album.upsert({
      where: { id: entry.album.id },
      update: {
        title: entry.album.title,
        year: entry.album.year,
        label: entry.album.label,
        coverUrl: entry.album.coverUrl,
        format: entry.album.format,
      },
      create: {
        id: entry.album.id,
        title: entry.album.title,
        artistId: artist.id,
        year: entry.album.year,
        label: entry.album.label,
        coverUrl: entry.album.coverUrl,
        format: entry.album.format,
      },
    });
    console.log(`    └─ Album: ${album.title} (${album.year})\n`);
  }

  console.log("✅ Seed completed! 10 artists and 10 albums created.\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
