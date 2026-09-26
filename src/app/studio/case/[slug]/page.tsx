import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies } from "@/data/studio";

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = caseStudies.find((x) => x.slug === slug);
  if (!c) notFound();
  return (
    <div className="studio-page" style={{ maxWidth: 760 }}>
      <Link href="/studio" className="kicker">← Studio</Link>
      <p className="kicker" style={{ marginTop: 16 }}>Self-initiated · {c.world}</p>
      <h1 className="display">{c.title}</h1>
      {[
        ["The problem", c.problem],
        ["The decision", c.decision],
        ["The design", c.design],
        ["The interaction", c.interaction],
        ["The result", c.result],
      ].map(([k, v]) => (
        <section key={k} style={{ padding: "20px 0", borderTop: "1px solid var(--line)" }}>
          <h2>{k}</h2>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem" }}>{v}</p>
        </section>
      ))}
      <Link className="btn ghost" href={`/worlds/${c.slug}`}>
        Enter the world
      </Link>
    </div>
  );
}
