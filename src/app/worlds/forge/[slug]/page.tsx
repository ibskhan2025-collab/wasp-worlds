import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorldExit } from "@/components/wasp/world-exit";
import { forgeProducts } from "@/data/forge";
import { ForgeConfigurator } from "./configurator";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = forgeProducts.find((x) => x.slug === slug);
  return p ? { title: `${p.name} — FORGE`, description: p.desc } : { title: "Part not found — FORGE" };
}

export default async function ForgeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = forgeProducts.find((x) => x.slug === slug);
  if (!p) return notFound();
  const related = forgeProducts.filter((x) => x.family === p.family && x.slug !== p.slug).slice(0, 2);
  return (
    <div className="orbit-root">
      <WorldExit id="forge" label="Room 11 · FORGE" />
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 20px 80px" }}>
        <Link href="/worlds/forge" className="kicker">← Catalogue</Link>
        <p className="kicker" style={{ marginTop: 16 }}>{p.family} · Lead {p.lead}</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.4rem)", letterSpacing: "-0.04em", margin: "8px 0" }}>{p.name}</h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "56ch" }}>{p.desc}</p>
        <ForgeConfigurator product={p} />
        {related.length ? (
          <div style={{ marginTop: 32 }}>
            <p className="kicker">Same family</p>
            {related.map((r) => (
              <Link key={r.slug} href={`/worlds/forge/${r.slug}`} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                <span>{r.name}</span><span>{r.load} kN</span>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
