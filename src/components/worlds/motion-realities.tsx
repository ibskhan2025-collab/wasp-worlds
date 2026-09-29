"use client";

import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { media } from "@/lib/media";

const CHAPTERS = [
  { t: "MOVE", spec: "1400ms · ease-out · full-bleed reveal", frames: 84 },
  { t: "CUT", spec: "90ms · step · hard cut", frames: 6 },
  { t: "HOLD", spec: "2400ms · stillness as beat", frames: 144 },
  { t: "BLUR", spec: "700ms · ease-in-out · motion blur", frames: 42 },
  { t: "BURN", spec: "420ms · spring · heat rise", frames: 25 },
  { t: "AGAIN", spec: "loop · the end is the start", frames: "∞" },
];

export function MotionTiming() {
  return (
    <div style={{ background: "#f4f1ea", color: "#111", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="motion" label="Room 08 · MOTION/TIMING" />
      <RealityShell world="motion" current="timing" basePath="/worlds/motion" />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.25em" }}>TIMING SHEET · REV C · 24FPS</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.6rem, 8vw, 5.5rem)", margin: "8px 0", letterSpacing: "-0.04em" }}>Every frame, accounted for.</h1>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24 }}>
          <thead>
            <tr style={{ textAlign: "left", fontSize: 11, letterSpacing: "0.2em", borderBottom: "3px solid #111" }}>
              <th style={{ padding: "10px 8px" }}>SC</th><th>SHOT</th><th>SPEC</th><th style={{ textAlign: "right" }}>FR</th>
            </tr>
          </thead>
          <tbody>
            {CHAPTERS.map((c, i) => (
              <tr key={c.t} style={{ borderBottom: "1px solid #111" }}>
                <td style={{ padding: "14px 8px", fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</td>
                <td style={{ padding: "14px 8px", fontWeight: 700, fontSize: "1.3rem" }}>{c.t}</td>
                <td style={{ padding: "14px 8px", fontSize: "0.85rem" }}>{c.spec}</td>
                <td style={{ padding: "14px 8px", textAlign: "right" }}>{c.frames}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 16, fontSize: "0.9rem" }}>Total scored runtime: 6.5s of motion, 2.4s of scored stillness. <Link href="/worlds/motion/principles" style={{ textDecoration: "underline" }}>Why it works →</Link></p>
        <div style={{ marginTop: 12 }}>
          <Link href="/worlds/motion/commissions" style={{ background: "#111", color: "#f4f1ea", padding: "12px 20px", fontSize: 12, letterSpacing: "0.15em" }}>COMMISSION MOTION →</Link>
        </div>
      </div>
      <WorldProof
        proves="Motion specified like engineering: every chapter timed, framed and counted. Campaigns you can audit."
        relatedHref="/worlds/pulse"
        relatedName="PULSE"
      />
    </div>
  );
}

const STILLS = [media.motion.red, media.motion.leap, media.motion.ballet, media.motion.blur, media.motion.fire, media.motion.studio];

export function MotionCinema() {
  return (
    <div style={{ background: "#000", color: "#f4f1ea", minHeight: "100dvh" }}>
      <WorldExit id="motion" label="Room 08 · MOTION/CINEMA" />
      <RealityShell world="motion" current="cinema" basePath="/worlds/motion" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
        <p style={{ fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.25em", textAlign: "center" }}>2.39:1 · DCP · NO TRAILERS</p>
        {CHAPTERS.map((c, i) => (
          <figure key={c.t} style={{ margin: "48px 0" }}>
            <div style={{ borderTop: "8vh solid #000", borderBottom: "8vh solid #000", background: "#000" }}>
              <img src={STILLS[i]} alt={`${c.t} film still`} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "2.39/1", objectFit: "cover", display: "block" }} />
            </div>
            <figcaption style={{ display: "flex", justifyContent: "space-between", padding: "12px 4px", fontFamily: "var(--font-code)", fontSize: 12, letterSpacing: "0.15em" }}>
              <span>SC.0{i + 1} — {c.t}</span>
              <span>{c.spec}</span>
            </figcaption>
          </figure>
        ))}
        <div style={{ textAlign: "center", paddingBottom: 80 }}>
          <p style={{ fontFamily: "var(--font-code)", fontSize: 12, letterSpacing: "0.2em" }}>FIN · <Link href="/worlds/motion" style={{ textDecoration: "underline" }}>EXIT CINEMA</Link></p>
        </div>
      </div>
    </div>
  );
}
