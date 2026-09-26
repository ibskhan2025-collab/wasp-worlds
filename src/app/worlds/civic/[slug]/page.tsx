import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorldExit } from "@/components/wasp/world-exit";
import { civicServices } from "@/data/civic";
import { Checklist } from "./checklist";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = civicServices.find((x) => x.slug === slug);
  return s ? { title: `${s.title} — CIVIC`, description: s.intro } : { title: "Service not found — CIVIC" };
}

export default async function CivicGuide({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = civicServices.find((x) => x.slug === slug);
  if (!s) return notFound();
  return (
    <div className="still-root">
      <WorldExit id="civic" label="Room 13 · CIVIC" />
      <article style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 80px" }}>
        <Link href="/worlds/civic" className="kicker">← Ask another question</Link>
        <p className="kicker" style={{ marginTop: 16 }}>{s.dept}</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", letterSpacing: "-0.04em", margin: "8px 0" }}>{s.title}</h1>
        <p style={{ fontSize: "1.25rem" }}>{s.intro}</p>
        <Checklist slug={s.slug} steps={s.steps} />
        <p className="kicker" style={{ marginTop: 32 }}>Source: {s.source}</p>
      </article>
    </div>
  );
}
