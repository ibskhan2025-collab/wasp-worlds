import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { events } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analytics — WASP",
  description: "Private traffic dashboard. Not linked anywhere.",
  robots: { index: false, follow: false },
};

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams;
  const admin = process.env.ADMIN_KEY;
  if (admin && key !== admin) return notFound();
  if (!db) return <p style={{ padding: 24 }}>Database not configured.</p>;

  const total = await db.select({ n: sql<number>`count(*)` }).from(events);
  const byName = await db
    .select({ name: events.name, n: sql<number>`count(*)` })
    .from(events)
    .groupBy(events.name)
    .orderBy(desc(sql`count(*)`));
  const byWorld = await db
    .select({ world: sql<string>`${events.props}->>'world'`, n: sql<number>`count(*)` })
    .from(events)
    .where(sql`${events.name} = 'world_visit'`)
    .groupBy(sql`${events.props}->>'world'`)
    .orderBy(desc(sql`count(*)`))
    .limit(15);
  const byDay = await db
    .select({ day: sql<string>`to_char(${events.createdAt}, 'YYYY-MM-DD')`, n: sql<number>`count(*)` })
    .from(events)
    .where(sql`${events.createdAt} > now() - interval '14 days'`)
    .groupBy(sql`to_char(${events.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${events.createdAt}, 'YYYY-MM-DD')`);
  const recent = await db.select().from(events).orderBy(desc(events.id)).limit(20);

  const count = (n: string) => Number(byName.find((r) => r.name === n)?.n ?? 0);
  const visits = Number(total[0]?.n ?? 0);
  const briefs = count("brief_started");
  const inquiries = count("inquiry_submitted");
  const reservations = count("reservation_submitted");
  const maxDay = Math.max(1, ...byDay.map((d) => Number(d.n)));

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px 80px", fontFamily: "var(--font-sans)" }}>
      {!admin ? <p role="alert" style={{ background: "#7a1f1f", color: "#fff", padding: "10px 12px" }}>No ADMIN_KEY set — this page is public. Set ADMIN_KEY and visit /analytics?key=…</p> : null}
      <p className="kicker">Private · not indexed</p>
      <h1 style={{ fontSize: "2.6rem", margin: "4px 0 24px" }}>Traffic</h1>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="panel"><p className="kicker">Events</p><p style={{ fontSize: "2rem", margin: 0 }}>{visits}</p></div>
        <div className="panel"><p className="kicker">Visit → brief</p><p style={{ fontSize: "2rem", margin: 0 }}>{briefs}</p></div>
        <div className="panel"><p className="kicker">Inquiries</p><p style={{ fontSize: "2rem", margin: 0 }}>{inquiries}</p></div>
      </div>
      <p className="kicker">Funnel: {visits} events → {briefs} briefs → {inquiries} inquiries · {reservations} reservations</p>

      <h2 style={{ marginTop: 32 }}>Last 14 days</h2>
      <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 120 }}>
        {byDay.map((d) => (
          <div key={d.day} title={`${d.day}: ${d.n}`} style={{ flex: 1, background: "var(--fg)", height: `${Math.max(3, (Number(d.n) / maxDay) * 100)}%`, minWidth: 8 }} />
        ))}
        {byDay.length === 0 ? <p className="kicker">No events yet — browse a world.</p> : null}
      </div>

      <h2 style={{ marginTop: 32 }}>Top worlds</h2>
      {byWorld.map((w) => (
        <div key={w.world} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
          <span>{w.world || "(unknown)"}</span><span>{Number(w.n)}</span>
        </div>
      ))}
      {byWorld.length === 0 ? <p className="kicker">None yet.</p> : null}

      <h2 style={{ marginTop: 32 }}>Recent</h2>
      {recent.map((e) => (
        <div key={e.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
          <strong>{e.name}</strong> <span style={{ color: "var(--muted)" }}>{e.path}</span>
          <span style={{ color: "var(--muted)" }}> · {Object.entries((e.props as Record<string, string>) ?? {}).map(([k, v]) => `${k}=${v}`).join(" ")}</span>
        </div>
      ))}
    </div>
  );
}
