import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorldExit } from "@/components/wasp/world-exit";
import { destinations } from "@/data/atlas";
import { money } from "@/lib/format";
import { AddStop } from "./add-stop";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = destinations.find((x) => x.slug === slug);
  return d
    ? { title: `${d.name} — ATLAS`, description: d.blurb }
    : { title: "Route not found — ATLAS" };
}

export default async function AtlasDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = destinations.find((x) => x.slug === slug);
  if (!d) return notFound();
  return (
    <div className="arc-root">
      <WorldExit id="atlas" label="Room 10 · ATLAS" />
      <article style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px 80px" }}>
        <Link href="/worlds/atlas" className="kicker">← All routes</Link>
        <p className="kicker" style={{ marginTop: 16 }}>{d.region} · {d.season} · ★ {d.rating}</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 7vw, 5rem)", lineHeight: 0.95, margin: "8px 0" }}>{d.name}</h1>
        <p style={{ fontSize: "1.25rem" }}>{d.blurb}</p>
        <p className="kicker" style={{ marginTop: 8 }}>Pack: {d.pack}</p>
        <img src={d.image} alt={d.name} loading="lazy" decoding="async" style={{ width: "100%", maxHeight: 480, objectFit: "cover", margin: "24px 0" }} />
        <p className="kicker">The stops</p>
        {d.stops.map((s, i) => (
          <div key={s.name} style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 16, padding: "16px 0", borderTop: "1px solid var(--line)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem" }}>0{i + 1}</span>
            <div>
              <strong>{s.name}</strong>
              <p style={{ color: "var(--muted)", margin: "4px 0 0" }}>{s.note}</p>
            </div>
          </div>
        ))}
        <div className="panel" style={{ marginTop: 28, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <span>{d.days} days · {money(d.price)} per person</span>
          <AddStop slug={d.slug} name={d.name} />
        </div>
      </article>
    </div>
  );
}
