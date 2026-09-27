import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { and, eq, gt, sql } from "drizzle-orm";
import { clientKey, emailError, isHoneypot, nameError, optStr, rateLimit, str, textError } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`inquiries:${clientKey(req)}`, 10, 60_000)) {
    return Response.json({ ok: false, error: "Too many requests — slow down a little." }, { status: 429 });
  }
  if (!db) {
    return Response.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
  try {
    const body = (await req.json()) as Record<string, unknown>;
    if (isHoneypot(body)) return Response.json({ ok: true, id: 0 });
    const name = str(body.name, 100);
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
    const badName = nameError(name);
    if (badName) return Response.json({ ok: false, error: badName }, { status: 400 });
    const badEmail = emailError(email);
    if (badEmail) return Response.json({ ok: false, error: badEmail }, { status: 400 });
    const brief = optStr(body.brief, 5000);
    if (brief) {
      const badBrief = textError(brief, "Message", 10, 5000);
      if (badBrief) return Response.json({ ok: false, error: badBrief }, { status: 400 });
    }
    const source = optStr(body.source, 100) ?? "site";
    // Duplicate suppression: same email + source + brief within 10 min = resend/double-click.
    const recent = await db
      .select({ id: inquiries.id })
      .from(inquiries)
      .where(
        and(
          eq(inquiries.email, email),
          eq(inquiries.source, source),
          gt(inquiries.createdAt, sql`now() - interval '10 minutes'`),
        ),
      )
      .limit(1);
    if (recent.length) return Response.json({ ok: true, id: recent[0].id, duplicate: true });
    const [row] = await db
      .insert(inquiries)
      .values({
        name: name as string,
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
