import { db } from "@/db";
import {
  casaReservations,
  civicIssues,
  events,
  inquiries,
  noirOrders,
  objectOrders,
  rsvps,
  toolReports,
} from "@/db/schema";
import { clientKey, rateLimit } from "@/lib/server";
import { lt, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

// Retention enforcement for the privacy policy ("How long it stays").
// Call monthly from the host scheduler with ?key=ADMIN_KEY, e.g.
// Vercel Cron, GitHub Actions, or any HTTPS scheduler:
//   GET /api/maintenance?key=...  ->  { ok, deleted: { table: count } }
export async function GET(req: Request) {
  if (!rateLimit(`maintenance:${clientKey(req)}`, 5, 60_000)) {
    return Response.json({ ok: false }, { status: 429 });
  }
  const admin = process.env.ADMIN_KEY;
  const key = new URL(req.url).searchParams.get("key");
  if (!admin || key !== admin) {
    return Response.json({ ok: false }, { status: 404 });
  }
  if (!db) {
    return Response.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
  const cutoff = sql`now() - interval '24 months'`;
  const tables = {
    inquiries,
    casaReservations,
    toolReports,
    noirOrders,
    objectOrders,
    events,
    rsvps,
    civicIssues,
  } as const;
  const deleted: Record<string, number> = {};
  for (const [name, table] of Object.entries(tables)) {
    const rows = await db
      .delete(table)
      .where(lt(table.createdAt, cutoff))
      .returning({ id: table.id });
    deleted[name] = rows.length;
  }
  return Response.json({ ok: true, deleted });
}
