import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!db) {
    return Response.json({ ok: false, db: false, reason: "DATABASE_URL not configured" }, { status: 200 });
  }
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, db: true });
  } catch {
    return Response.json({ ok: false, db: false }, { status: 500 });
  }
}
