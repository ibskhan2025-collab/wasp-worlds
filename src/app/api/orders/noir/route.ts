import { db } from "@/db";
import { noirOrders } from "@/db/schema";
import { noirProducts } from "@/data/noir";
import { clientKey, clampInt, emailError, isHoneypot, rateLimit } from "@/lib/server";

export const dynamic = "force-dynamic";

const prices = new Map(noirProducts.map((p) => [p.id, p.price]));
const validSizes = new Map(noirProducts.map((p) => [p.id, new Set(p.sizes)]));

export async function POST(req: Request) {
  if (!rateLimit(`orders-noir:${clientKey(req)}`, 15, 60_000)) {
    return Response.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }
  if (!db) {
    return Response.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
  try {
    const body = (await req.json()) as { email?: unknown; items?: unknown } & Record<string, unknown>;
    if (isHoneypot(body)) return Response.json({ ok: true, id: 0, simulated: true });
    const badEmail = emailError(body.email);
    if (badEmail || !Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
      return Response.json({ ok: false, error: badEmail ?? "1–50 items required" }, { status: 400 });
    }
    let total = 0;
    const clean: { id: string; qty: number; size?: string }[] = [];
    for (const raw of body.items) {
      const r = raw as { id?: unknown; qty?: unknown; size?: unknown };
      if (typeof r.id !== "string" || !prices.has(r.id)) {
        return Response.json({ ok: false, error: `Unknown item ${String(r.id ?? "?").slice(0, 40)}` }, { status: 400 });
      }
      const qty = clampInt(r.qty, 1, 99);
      if (qty === null) return Response.json({ ok: false, error: "Qty 1-99" }, { status: 400 });
      if (r.size != null && r.size !== "") {
        if (typeof r.size !== "string" || !validSizes.get(r.id)?.has(r.size)) {
          return Response.json({ ok: false, error: `Invalid size for ${r.id}` }, { status: 400 });
        }
      }
      total += (prices.get(r.id) ?? 0) * qty;
      clean.push({ id: r.id, qty, size: typeof r.size === "string" ? r.size : undefined });
    }
    const [row] = await db
      .insert(noirOrders)
      .values({
        email: String(body.email).trim().slice(0, 200),
        items: clean,
        total,
        status: "simulated",
      })
      .returning();
    return Response.json({ ok: true, id: row.id, total, simulated: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
