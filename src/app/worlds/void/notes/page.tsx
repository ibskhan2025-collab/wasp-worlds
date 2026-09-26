import type { Metadata } from "next";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";

export const metadata: Metadata = {
  title: "Field notes — VOID",
  description: "What the void is, what it responds to, and how to hold still.",
};

const NOTES = [
  { t: "The dust", b: "Every mote drifts, drags toward or away from your pointer, and bounces off the edges. Nothing is random after the first frame — it's all physics from there." },
  { t: "Attract / repel", b: "Space toggles the field's polarity, or use the button below the canvas. Repel scatters the dust; attract gathers it into a knot around you." },
  { t: "Typing", b: "Every key becomes a glowing glyph flung into the field. Letters decay into the drift like everything else." },
  { t: "Holding still", b: "Stop moving for about three seconds and the void notices. That discovery is saved to your exhibition record." },
  { t: "Density", b: "The slider grows or thins the live field from 40 to 420 motes. More dust, more drag on weak machines." },
];

export default function VoidNotes() {
  return (
    <div className="void-root" style={{ minHeight: "100dvh" }}>
      <WorldExit id="void" label="Room 09 · VOID" />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px 80px" }}>
        <Link href="/worlds/void" className="kicker">← The void</Link>
        <p className="kicker" style={{ marginTop: 16 }}>Field notes</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.6rem)", margin: "8px 0 24px" }}>HOW TO BE IN HERE</h1>
        <div style={{ display: "grid", gap: 16, marginBottom: 16 }}>
          {[
            ["What is this", "A particle field with simple physics — drift, attraction, repulsion, decay. No score, no goal, no end state."],
            ["Why it exists", "To study the cheapest possible interactivity: does a screen that notices the pointer feel alive with nothing else on it? Answer so far: yes, for about four minutes."],
            ["What we learned", "Stillness is the strongest input. Visitors who stop moving get the only authored moment in the room — which is why the discovery exists. Boredom, instrumented, becomes a mechanic."],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="kicker">{k}</p>
              <p style={{ margin: "4px 0 0", lineHeight: 1.6 }}>{v}</p>
            </div>
          ))}
        </div>
        {NOTES.map((n, i) => (
          <div key={n.t} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 12, padding: "14px 0", borderTop: "1px solid rgba(244,241,234,0.16)" }}>
            <span className="kicker">0{i + 1}</span>
            <div>
              <strong>{n.t}</strong>
              <p style={{ color: "var(--muted)", margin: "4px 0 0", lineHeight: 1.6 }}>{n.b}</p>
            </div>
          </div>
        ))}
        <Link className="btn ghost" href="/worlds/void" style={{ marginTop: 28, color: "#f4f1ea", borderColor: "#f4f1ea55" }}>
          Enter the void →
        </Link>
      </div>
    </div>
  );
}
