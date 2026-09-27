import { db } from "@/db";
import { objectOrders } from "@/db/schema";
import { objectProducts } from "@/data/objects";
import { clientKey, clampInt, emailError, isHoneypot, nameError, rateLimit, str } from "@/lib/server";

export const dynamic = "force-dynamic";

const prices = new Map(objectProducts.map((p) => [p.id, p.price]));
const validOptions = new Map(objectProducts.map((p) => [p.id, new Set(p.options)]));

export async function POST(req: Request) {
  if (!rateLimit(`orders-objects:${clientKey(req)}`, 15, 60_000)) {
    return Response.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }
  if (!db) {
    return Response.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
  try {
    const body = (await req.json()) as { email?: unknown; name?: unknown; items?: unknown } & Record<string, unknown>;
    if (isHoneypot(body)) return Response.json({ ok: true, id: 0, simulated: true });
    const name = str(body.name, 100);
    const badName = nameError(name);
    const badEmail = emailError(body.email);
    if (badName || badEmail || !Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
      return Response.json({ ok: false, error: badName ?? badEmail ?? "1–50 items required" }, { status: 400 });
    }
    let total = 0;
    const clean: { id: string; qty: number; option?: string }[] = [];
    for (const raw of body.items) {
      const r = raw as { id?: unknown; qty?: unknown; option?: unknown };
      if (typeof r.id !== "string" || !prices.has(r.id)) {
        return Response.json({ ok: false, error: `Unknown item ${String(r.id ?? "?").slice(0, 40)}` }, { status: 400 });
      }
      const qty = clampInt(r.qty, 1, 99);
      if (qty === null) return Response.json({ ok: false, error: "Qty 1-99" }, { status: 400 });
      if (r.option != null && r.option !== "") {
        if (typeof r.option !== "string" || !validOptions.get(r.id)?.has(r.option)) {
          return Response.json({ ok: false, error: `Invalid option for ${r.id}` }, { status: 400 });
        }
      }
      total += (prices.get(r.id) ?? 0) * qty;
      clean.push({ id: r.id, qty, option: typeof r.option === "string" ? r.option : undefined });
    }
    const [row] = await db
      .insert(objectOrders)
      .values({
        email: String(body.email).trim().slice(0, 200),
        name: name as string,
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
