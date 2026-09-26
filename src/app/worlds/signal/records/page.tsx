import type { Metadata } from "next";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { RecordsTable } from "./table";

export const metadata: Metadata = {
  title: "Records — SIGNAL",
  description: "House bests, rules, and the anatomy of a blip. The arcade wall.",
};

const RULES = [
  "Blips spawn at the rim and fall toward the core.",
  "Click a blip to intercept it: +10, more on Sharp and Brutal.",
  "A blip that reaches the core costs one life. Three lives.",
  "Forty-five seconds. Highest score keeps the wall.",
];

export default function RecordsPage() {
  return (
    <div className="signal-root">
      <WorldExit id="signal" label="Room 05 · SIGNAL" />
      <div className="signal-stage" style={{ paddingBottom: 80 }}>
        <p className="kicker">The arcade wall</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 7vw, 5rem)", margin: "6px 0 8px" }}>RECORDS</h1>
        <RecordsTable />
        <p className="kicker" style={{ marginTop: 32 }}>Rules</p>
        {RULES.map((r, i) => (
          <p key={r} style={{ borderTop: "1px solid #e8b86d44", padding: "10px 0", margin: 0 }}>
            <span className="kicker">0{i + 1} · </span>{r}
          </p>
        ))}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
          <Link className="btn" href="/worlds/signal">Play →</Link>
          <Link className="btn ghost" href="/worlds/signal/about">About the game</Link>
        </div>
      </div>
    </div>
  );
}
