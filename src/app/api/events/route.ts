import { db } from "@/db";
import { events } from "@/db/schema";
import { clientKey, rateLimit } from "@/lib/server";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["world_visit", "brief_started", "inquiry_submitted", "reservation_submitted"]);

export async function POST(req: Request) {
  if (!rateLimit(`events:${clientKey(req)}`, 120, 60_000)) {
    return Response.json({ ok: false }, { status: 429 });
  }
  if (!db) return Response.json({ ok: false, error: "Database not configured" }, { status: 503 });
  try {
    const body = (await req.json()) as { name?: unknown; props?: unknown; path?: unknown };
    if (typeof body.name !== "string" || !ALLOWED.has(body.name)) {
      return Response.json({ ok: false, error: "Unknown event" }, { status: 400 });
    }
    const props: Record<string, string> = {};
    if (body.props && typeof body.props === "object") {
      for (const [k, v] of Object.entries(body.props as Record<string, unknown>)) {
        if (typeof v === "string" || typeof v === "number") props[String(k).slice(0, 40)] = String(v).slice(0, 200);
        if (Object.keys(props).length >= 10) break;
      }
    }
    const path = typeof body.path === "string" ? body.path.slice(0, 300) : "/";
    await db.insert(events).values({ name: body.name, props, path });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
