import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorldExit } from "@/components/wasp/world-exit";
import { vectorInsights } from "@/data/vector";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = vectorInsights.find((x) => x.slug === slug);
  return a ? { title: `${a.title} — VECTOR`, description: a.dek } : { title: "Insight not found — VECTOR" };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = vectorInsights.find((x) => x.slug === slug);
  if (!a) return notFound();
  const related = vectorInsights.filter((x) => x.slug !== slug).slice(0, 2);
  return (
    <div style={{ background: "#0b0e0c", color: "#e8e4dc", minHeight: "100dvh" }}>
      <WorldExit id="vector" label="Room 15 · VECTOR" />
      <article style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 80px" }}>
        <Link href="/worlds/vector" className="kicker" style={{ color: "#3ddc84" }}>← Vector</Link>
        <p className="kicker" style={{ marginTop: 16, color: "#3ddc84" }}>{a.date}</p>
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.8rem)", lineHeight: 1, letterSpacing: "-0.03em", margin: "8px 0" }}>{a.title}</h1>
        <p style={{ fontSize: "1.25rem", color: "#e8e4dcbb" }}>{a.dek}</p>
        {a.body.map((p) => (
          <p key={p} style={{ fontSize: "1.15rem", lineHeight: 1.65 }}>{p}</p>
        ))}
        <hr className="rule" style={{ borderColor: "#ffffff1c" }} />
        <p className="kicker" style={{ color: "#3ddc84" }}>More</p>
        {related.map((r) => (
          <Link key={r.slug} href={`/worlds/vector/${r.slug}`} style={{ display: "block", marginTop: 8 }}>{r.title}</Link>
        ))}
      </article>
    </div>
  );
}
