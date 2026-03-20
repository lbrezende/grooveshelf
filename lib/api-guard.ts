import { NextResponse } from "next/server";
import { hasDatabase } from "@/lib/db";

export function requireDatabase() {
  if (!hasDatabase) {
    return NextResponse.json(
      { error: "Database not configured. Set DATABASE_URL to enable this feature." },
      { status: 503 }
    );
  }
  return null;
}
