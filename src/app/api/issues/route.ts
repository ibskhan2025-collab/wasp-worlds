import { db } from "@/db";
import { civicIssues } from "@/db/schema";
import { clientKey, isHoneypot, rateLimit, textError } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`issues:${clientKey(req)}`, 10, 60_000)) {
    return Response.json({ ok: false, error: "Too many requests — slow down a little." }, { status: 429 });
  }
  if (!db) return Response.json({ ok: false, error: "Database not configured" }, { status: 503 });
  try {
    const body = (await req.json()) as Record<string, unknown>;
    if (isHoneypot(body)) return Response.json({ ok: true, ref: "CVC-0000" });
    const badWhat = textError(body.what, "Description", 8, 300);
    if (badWhat) return Response.json({ ok: false, error: badWhat }, { status: 400 });
    const badWhere = textError(body.where, "Location", 3, 120);
    if (badWhere) return Response.json({ ok: false, error: badWhere }, { status: 400 });
    const [row] = await db
      .insert(civicIssues)
      .values({
        what: String(body.what).trim().slice(0, 300),
        where: String(body.where).trim().slice(0, 120),
      })
      .returning();
    return Response.json({ ok: true, ref: `CVC-${row.id}` });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
