"use client";

import { useEffect, useRef, useState } from "react";
import { useLocal } from "@/rb54l/state";
type XP = { reality: string; world?: unknown };

type Diff = "easy" | "normal" | "hard";
const CFG: Record<Diff, { spawn: number; speed: number; noise: number }> = { easy: { spawn: 0.9, speed: 140, noise: 0.3 }, normal: { spawn: 0.6, speed: 200, noise: 0.4 }, hard: { spawn: 0.38, speed: 280, noise: 0.5 } };
type Phase = "menu" | "play" | "pause" | "over";

export default function Signal({ reality }: XP) {
  const cv = useRef<HTMLCanvasElement>(null);
  const [diff, setDiff] = useState<Diff>("normal");
  const [phase, setPhase] = useState<Phase>("menu");
  const [hud, setHud] = useState({ score: 0, lives: 3, time: 45 });
  const [rec, setRec] = useLocal<Record<Diff, number>>("wasp:signal:records", { easy: 0, normal: 0, hard: 0 });
  const [sound, setSound] = useLocal("wasp:signal:sound", false);
  const phaseRef = useRef(phase); phaseRef.current = phase;
  const vector = reality === "vector";
  const startRef = useRef<() => void>(() => {});

  useEffect(() => {
    const c = cv.current!; const g = c.getContext("2d")!;
    let W = 0, H = 0, raf = 0, last = 0, spawnT = 0, shake = 0;
    const s = { x: 0, tx: 0, score: 0, lives: 3, time: 45, items: [] as { x: number; y: number; v: number; bad: boolean; r: number }[], sparks: [] as { x: number; y: number; vx: number; vy: number; l: number; c: string }[] };
    const keys = new Set<string>();
    let ac: AudioContext | null = null;
    const beep = (f: number, d = 0.08) => { if (!sound) return; ac ??= new AudioContext(); const o = ac.createOscillator(), gn = ac.createGain(); o.type = "square"; o.frequency.value = f; gn.gain.setValueAtTime(0.06, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d); o.connect(gn).connect(ac.destination); o.start(); o.stop(ac.currentTime + d); };
    const resize = () => { const r = c.getBoundingClientRect(); W = r.width; H = r.height; c.width = W * devicePixelRatio; c.height = H * devicePixelRatio; g.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); if (!s.x) s.x = s.tx = W / 2; };
    resize(); addEventListener("resize", resize);
    startRef.current = () => { Object.assign(s, { score: 0, lives: 3, time: 45, items: [], sparks: [], x: W / 2, tx: W / 2 }); setHud({ score: 0, lives: 3, time: 45 }); setPhase("play"); };
    const end = () => { setPhase("over"); setRec((r) => (s.score > r[diff] ? { ...r, [diff]: s.score } : r)); beep(110, 0.4); };
    const burst = (x: number, y: number, col: string) => { for (let i = 0; i < 14; i++) s.sparks.push({ x, y, vx: (Math.random() - 0.5) * 300, vy: (Math.random() - 1) * 260, l: 0.6, c: col }); };

    const onKey = (e: KeyboardEvent) => {
      if (e.type === "keydown") keys.add(e.key.toLowerCase()); else keys.delete(e.key.toLowerCase());
      if (e.type !== "keydown") return;
      if (["arrowleft", "arrowright", " "].includes(e.key.toLowerCase()) && phaseRef.current === "play") e.preventDefault();
      if (e.key.toLowerCase() === "p" && (phaseRef.current === "play" || phaseRef.current === "pause")) setPhase(phaseRef.current === "play" ? "pause" : "play");
      if (e.key.toLowerCase() === "r" && phaseRef.current !== "menu") startRef.current();
    };
    addEventListener("keydown", onKey); addEventListener("keyup", onKey);
    let dragOff = 0;
    const onDown = (e: PointerEvent) => { dragOff = s.x - (e.clientX - c.getBoundingClientRect().left); };
    const onMove = (e: PointerEvent) => { if (e.pointerType === "mouse" && e.buttons === 0) { s.tx = e.clientX - c.getBoundingClientRect().left; return; } s.tx = e.clientX - c.getBoundingClientRect().left + dragOff; };
    c.addEventListener("pointerdown", onDown); c.addEventListener("pointermove", onMove);

    const cfg = CFG[diff];
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - (last || now)) / 1000, 1 / 30); last = now;
      const play = phaseRef.current === "play";
      if (play) {
        if (keys.has("arrowleft") || keys.has("a")) s.tx -= 520 * dt;
        if (keys.has("arrowright") || keys.has("d")) s.tx += 520 * dt;
        s.tx = Math.max(24, Math.min(W - 24, s.tx)); s.x += (s.tx - s.x) * Math.min(1, dt * 14);
        s.time -= dt; const ramp = 1 + (45 - s.time) / 45;
        spawnT -= dt;
        if (spawnT <= 0) { spawnT = cfg.spawn / ramp; s.items.push({ x: 20 + Math.random() * (W - 40), y: -20, v: cfg.speed * (0.8 + Math.random() * 0.5) * ramp, bad: Math.random() < cfg.noise, r: 10 + Math.random() * 6 }); }
        for (const it of s.items) it.y += it.v * dt;
        s.items = s.items.filter((it) => {
          if (it.y > H - 44 && it.y < H - 12 && Math.abs(it.x - s.x) < 30 + it.r) {
            if (it.bad) { s.lives--; shake = 0.12; burst(it.x, it.y, "#ff3ea5"); beep(90, 0.2); } else { s.score += 10; burst(it.x, it.y, "#ffe45c"); beep(660 + Math.random() * 200); }
            return false;
          }
          return it.y < H + 30;
        });
        if (s.lives <= 0 || s.time <= 0) { s.time = Math.max(0, s.time); end(); }
        setHud({ score: s.score, lives: s.lives, time: Math.ceil(s.time) });
      }
      for (const p of s.sparks) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 500 * dt; p.l -= dt; }
      s.sparks = s.sparks.filter((p) => p.l > 0);
      // draw
      g.save();
      if (shake > 0) { shake -= dt; g.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6); }
      g.fillStyle = vector ? "#020a04" : "#12002b"; g.fillRect(-10, -10, W + 20, H + 20);
      if (!vector) { g.strokeStyle = "rgba(255,62,165,.12)"; for (let y = (now / 20) % 40; y < H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } }
      for (const it of s.items) {
        if (vector) { g.strokeStyle = it.bad ? "#ff5050" : "#39ff6a"; g.lineWidth = 2; g.beginPath(); if (it.bad) { g.moveTo(it.x - it.r, it.y - it.r); g.lineTo(it.x + it.r, it.y + it.r); g.moveTo(it.x + it.r, it.y - it.r); g.lineTo(it.x - it.r, it.y + it.r); } else g.arc(it.x, it.y, it.r, 0, Math.PI * 2); g.stroke(); }
        else { g.fillStyle = it.bad ? "#ff3ea5" : "#ffe45c"; if (it.bad) g.fillRect(it.x - it.r, it.y - it.r, it.r * 2, it.r * 2); else { g.beginPath(); g.arc(it.x, it.y, it.r, 0, Math.PI * 2); g.fill(); } }
      }
      for (const p of s.sparks) { g.globalAlpha = Math.max(p.l / 0.6, 0); g.fillStyle = vector ? "#39ff6a" : p.c; g.fillRect(p.x, p.y, 3, 3); }
      g.globalAlpha = 1;
      if (vector) { g.strokeStyle = "#39ff6a"; g.lineWidth = 2; g.beginPath(); g.moveTo(s.x - 26, H - 16); g.lineTo(s.x, H - 40); g.lineTo(s.x + 26, H - 16); g.closePath(); g.stroke(); }
      else { g.fillStyle = "#7df9ff"; g.fillRect(s.x - 28, H - 28, 56, 12); g.fillStyle = "#fff5c2"; g.fillRect(s.x - 8, H - 38, 16, 10); }
      g.restore();
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); removeEventListener("keydown", onKey); removeEventListener("keyup", onKey); c.removeEventListener("pointerdown", onDown); c.removeEventListener("pointermove", onMove); ac?.close(); };
  }, [diff, vector, sound, setRec]);

  const font = vector ? "'JetBrains Mono', monospace" : "'Press Start 2P', monospace";
  const col = vector ? "#39ff6a" : "#fff5c2";
  return (
    <div className="relative select-none" style={{ fontFamily: font, color: col, background: vector ? "#020a04" : "#12002b" }}>
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-[10px] md:px-8 md:text-xs">
        <span>SCORE {String(hud.score).padStart(4, "0")}</span>
        <span aria-label={`${hud.lives} lives`}>{"♥".repeat(Math.max(hud.lives, 0))}{"·".repeat(3 - Math.max(hud.lives, 0))}</span>
        <span>TIME {hud.time}s</span>
        <span>BEST {rec[diff]}</span>
        <button onClick={() => setSound(!sound)} aria-pressed={sound} className="border border-current px-2 py-1">SOUND {sound ? "ON" : "OFF"}</button>
      </div>
      <canvas ref={cv} className="block h-[64vh] w-full touch-none" aria-label="SIGNAL game canvas. Catch round signals, avoid square noise." data-cursor="PLAY" />
      {phase !== "play" && (
        <div className="absolute inset-0 top-10 flex flex-col items-center justify-center gap-5 bg-black/50 p-6 text-center">
          <p className="text-2xl md:text-4xl">{phase === "menu" ? "SIGNAL" : phase === "pause" ? "PAUSED" : hud.lives <= 0 ? "NO SIGNAL" : "TIME"}</p>
          {phase === "over" && <p className="text-xs">SCORE {hud.score} {hud.score >= rec[diff] && hud.score > 0 ? "· NEW RECORD" : ""}</p>}
          <p className="max-w-sm text-[10px] leading-6">CATCH ● · DODGE ■<br />← → / A D / MOUSE · DRAG ON TOUCH<br />P PAUSE · R RESTART</p>
          {phase !== "pause" && (
            <div className="flex gap-2 text-[10px]" role="radiogroup" aria-label="Difficulty">
              {(["easy", "normal", "hard"] as Diff[]).map((d) => <button key={d} role="radio" aria-checked={diff === d} onClick={() => setDiff(d)} className={`border border-current px-3 py-2 ${diff === d ? "bg-[#ff3ea5] text-black" : ""}`}>{d.toUpperCase()}</button>)}
            </div>
          )}
          <button onClick={() => (phase === "pause" ? setPhase("play") : startRef.current())} className="bg-[#ff3ea5] px-6 py-3 text-xs text-black" autoFocus>{phase === "pause" ? "RESUME" : phase === "over" ? "AGAIN" : "PRESS START"}</button>
          {phase === "menu" ? null : <p className="text-[9px] opacity-70">RECORDS · E {rec.easy} · N {rec.normal} · H {rec.hard}</p>}
        </div>
      )}
      {phase === "play" && <button onClick={() => setPhase("pause")} className="absolute right-3 top-14 border border-current px-2 py-1 text-[10px]">❚❚</button>}
    </div>
  );
}
