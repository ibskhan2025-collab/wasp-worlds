import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { clientKey, isEmail, optStr, rateLimit, str } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`inquiries:${clientKey(req)}`, 10, 60_000)) {
    return Response.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }
  if (!db) {
    return Response.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const name = str(body.name, 200);
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
    if (!name || !isEmail(email)) {
      return Response.json({ ok: false, error: "Name and valid email required" }, { status: 400 });
    }
    const [row] = await db
      .insert(inquiries)
      .values({
        name,
        email,
        company: optStr(body.company, 200),
        making: optStr(body.making, 1000),
        needs: optStr(body.needs, 2000),
        feel: optStr(body.feel, 100),
        idea: optStr(body.idea, 2000),
        budget: optStr(body.budget, 100),
        matters: optStr(body.matters, 2000),
        motion: optStr(body.motion, 100),
        brief: optStr(body.brief, 5000),
        source: optStr(body.source, 100) ?? "site",
      })
      .returning();
    return Response.json({ ok: true, id: row.id });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
