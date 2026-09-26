import type { Metadata } from "next";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";

export const metadata: Metadata = {
  title: "Principles — MOTION",
  description: "Seven rules for interfaces that move. Timing is a material.",
};

const RULES = [
  { t: "Motion explains.", b: "Every animation answers a question: where did that come from, where did it go. Decoration that explains nothing gets cut." },
  { t: "One thing moves at a time.", b: "Choreography, not fireworks. If two elements compete, the visitor watches neither." },
  { t: "Stillness is timed.", b: "A hold is a beat with a duration, not an absence. Score the pauses or they read as bugs." },
  { t: "Respect the exits.", b: "Reduced motion, slow devices, bad connections: the site must make sense with every animation removed." },
  { t: "Easing is voice.", b: "Linear is a robot. Springy is a joke. The WASP curve (0.16, 1, 0.3, 1) is confident — fast out, gentle landing." },
  { t: "Scroll is editing.", b: "A campaign page is a timeline. Cuts, holds and reveals belong to the scroll position, not to timers." },
  { t: "60fps or it ships without.", b: "Transform and opacity only. Anything that triggers layout gets redesigned, not optimized." },
];

export default function PrinciplesPage() {
  return (
    <div className="mot-root">
      <WorldExit id="motion" label="Room 08 · MOTION" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 80px" }}>
        <Link href="/worlds/motion" className="kicker">← The sequence</Link>
        <p className="kicker" style={{ marginTop: 16 }}>House rules</p>
        <h1 style={{ fontSize: "clamp(3rem, 9vw, 6rem)", lineHeight: 0.9, margin: "8px 0 24px" }}>PRINCIPLES</h1>
        {RULES.map((r, i) => (
          <div key={r.t} style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 14, padding: "18px 0", borderTop: "1px solid #ffffff22" }}>
            <span style={{ fontFamily: "var(--font-sans)" }}>0{i + 1}</span>
            <div>
              <strong style={{ fontSize: "1.5rem", fontFamily: "var(--font-poster)", letterSpacing: "0.04em" }}>{r.t.toUpperCase()}</strong>
              <p style={{ fontFamily: "var(--font-sans)", color: "#ffffffaa", lineHeight: 1.6 }}>{r.b}</p>
            </div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
          <Link className="btn ghost" href="/worlds/motion">Back to the sequence</Link>
          <Link className="btn" href="/worlds/motion/commissions" style={{ background: "#fff", color: "#000", borderColor: "#fff" }}>Commission motion →</Link>
        </div>
      </div>
    </div>
  );
}
