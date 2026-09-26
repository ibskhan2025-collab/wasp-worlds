import type { Metadata } from "next";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { vectorInsights, vectorPractices } from "@/data/vector";
import { PerfChart } from "./chart";
import { CallForm } from "./call-form";

export const metadata: Metadata = {
  title: "VECTOR — Serious information, presented with confidence",
  description: "A finance world: labelled performance, plain-figure fees, and insights one scroll from a conversation.",
};

export default function VectorPage() {
  return (
    <div style={{ background: "#0b0e0c", color: "#e8e4dc", minHeight: "100dvh" }}>
      <WorldExit id="vector" label="Room 15 · VECTOR" />
      <header style={{ padding: "32px 20px 12px", borderBottom: "1px solid #ffffff1c" }}>
        <p className="kicker" style={{ color: "#3ddc84" }}>Room 15 · Finance / Professional</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 10vw, 7.5rem)", margin: "4px 0", letterSpacing: "-0.06em" }}>VECTOR</h1>
        <p style={{ maxWidth: "52ch", fontSize: "1.15rem", color: "#e8e4dcbb" }}>Credibility and conversion as design materials — not opposing forces.</p>
      </header>
      <section style={{ padding: "24px 20px", maxWidth: 960 }}>
        <p className="kicker" style={{ color: "#3ddc84" }}>Composite index · drawdowns labelled</p>
        <PerfChart />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          {vectorPractices.map((p) => (
            <span key={p} className="chip" style={{ borderColor: "#ffffff2c" }}>{p}</span>
          ))}
        </div>
      </section>
      <section style={{ padding: "8px 20px", maxWidth: 960 }}>
        <p className="kicker" style={{ color: "#3ddc84" }}>Insights</p>
        {vectorInsights.map((a) => (
          <Link key={a.slug} href={`/worlds/vector/${a.slug}`} style={{ display: "block", padding: "18px 0", borderTop: "1px solid #ffffff1c" }}>
            <strong style={{ fontSize: "1.5rem" }}>{a.title}</strong>
            <div style={{ color: "#e8e4dc99" }}>{a.dek}</div>
            <span className="kicker" style={{ color: "#3ddc84" }}>{a.date}</span>
          </Link>
        ))}
      </section>
      <section style={{ padding: "8px 20px 80px", maxWidth: 960 }}>
        <CallForm />
      </section>
    </div>
  );
}
