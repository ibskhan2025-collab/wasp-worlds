"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";

type Dot = { x: number; y: number; vx: number; vy: number; r: number; pulse: number };

/** ABYSS: hands-off drift. No pointer, no controls — bioluminescent motes rise on their own. */
export function VoidAbyss() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [depth, setDepth] = useState(0);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const dots: Dot[] = Array.from({ length: 90 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006, vy: -0.0004 - Math.random() * 0.0008,
      r: 1 + Math.random() * 2.4, pulse: Math.random() * Math.PI * 2,
    }));
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = Math.min(window.innerHeight * 0.7, 560);
    };
    resize();
    window.addEventListener("resize", resize);
    const loop = () => {
      t += 1;
      ctx.fillStyle = "rgba(2,6,16,0.16)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (const d of dots) {
        d.x += d.vx + Math.sin(t / 90 + d.pulse) * 0.0004;
        d.y += d.vy;
        if (d.y < -0.05) { d.y = 1.05; d.x = Math.random(); }
        if (d.x < -0.05) d.x = 1.05;
        if (d.x > 1.05) d.x = -0.05;
        const glow = 0.5 + 0.5 * Math.sin(t / 40 + d.pulse);
        ctx.fillStyle = `rgba(120, 200, 255, ${0.25 + glow * 0.55})`;
        ctx.beginPath();
        ctx.arc(d.x * canvas.width, d.y * canvas.height, d.r * (0.7 + glow * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
      setDepth((v) => (t % 30 === 0 ? Math.round(4000 - (t % 4000) / 10) / 10 : v));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <div style={{ background: "#020610", color: "#bfe3ff", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="void" label="Room 09 · VOID/ABYSS" />
      <RealityShell world="void" current="abyss" basePath="/worlds/void" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.25em" }}>DESCENT · HANDS OFF THE CONTROLS</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)", margin: "8px 0" }}>ABYSS</h1>
        <canvas ref={ref} style={{ width: "100%", display: "block", border: "1px solid rgba(191,227,255,0.2)" }} aria-label="Bioluminescent drift, no interaction needed" />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12 }}>
          <span>DEPTH {depth.toFixed(1)}m · SINKING</span>
          <Link href="/worlds/void" style={{ textDecoration: "underline" }}>Surface →</Link>
        </div>
        <p style={{ color: "#5f7f99", maxWidth: "52ch" }}>The void without you in it. Ninety motes, one current, zero input. Sometimes an interface proves itself by leaving you alone.</p>
      </div>
      <WorldProof
        proves="Ambient generative systems: a scene that runs beautifully with no hands on it. Restraint, rendered."
        relatedHref="/worlds/signal"
        relatedName="SIGNAL"
      />
    </div>
  );
}

/** INK: static generative print. One seed, one composition, re-rollable. */
export function VoidInk() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [seed, setSeed] = useState(7);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let s = seed * 9301 + 49297;
    const rnd = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = 420);
    ctx.fillStyle = "#e8e4dc";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#111111";
    for (let i = 0; i < 46; i++) {
      const x = rnd() * W;
      const y = rnd() * H;
      const r = 4 + rnd() * 46;
      ctx.globalAlpha = 0.08 + rnd() * 0.5;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.3 + rnd() * 0.7), rnd() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 3;
    ctx.strokeRect(14, 14, W - 28, H - 28);
    ctx.font = "12px monospace";
    ctx.fillText(`VOID STUDY №${seed} — EDITION OF ∞`, 28, H - 28);
  }, [seed]);
  return (
    <div style={{ background: "#e8e4dc", color: "#111", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="void" label="Room 09 · VOID/INK" />
      <RealityShell world="void" current="ink" basePath="/worlds/void" />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.25em" }}>GENERATIVE PRINT · SEEDED</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.6rem)", margin: "8px 0" }}>INK</h1>
        <canvas ref={ref} style={{ width: "100%", display: "block", border: "1px solid #111" }} aria-label="Seeded ink composition" />
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap", alignItems: "center" }}>
          <button type="button" onClick={() => setSeed(Math.floor(Math.random() * 999) + 1)} style={{ background: "#111", color: "#e8e4dc", border: 0, padding: "12px 20px", fontFamily: "inherit", fontSize: 12, letterSpacing: "0.15em" }}>
            PULL ANOTHER →
          </button>
          <span style={{ fontSize: 12 }}>Same press, new seed. Every pull unique, every pull free.</span>
        </div>
      </div>
    </div>
  );
}

