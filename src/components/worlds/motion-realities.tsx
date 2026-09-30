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

const SWELL = ["MOVE", "CUT", "HOLD", "BLUR", "BURN", "AGAIN"];

export function MotionOceanic() {
  return (
    <div style={{ background: "#06222b", color: "#e8f4f0", minHeight: "100dvh" }}>
      <WorldExit id="motion" label="Room 08 · MOTION/FLUID" />
      <RealityShell world="motion" current="oceanic" basePath="/worlds/motion" />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 80px" }}>
        <p style={{ fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.3em", color: "#2ea8a0" }}>FLUID TIMING · EVERYTHING DRIFTS</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.6rem, 8vw, 5.5rem)", margin: "8px 0 8px" }}>Motion, underwater.</h1>
        <p style={{ color: "#9fd0d2", maxWidth: "52ch" }}>Same six chapters, rescored for water: longer easings, slower reveals, nothing that snaps. Duration ×1.8 across the board.</p>
        {SWELL.map((s, i) => (
          <section key={s} style={{ marginTop: 40 }}>
            <p style={{ fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.25em", color: "#2ea8a0", margin: 0 }}>SWELL 0{i + 1}</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 12vw, 7rem)", lineHeight: 0.9, margin: "6px 0" }}>{s}</h2>
            <svg viewBox="0 0 400 36" width="100%" height="36" preserveAspectRatio="none" aria-hidden style={{ display: "block" }}>
              <path d={`M0,18 Q50,${6 + i * 2} 100,18 T200,18 T300,18 T400,18`} fill="none" stroke="#2ea8a0" strokeWidth="2" opacity={0.9 - i * 0.1} />
              <path d={`M0,26 Q50,${16 + i * 2} 100,26 T200,26 T300,26 T400,26`} fill="none" stroke="#2ea8a0" strokeWidth="1" opacity="0.45" />
            </svg>
          </section>
        ))}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 40 }}>
          <Link href="/worlds/motion" style={{ border: "1px solid #2ea8a0", color: "#e8f4f0", padding: "12px 20px", fontSize: 12, letterSpacing: "0.15em" }}>BACK TO DRY LAND →</Link>
          <Link href="/worlds/motion/principles" style={{ border: "1px solid #e8f4f055", color: "#e8f4f0", padding: "12px 20px", fontSize: 12, letterSpacing: "0.15em" }}>PRINCIPLES →</Link>
        </div>
      </div>
      <WorldProof
        proves="The same campaign at half tempo. Timing is a material — change the material, change the film."
        relatedHref="/worlds/pulse"
        relatedName="PULSE"
      />
    </div>
  );
}

export function MotionStoryboard() {
  return (
    <div style={{ background: "#efe9dc", color: "#1a1712", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="motion" label="Room 08 · MOTION/BOARDS" />
      <RealityShell world="motion" current="storyboard" basePath="/worlds/motion" />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.25em" }}>BOARDS · REV C · PINNED, NOT RENDERED</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.6rem, 8vw, 5.5rem)", margin: "8px 0", letterSpacing: "-0.04em" }}>Before it moves.</h1>
        <p style={{ maxWidth: "56ch", fontSize: "0.95rem" }}>The same six chapters as thumbnail boards — what the client approves before a single frame renders.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginTop: 28 }}>
          {CHAPTERS.map((c, i) => (
            <figure key={c.t} style={{ margin: 0, border: "2px solid #1a1712", background: "#faf7f0", padding: 12 }}>
              <div style={{ aspectRatio: "16/9", background: `repeating-linear-gradient(45deg, #1a1712 0 2px, transparent 2px 10px)`, border: "1px solid #1a1712", display: "grid", placeItems: "center" }}>
                <span style={{ background: "#faf7f0", padding: "4px 12px", fontWeight: 700, fontSize: "1.4rem" }}>{c.t}</span>
              </div>
              <figcaption style={{ marginTop: 10, fontSize: "0.8rem" }}>
                <strong>SC {String(i + 1).padStart(2, "0")}</strong> · {c.spec} · {c.frames} FR
              </figcaption>
            </figure>
          ))}
        </div>
        <div style={{ marginTop: 28 }}>
          <Link href="/worlds/motion/commissions" style={{ background: "#1a1712", color: "#efe9dc", padding: "12px 20px", fontSize: 12, letterSpacing: "0.15em" }}>BOARD YOUR CAMPAIGN →</Link>
        </div>
      </div>
      <WorldProof
        proves="Pre-production as product: boards clients can read — approval before render, never after."
        relatedHref="/worlds/still"
        relatedName="STILL"
      />
    </div>
  );
}

export function MotionCredits() {
  const crew: [string, string][] = [
    ["MOVE", "performed by the full bleed"],
    ["CUT", "edited without mercy"],
    ["HOLD", "stillness, holding for 144 frames"],
    ["BLUR", "in-betweening at speed"],
    ["BURN", "heat, rising on a spring"],
    ["AGAIN", "the loop, uncredited as usual"],
  ];
  return (
    <div style={{ background: "#000", color: "#f4f1ea", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="motion" label="Room 08 · MOTION/CREDITS" />
      <RealityShell world="motion" current="credits" basePath="/worlds/motion" />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "64px 20px 80px", textAlign: "center" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.4em", color: "#8a8580" }}>AFTER THE LOOP · STAY SEATED</p>
        <div style={{ marginTop: 48 }}>
          {crew.map(([who, role]) => (
            <div key={who} style={{ margin: "36px 0" }}>
              <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#8a8580", margin: 0 }}>{role.toUpperCase()}</p>
              <p style={{ fontSize: "2rem", margin: "6px 0", fontWeight: 700 }}>{who}</p>
            </div>
          ))}
          <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#8a8580", marginTop: 48 }}>TIMING BY</p>
          <p style={{ fontSize: "2rem", fontWeight: 700 }}>THE SHEET</p>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#8a8580", marginTop: 36 }}>NO FRAMES WERE HARMED</p>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 48 }}>
          <Link href="/worlds/motion/principles" style={{ border: "1px solid #f4f1ea", color: "#f4f1ea", padding: "12px 20px", fontSize: 12, letterSpacing: "0.15em" }}>PRINCIPLES →</Link>
          <Link href="/worlds/motion/commissions" style={{ background: "#f4f1ea", color: "#000", padding: "12px 20px", fontSize: 12, letterSpacing: "0.15em" }}>GET IN THE CREDITS →</Link>
        </div>
      </div>
      <WorldProof
        proves="Credit where due: even the loop gets named — craft visible down to the last frame."
        relatedHref="/worlds/archive"
        relatedName="ARCHIVE"
      />
    </div>
  );
}
