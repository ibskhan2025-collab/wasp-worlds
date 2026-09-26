import Link from "next/link";

/**
 * Shared conversion closer for major worlds (§28):
 * WHAT THIS WORLD PROVES → related world → studio → start.
 * Lives inside each world's own theme, so it inherits local vars.
 */
export function WorldProof({ proves, relatedHref, relatedName }: {
  proves: string;
  relatedHref: string;
  relatedName: string;
}) {
  return (
    <section className="world-proof-cta" style={{ padding: "clamp(48px, 8vw, 110px) var(--pad, 20px)", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">What this world proves</p>
      <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 2.6vw, 2.2rem)", lineHeight: 1.25, maxWidth: "30ch", margin: "12px 0 28px" }}>
        {proves}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link className="btn" href="/start">Start a project</Link>
        <Link className="btn ghost" href={relatedHref}>{relatedName} →</Link>
        <Link className="btn ghost" href="/studio">The studio</Link>
      </div>
      <p className="kicker" style={{ marginTop: 16 }}>Self-initiated WASP study — designed & built by WASP, not client work.</p>
    </section>
  );
}
