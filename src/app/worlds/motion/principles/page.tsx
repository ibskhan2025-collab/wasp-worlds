import type { Metadata } from "next";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";

export const metadata: Metadata = {
  title: "Principles — MOTION",
  description: "Seven rules for interfaces that move. Timing is a material.",
};

const RULES = [
  { t: "Motion explains.", why: "Attention is a budget. Every animation spends it, so every one must answer: where did that come from, where did it go.", example: "The chapter dots on the MOTION sequence fill as you arrive — position made visible.", effect: "Visitors never wonder what changed. Orientation without thinking.", impl: "One transition per state change, tied to the thing that caused it." },
  { t: "One thing moves at a time.", why: "Two competing motions split attention and both lose. Choreography, not fireworks.", example: "Room cards fade their image OR shift — never both at once.", effect: "The eye always knows where to look. Calm reads as premium.", impl: "A single --dur token per context; staggered delays only in sequences." },
  { t: "Stillness is timed.", why: "An unscored pause reads as a bug. A scored pause reads as confidence.", example: "The HOLD chapter: a full viewport that deliberately does nothing, framed as a beat.", effect: "Pauses gain meaning; the next motion hits harder.", impl: "Holds get explicit durations in the sequence, same as moves." },
  { t: "Respect the exits.", why: "Reduced motion, weak devices, bad connections — a share of every audience lives here.", example: "This site's STILL mode and reduced-motion paths remove animation entirely; nothing breaks.", effect: "Nobody is excluded from content by decoration.", impl: "Content never depends on animation to be understood. Ever." },
  { t: "Easing is voice.", why: "Linear is a robot. Springy is a joke. Timing curves are tone of voice made physical.", example: "The WASP curve (0.16, 1, 0.3, 1): fast out, gentle landing. Try it in the Timing Lab.", effect: "Motion feels authored instead of defaulted.", impl: "One house bezier, three durations (180/420/700ms), used everywhere." },
  { t: "Scroll is editing.", why: "A campaign page is a timeline. Cuts and reveals belong to scroll position, not wall-clock timers.", example: "MOTION's chapters activate at 60% viewport — the visitor cuts the film by moving.", effect: "Pacing is in the visitor's hands; nothing plays to an empty room.", impl: "rAF-throttled scroll observers, never scroll listeners doing layout." },
  { t: "60fps or it ships without.", why: "Dropped frames read as cheapness faster than any typeface reads as luxury.", example: "The SIGNAL canvas and VOID field update transforms only, with state throttled out of the hot loop.", effect: "Motion feels expensive because it never stutters.", impl: "Transform and opacity only. Anything triggering layout gets redesigned, not optimized." },
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
          <div key={r.t} style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 14, padding: "22px 0", borderTop: "1px solid #ffffff22" }}>
            <span style={{ fontFamily: "var(--font-sans)" }}>0{i + 1}</span>
            <div>
              <strong style={{ fontSize: "1.5rem", fontFamily: "var(--font-poster)", letterSpacing: "0.04em" }}>{r.t.toUpperCase()}</strong>
              {[
                ["Why", r.why],
                ["Example", r.example],
                ["Effect", r.effect],
                ["Implementation", r.impl],
              ].map(([k, v]) => (
                <p key={k} style={{ fontFamily: "var(--font-sans)", color: "#ffffffaa", lineHeight: 1.6, margin: "8px 0 0" }}>
                  <span className="kicker">{k} — </span>{v}
                </p>
              ))}
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
