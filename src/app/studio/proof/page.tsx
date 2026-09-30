import type { Metadata } from "next";
import Link from "next/link";
import { REALITIES } from "@/lib/realities";
import { WORLDS } from "@/lib/worlds";

export const metadata: Metadata = {
  title: "Proof — WASP",
  description: "No invented clients, no invented numbers. Our proof policy, the rooms you can operate, and the frames reserved for real outcomes.",
};

const OPERABLE: [string, string][] = [
  ["Book a table", "/worlds/casa/reservations"],
  ["Fill a bag", "/worlds/noir/collection"],
  ["Run the quarter", "/worlds/orbit"],
  ["Lose a game", "/worlds/signal"],
  ["Buy a vase", "/worlds/objects/shop"],
  ["Compare two parts", "/worlds/forge/compare"],
  ["Board a route", "/worlds/atlas/timetable"],
  ["Read the letter", "/worlds/vector/letter"],
];

export default function ProofPage() {
  const realities = Object.values(REALITIES).flat().length;
  const alternates = Object.values(REALITIES).flat().filter((r) => r.id !== "classic").length;
  return (
    <div className="studio-page">
      <p className="kicker">Proof</p>
      <h1 className="display">No invented clients. No invented numbers.</h1>
      <p className="lede">
        When real work, real names, and real outcomes exist, they live here. Until then, the proof is the rooms you can operate — and these frames stay visibly reserved rather than quietly faked.
      </p>
      <div className="grid-2" style={{ marginTop: 32 }}>
        {[
          [String(WORLDS.length), "working worlds, every one operable"],
          [String(realities), "realities you can enter right now"],
          [String(alternates), "alternate designs sharing real data"],
          ["0", "screenshots posing as product"],
        ].map(([v, l]) => (
          <div key={l} className="panel">
            <p className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", margin: 0 }}>{v}</p>
            <p className="kicker" style={{ marginTop: 8 }}>{l}</p>
          </div>
        ))}
      </div>
      <div className="grid-2" style={{ marginTop: 32 }}>
        <div className="panel">
          <p className="kicker">Testimonials — reserved</p>
          <p>One true sentence from a real client will go here, with their name on it. Not before.</p>
        </div>
        <div className="panel">
          <p className="kicker">Logos — reserved</p>
          <p>Marks of companies that paid for work and agreed to be named. None invented.</p>
        </div>
        <div className="panel">
          <p className="kicker">Outcomes — reserved</p>
          <p>We will not write a conversion rate we did not measure.</p>
        </div>
        <div className="panel">
          <p className="kicker">Before / after — reserved</p>
          <p>Frame reserved for a real homepage that wouldn&apos;t shut up.</p>
        </div>
      </div>
      <hr className="rule" />
      <p className="kicker">Meanwhile, operable proof — do these things, they work</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        {OPERABLE.map(([label, href]) => (
          <Link key={href} className="btn ghost" href={href}>{label} →</Link>
        ))}
      </div>
      <p style={{ marginTop: 16 }}><Link className="btn" href="/start">Start a project →</Link></p>
    </div>
  );
}
