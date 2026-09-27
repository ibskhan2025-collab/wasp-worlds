import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies } from "@/data/studio";
import { media } from "@/lib/media";

const HERO: Record<string, string> = {
  casa: media.casa.hero,
  noir: media.noir.campaign,
  orbit: media.objects.studio,
  objects: media.objects.vases,
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = caseStudies.find((x) => x.slug === slug);
  return c
    ? { title: `${c.title} — WASP case study`, description: `${c.problem} Decided, designed and built as a working demo.` }
    : { title: "Case study not found — WASP" };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = caseStudies.find((x) => x.slug === slug);
  if (!c) notFound();
  const related = caseStudies.filter((x) => x.slug !== slug).slice(0, 2);
  const sections: [string, string][] = [
    ["02 — The idea", c.idea],
    ["03 — The problem", c.problem],
    ["04 — The approach", c.decision],
    ["05 — The experience", c.interaction],
    ["06 — The details", c.design],
    ["07 — The system", c.system],
    ["08 — The result", c.result],
  ];
  const grid = sections.slice(1, 5);
  const rest = [sections[0], ...sections.slice(5)];
  return (
    <div className="studio-page" style={{ maxWidth: 960 }}>
      <Link href="/studio" className="kicker">← Studio</Link>
      <p className="kicker" style={{ marginTop: 16 }}>01 — The world · Self-initiated WASP study · {c.world}</p>
      <h1 className="display">{c.title}</h1>
      <img
        src={HERO[slug] ?? media.casa.hero}
        alt={`${c.world} project atmosphere`}
        loading="lazy"
        decoding="async"
        style={{ width: "100%", maxHeight: 440, objectFit: "cover", margin: "24px 0 8px" }}
      />
      <div className="grid-2">
        {grid.map(([k, v]) => (
          <section key={k} style={{ padding: "20px 0", borderTop: "1px solid var(--line)" }}>
            <h2 className="kicker">{k}</h2>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem" }}>{v}</p>
          </section>
        ))}
      </div>
      {rest.map(([k, v]) => (
        <section key={k} style={{ padding: "20px 0", borderTop: "1px solid var(--line)" }}>
          <h2 className="kicker">{k}</h2>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem" }}>{v}</p>
        </section>
      ))}
      <section style={{ padding: "20px 0", borderTop: "1px solid var(--line)" }}>
        <h2 className="kicker">09 — What this proves</h2>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem" }}>{c.proves}</p>
      </section>
      <section style={{ padding: "20px 0", borderTop: "1px solid var(--line)" }}>
        <h2 className="kicker">10 — Related</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {related.map((r) => (
            <Link key={r.slug} className="ghost" href={`/studio/case/${r.slug}`}>{r.world} →</Link>
          ))}
        </div>
      </section>
      <section style={{ padding: "20px 0", borderTop: "1px solid var(--line)" }}>
        <h2 className="kicker">11 — Start a project</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          <Link className="btn" href="/start">Start a project</Link>
          <Link className="btn ghost" href={`/worlds/${c.slug}`}>Enter the world</Link>
        </div>
      </section>
    </div>
  );
}
