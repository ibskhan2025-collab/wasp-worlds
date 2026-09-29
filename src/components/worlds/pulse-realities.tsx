"use client";

import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { fmtSecs, releases, shows } from "@/data/pulse";

export function PulseFlyer() {
  return (
    <div style={{ background: "#ece8df", color: "#111", minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <WorldExit id="pulse" label="Room 12 · PULSE/FLYER" />
      <RealityShell world="pulse" current="flyer" basePath="/worlds/pulse" />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ border: "4px solid #111", padding: "28px 24px", transform: "rotate(-0.8deg)", background: "#f4f1ea" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", margin: 0 }}>WHEATPASTE · DO NOT REMOVE · PULSE RECORDINGS PRESENTS</p>
          <h1 style={{ fontSize: "clamp(3rem, 12vw, 6.5rem)", lineHeight: 0.85, margin: "12px 0", fontWeight: 900 }}>LOUD<br />NIGHTS,<br />CHEAP BEER</h1>
          {shows.map((s) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "2px solid #111", fontWeight: 700 }}>
              <span>{s.date} — {s.city.toUpperCase()} @ {s.venue}</span>
              <span>{s.status === "Sold out" ? "GONE" : "£18 OTD"}</span>
            </div>
          ))}
          <p style={{ marginTop: 16, fontSize: "0.85rem" }}>Releases: {releases.map((r) => r.title).join(" / ")}. Full details <Link href="/worlds/pulse" style={{ textDecoration: "underline" }}>at the label →</Link></p>
        </div>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: "0.8rem" }}>Photocopied 200×. If you&apos;re reading this, you were there.</p>
      </div>
      <WorldProof
        proves="One poster that does the job of a campaign: dates, prices, releases. Loud because the night is."
        relatedHref="/worlds/motion"
        relatedName="MOTION"
      />
    </div>
  );
}

export function PulseVinyl() {
  return (
    <div style={{ background: "#0d0716", color: "#e9defc", minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <WorldExit id="pulse" label="Room 12 · PULSE/VINYL" />
      <RealityShell world="pulse" current="vinyl" basePath="/worlds/pulse" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#9d5cff" }}>SLEEVE NOTES · 33⅓ RPM · PLAY LOUD</p>
        {releases.map((r, ri) => (
          <section key={r.slug} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, padding: "32px 0", borderBottom: "1px solid rgba(233,222,252,0.2)" }} className="grid-2">
            <div>
              <p style={{ color: "#9d5cff", fontSize: 12, letterSpacing: "0.25em" }}>SIDE {ri === 0 ? "A" : "B"} · {r.artist.toUpperCase()}</p>
              <h2 style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", margin: "8px 0", lineHeight: 0.95 }}>{r.title}</h2>
              <p style={{ color: "#8f7fb8" }}>{r.note}</p>
              <Link href={`/worlds/pulse/${r.slug}`} style={{ color: "#9d5cff", textDecoration: "underline" }}>Full release →</Link>
            </div>
            <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {r.tracks.map((t, i) => (
                <li key={t.name} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(233,222,252,0.12)" }}>
                  <span>{String.fromCharCode(65 + ri)}{i + 1}. {t.name}</span>
                  <span style={{ color: "#8f7fb8" }}>{fmtSecs(t.secs)}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