export function VoidReactor() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [level, setLevel] = useState(62);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = 380);
    const loop = () => {
      t += 1;
      ctx.fillStyle = "rgba(10,13,18,0.22)";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(159,216,255,0.25)";
      ctx.lineWidth = 1;
      for (let g = 0; g < 5; g++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 8) {
          const y = H / 2 + Math.sin(x / 60 + t / (18 + g * 6) + g) * (14 + g * 10) * (level / 62);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.fillStyle = "#ff5a5a";
      ctx.font = "11px monospace";
      ctx.fillText(`CORE ${level}% · CONTAINMENT NOMINAL`, 14, 24);
      ctx.strokeStyle = "#ff5a5a";
      ctx.strokeRect(14, H - 44, 120, 10);
      ctx.fillRect(14, H - 44, (120 * level) / 100, 10);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [level]);
  return (
    <div style={{ background: "#0a0d12", color: "#9fd8ff", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="void" label="Room 09 · VOID/REACTOR" />
      <RealityShell world="void" current="reactor" basePath="/worlds/void" />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>CHARGED FIELD · DO NOT TAP GLASS</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.6rem)", margin: "8px 0" }}>REACTOR</h1>
        <canvas ref={ref} style={{ width: "100%", display: "block", border: "1px solid rgba(159,216,255,0.3)" }} aria-label="Charged waveform field" />
        <label style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 14, fontSize: 12 }}>
          OUTPUT {level}%
          <input type="range" min={5} max={100} value={level} onChange={(e) => setLevel(Number(e.target.value))} aria-label="Reactor output" style={{ flex: 1 }} />
        </label>
        <p style={{ fontSize: "0.85rem", color: "#5f7f99" }}>Same void, charged. The waveforms respond to output, not to you — some rooms prefer it that way.</p>
      </div>
      <WorldProof
        proves="Ambient systems with teeth: a field that performs whether or not anyone touches it."
        relatedHref="/worlds/signal"
        relatedName="SIGNAL"
      />
    </div>
  );
}

/** ORBIT: clockwork. Satellites on fixed rings — the void with a timetable. */
export function VoidOrbit() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = 380);
    const cx = W / 2;
    const cy = H / 2;
    const sats = [
      { r: 52, speed: 0.022, size: 3, off: 0 },
      { r: 86, speed: -0.014, size: 2.4, off: 2.1 },
      { r: 122, speed: 0.009, size: 2, off: 4.2 },
      { r: 158, speed: -0.006, size: 1.6, off: 1.1 },
    ];
    const loop = () => {
      t += 1;
      ctx.fillStyle = "rgba(4,6,12,0.3)";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(159,216,255,0.22)";
      for (const s of sats) {
        ctx.beginPath();
        ctx.arc(cx, cy, s.r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = "#e8f4ff";
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
      for (const s of sats) {
        const a = s.off + t * s.speed;
        ctx.fillStyle = "rgba(120,200,255,0.9)";
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * s.r, cy + Math.sin(a) * s.r, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div style={{ background: "#04060c", color: "#9fd8ff", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="void" label="Room 09 · VOID/ORBIT" />
      <RealityShell world="void" current="orbit" basePath="/worlds/void" />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>CLOCKWORK · FOUR RINGS · NOTHING DRIFTS</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.6rem)", margin: "8px 0" }}>ORBIT</h1>
        <canvas ref={ref} style={{ width: "100%", display: "block", border: "1px solid rgba(159,216,255,0.3)" }} aria-label="Four satellites on fixed rings" />
        <p style={{ fontSize: "0.85rem", color: "#5f7f99" }}>The same void, timetabled. Four rings, fixed speeds, retrograde included — order you can set a watch to.</p>
        <p><Link href="/worlds/void/notes" style={{ textDecoration: "underline" }}>Field notes →</Link></p>
      </div>
      <WorldProof
        proves="Order as spectacle: clockwork motion that never needs interaction to hold attention."
        relatedHref="/worlds/orbit"
        relatedName="ORBIT"
      />
    </div>
  );
}

/** FIELD: the void notices you. Motes lean toward the pointer — gently, without touching. */
export function VoidField() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const ptr = { x: 0.5, y: 0.5, inside: false };
    const dots: { x: number; y: number; r: number }[] = Array.from({ length: 110 }, () => ({
      x: Math.random(), y: Math.random(), r: 0.8 + Math.random() * 2,
    }));
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = 380);
    const move = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      ptr.x = (e.clientX - rect.left) / rect.width;
      ptr.y = (e.clientY - rect.top) / rect.height;
      ptr.inside = true;
    };
    const leave = () => { ptr.inside = false; };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    const loop = () => {
      ctx.fillStyle = "rgba(6,8,14,0.25)";
      ctx.fillRect(0, 0, W, H);
      for (const d of dots) {
        if (ptr.inside) {
          d.x += (ptr.x - d.x) * 0.008;
          d.y += (ptr.y - d.y) * 0.008;
        } else {
          d.y -= 0.0006;
          if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); }
        }
        ctx.fillStyle = "rgba(160,220,255,0.75)";
        ctx.beginPath();
        ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <div style={{ background: "#06080e", color: "#bfe3ff", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="void" label="Room 09 · VOID/FIELD" />
      <RealityShell world="void" current="field" basePath="/worlds/void" />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>NOTICED · MOVE SLOWLY · IT LEANS IN</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.6rem)", margin: "8px 0" }}>FIELD</h1>
        <canvas ref={ref} style={{ width: "100%", display: "block", border: "1px solid rgba(191,227,255,0.3)", touchAction: "none" }} aria-label="Motes that lean toward your pointer" />
        <p style={{ fontSize: "0.85rem", color: "#5f7f99" }}>The one void that knows you are there. Move across it — 110 motes lean in. Leave, and it goes back to sinking.</p>
        <p><Link href="/worlds/void/notes" style={{ textDecoration: "underline" }}>Field notes →</Link></p>
      </div>
      <WorldProof
        proves="Attention returned: the only void that acknowledges the visitor — interaction as courtesy."
        relatedHref="/worlds/nest"
        relatedName="NEST"
      />
    </div>
  );
}
