import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | null };

function createPrismaClient(): PrismaClient | null {
  const connectionString =
    process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    console.warn("DATABASE_URL not set — database features disabled");
    return null;
  }

  // If using prisma+postgres protocol (Accelerate), use accelerateUrl
  if (connectionString.startsWith("prisma+postgres")) {
    return new PrismaClient({
      accelerateUrl: connectionString,
    });
  }

  // Otherwise use direct pg adapter
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool as any);
  return new PrismaClient({ adapter } as any);
}

const _db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = _db;

// Exported as non-null for API routes — runtime guard in auth.ts handles null case
export const db = _db as PrismaClient;
export const hasDatabase = _db !== null;
