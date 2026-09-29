import { db } from "@/db";
import { rsvps } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { clientKey, isHoneypot, rateLimit, str } from "@/lib/server";

export const dynamic = "force-dynamic";

const SHOWS = new Set(["s1", "s2", "s3", "s4", "s5"]);

export async function GET() {
  if (!db) return Response.json({ ok: false }, { status: 503 });
  try {
    const rows = await db
      .select({ showId: rsvps.showId, n: sql<number>`count(*)` })
      .from(rsvps)
      .groupBy(rsvps.showId);
    const counts: Record<string, number> = {};
    for (const r of rows) counts[r.showId] = Number(r.n);
    return Response.json({ ok: true, counts });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!rateLimit(`rsvps:${clientKey(req)}`, 10, 60_000)) {
    return Response.json({ ok: false, error: "Too many requests — slow down a little." }, { status: 429 });
  }
  if (!db) return Response.json({ ok: false, error: "Database not configured" }, { status: 503 });
  try {
    const body = (await req.json()) as Record<string, unknown>;
    if (isHoneypot(body)) return Response.json({ ok: true, id: 0 });
    const showId = str(body.showId, 20);
    if (!showId || !SHOWS.has(showId) || showId === "s4") {
      return Response.json({ ok: false, error: "Unknown or sold-out show." }, { status: 400 });
    }
    const [row] = await db.insert(rsvps).values({ showId }).returning();
    const [{ n }] = await db
      .select({ n: sql<number>`count(*)` })
      .from(rsvps)
      .where(eq(rsvps.showId, showId));
    return Response.json({ ok: true, id: row.id, going: Number(n) });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!rateLimit(`rsvps:${clientKey(req)}`, 10, 60_000)) {
    return Response.json({ ok: false }, { status: 429 });
  }
  if (!db) return Response.json({ ok: false }, { status: 503 });
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const showId = str(body.showId, 20);
    if (!showId || !SHOWS.has(showId)) return Response.json({ ok: false }, { status: 400 });
    // Remove the most recent RSVP for this show (anonymous ledger — no identity stored).
    const latest = await db
      .select({ id: rsvps.id })
      .from(rsvps)
      .where(eq(rsvps.showId, showId))
      .orderBy(desc(rsvps.id))
      .limit(1);
    if (latest.length) await db.delete(rsvps).where(eq(rsvps.id, latest[0].id));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
