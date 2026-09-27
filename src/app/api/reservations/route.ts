import { db } from "@/db";
import { casaReservations } from "@/db/schema";
import { clientKey, clampInt, emailError, isHoneypot, nameError, optStr, rateLimit, str } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`reservations:${clientKey(req)}`, 10, 60_000)) {
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
    const dateRaw = str(body.date, 40);
    const time = str(body.time, 20);
    const party = clampInt(body.party, 1, 12);
    if (!dateRaw || !time || party === null) {
      return Response.json({ ok: false, error: "Date, time and party size (1–12) are required." }, { status: 400 });
    }
    const date = new Date(`${dateRaw}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return Response.json({ ok: false, error: "Invalid date" }, { status: 400 });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return Response.json({ ok: false, error: "Date is in the past" }, { status: 400 });
    }
    if (!/^\d{1,2}:\d{2}$/.test(time)) {
      return Response.json({ ok: false, error: "Invalid time" }, { status: 400 });
    }
    const [row] = await db
      .insert(casaReservations)
      .values({
        name: name as string,
        email,
        phone: optStr(body.phone, 80),
        date: dateRaw,
        time,
        party,
        notes: optStr(body.notes, 1000),
      })
      .returning();
    return Response.json({ ok: true, id: row.id });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
