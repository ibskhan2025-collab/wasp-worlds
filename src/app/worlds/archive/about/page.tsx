import type { Metadata } from "next";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";

export const metadata: Metadata = {
  title: "Manifesto — ARCHIVE",
  description: "What this paper believes about websites, proof, and taste.",
};

const BELIEFS = [
  { t: "The site is the work.", b: "If you design restaurants, the visitor should book a table. If you design stores, they should fill a bag. Screenshots are claims; working software is evidence." },
  { t: "Proof that has to lie is not proof.", b: "No invented testimonials, no invented conversion rates. Show the thing or say it isn't built yet." },
  { t: "Taste is judgement in public.", b: "A grid lays work out like a catalogue. An exhibition sequences it. Sequence implies decisions, and decisions are the job." },
  { t: "Quiet beats loud.", b: "If everything moves, nothing is important. Luxury is the removal of unexplained motion." },
  { t: "Commerce is craft.", b: "Filtering, sizing, totals, checkout — the grammar of retail. Treat it as beneath design and visitors feel it." },
];

export default function ManifestoPage() {
  return (
    <div className="arc-root">
      <WorldExit id="archive" label="Room 07 · ARCHIVE" />
      <article style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 80px" }}>
        <Link href="/worlds/archive" className="kicker">← The Archive</Link>
        <p className="kicker" style={{ marginTop: 16 }}>House rules</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", lineHeight: 0.95, margin: "8px 0 24px" }}>Manifesto</h1>
        {BELIEFS.map((x, i) => (
          <div key={x.t} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 12, padding: "16px 0", borderTop: "1px solid var(--line)" }}>
            <span>0{i + 1}</span>
            <div>
              <strong style={{ fontSize: "1.3rem" }}>{x.t}</strong>
              <p style={{ lineHeight: 1.6 }}>{x.b}</p>
            </div>
          </div>
        ))}
        <p style={{ marginTop: 24 }}>
          <Link href="/worlds/archive/letters" className="kicker">Get the letters →</Link>
        </p>
      </article>
    </div>
  );
}
