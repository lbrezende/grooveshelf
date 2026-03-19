import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString =
    process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

  // If using prisma+postgres protocol (Accelerate), use accelerateUrl
  if (connectionString?.startsWith("prisma+postgres")) {
    return new PrismaClient({
      accelerateUrl: connectionString,
    });
  }

  // Otherwise use direct pg adapter
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter } as any);
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
