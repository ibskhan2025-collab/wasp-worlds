import type { Metadata } from "next";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { WorldProof } from "@/components/worlds/world-proof";
import { ForgeBrowser } from "./browser";

export const metadata: Metadata = {
  title: "FORGE — Industrial parts, explained like someone cares",
  description: "A B2B catalogue study by WASP: real specs, dimensioned diagrams, three-question quote path. Fictional parts, real flow.",
};

export default function ForgePage() {
  return (
    <div className="orbit-root">
      <WorldExit id="forge" label="Room 11 · FORGE" />
      <header style={{ padding: "28px 20px 12px", borderBottom: "1px solid var(--line)" }}>
        <p className="kicker">Room 11 · Industrial / B2B</p>
        <h1 style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)", margin: "4px 0", letterSpacing: "-0.05em" }}>FORGE</h1>
        <p style={{ maxWidth: "52ch" }}>Fasteners, bearings, enclosures — with tolerances you can trust and a quote path that takes three questions, not three weeks.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "16px 0 8px" }}>
          <Link className="btn" href="/worlds/forge/quote">Request a quote →</Link>
        </div>
      </header>
      <ForgeBrowser />
      <WorldProof
        proves="An engineer will forgive an ugly page. They won't forgive a wrong number. Tolerances as diagrams, quotes in three steps, nothing decorative."
        relatedHref="/worlds/vector"
        relatedName="VECTOR"
      />
    </div>
  );
}
