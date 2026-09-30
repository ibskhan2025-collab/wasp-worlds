import type { Metadata } from "next";
import Link from "next/link";
import { WORLDS } from "@/lib/worlds";

export const metadata: Metadata = {
  title: "Night — the exhibition after hours",
  description: "All fifteen worlds, nocturnal. Plus the darkest realities, one click deep.",
};

const AFTER_DARK: { href: string; name: string; note: string }[] = [
  { href: "/worlds/signal", name: "SIGNAL", note: "Amber phosphor" },
  { href: "/worlds/void", name: "VOID", note: "Monochrome particles" },
  { href: "/worlds/pulse", name: "PULSE", note: "Stage black" },
  { href: "/worlds/vector", name: "VECTOR", note: "Terminal green" },
  { href: "/worlds/motion/cinema", name: "MOTION/CINEMA", note: "Letterboxed" },
  { href: "/worlds/atlas/expedition", name: "ATLAS/EXPEDITION", note: "Night navigation" },
  { href: "/worlds/forge/blueprint", name: "FORGE/BLUEPRINT", note: "Cyan lines" },
  { href: "/worlds/nest/simulated", name: "NEST/SIMULATED", note: "Sensor glow" },
];

export default function NightPage() {
  return (
    <div style={{ background: "#030507", color: "#d8e4ee", minHeight: "100dvh" }}>
      <header style={{ padding: "48px 20px 12px", maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.25em", color: "#7fa3c0" }}>
          CROSS-WORLD REALITY · AFTER HOURS
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 10vw, 7rem)", lineHeight: 0.88, margin: "8px 0", letterSpacing: "-0.05em" }}>
          NIGHT
        </h1>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", maxWidth: "52ch", color: "#a9b8c4" }}>
          The whole exhibition, nocturnal. Every world below, plus the eight
          darkest realities — one click deep, no daylight.
        </p>
      </header>
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "8px 20px" }} aria-label="After dark picks">
        <p style={{ fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.25em", color: "#7fa3c0" }}>AFTER DARK — START HERE</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 1, background: "rgba(216,228,238,0.14)", border: "1px solid rgba(216,228,238,0.14)", marginTop: 12 }}>
          {AFTER_DARK.map((r) => (
            <Link key={r.href} href={r.href} style={{ background: "#030507", padding: "18px 16px", display: "block" }}>
              <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>{r.name}</strong>
              <div style={{ fontFamily: "var(--font-code)", fontSize: 11, color: "#7fa3c0", marginTop: 4 }}>{r.note} →</div>
            </Link>
          ))}
        </div>
      </section>
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 80px" }} aria-label="All worlds at night">
        <p style={{ fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.25em", color: "#7fa3c0" }}>ALL 15 WORLDS · NOCTURNAL INDEX</p>
        {WORLDS.map((w) => (
          <Link key={w.id} href={w.href} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "14px 0", borderBottom: "1px solid rgba(216,228,238,0.14)" }}>
            <span>
              <span style={{ fontFamily: "var(--font-code)", fontSize: 11, color: "#7fa3c0" }}>ROOM {w.room} · </span>
              <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>{w.name}</strong>
              <span style={{ color: "#7fa3c0", fontSize: "0.9rem" }}> — {w.line}</span>
            </span>
            <span style={{ fontFamily: "var(--font-code)", fontSize: 11, color: "#7fa3c0", whiteSpace: "nowrap" }}>{w.kind}</span>
          </Link>
        ))}
        <p style={{ marginTop: 24 }}>
          <Link href="/" style={{ borderBottom: "1px solid currentColor" }}>← Back to daylight</Link>
        </p>
      </section>
    </div>
  );
}
