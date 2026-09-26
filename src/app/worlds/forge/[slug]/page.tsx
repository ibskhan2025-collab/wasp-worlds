import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorldExit } from "@/components/wasp/world-exit";
import { forgeProducts, type ForgeProduct } from "@/data/forge";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = forgeProducts.find((x) => x.slug === slug);
  return p ? { title: `${p.name} — FORGE`, description: p.desc } : { title: "Part not found — FORGE" };
}

function Diagram({ dims }: { dims: ForgeProduct["dims"] }) {
  const w = Math.max(60, Math.min(220, dims.w));
  const h = Math.max(30, Math.min(140, dims.h));
  return (
    <svg viewBox="0 0 260 170" width="100%" height="220" role="img" aria-label="Dimensioned part diagram" style={{ background: "#f7f8f4", border: "1px solid var(--line)" }}>
      <rect x={130 - w / 2} y={85 - h / 2} width={w} height={h} fill="none" stroke="#161615" strokeWidth="2" />
      {dims.bore > 0 ? <circle cx="130" cy="85" r={Math.max(6, Math.min(24, dims.bore / 2))} fill="none" stroke="#b24a2e" strokeWidth="2" strokeDasharray="5 3" /> : null}
      <line x1={130 - w / 2} y1="150" x2={130 + w / 2} y2="150" stroke="#161615" strokeWidth="1" />
      <text x="130" y="163" textAnchor="middle" fontSize="11" fill="#161615">{dims.w} mm</text>
      <text x={130 - w / 2 - 8} y="89" textAnchor="end" fontSize="11" fill="#161615">{dims.h}</text>
      {dims.bore > 0 ? <text x="130" y={85 - h / 2 - 8} textAnchor="middle" fontSize="11" fill="#b24a2e">Ø{dims.bore}</text> : null}
    </svg>
  );
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
        <div className="grid-2" style={{ marginTop: 24 }}>
          <div>
            <Diagram dims={p.dims} />
            <p className="kicker" style={{ marginTop: 8 }}>Not to scale. The certs are.</p>
          </div>
          <div>
            <img src={p.image} alt={p.name} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
          </div>
        </div>
        <table className="orbit-table" style={{ marginTop: 24 }}>
          <tbody>
            <tr><th>Rated load</th><td>{p.load} kN</td></tr>
            <tr><th>Tolerance</th><td>{p.tolerance}</td></tr>
            <tr><th>Finishes</th><td>{p.finishes.join(" · ")}</td></tr>
            <tr><th>Lead time</th><td>{p.lead}</td></tr>
          </tbody>
        </table>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
          <Link className="btn" href={`/worlds/forge/quote?add=${p.slug}`}>Add to quote →</Link>
        </div>
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
