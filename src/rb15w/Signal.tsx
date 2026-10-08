"use client";
import "@fontsource/press-start-2p";
import "@fontsource-variable/newsreader";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePersist, useReducedMotion } from "@/rb15l/hooks";
import { post } from "@/rb15l/ui";

type Diff = "calm" | "standard" | "frantic";
const D: Record<Diff, { speed: number; spawn: number; noise: number; w: number; label: string }> = {
  calm: { speed: 150, spawn: 0.85, noise: 0.22, w: 96, label: "Calm" },
  standard: { speed: 210, spawn: 0.62, noise: 0.32, w: 80, label: "Standard" },
  frantic: { speed: 290, spawn: 0.42, noise: 0.4, w: 66, label: "Frantic" },
};
const W = 480, H = 640, DURATION = 45;
type Item = { x: number; y: number; k: "sig" | "noise" | "gold"; r: number; vx: number };
type Part = { x: number; y: number; vx: number; vy: number; life: number; c: string };
type Rec = { best: Record<Diff, number>; combo: number; plays: number; caught: number };
const REC0: Rec = { best: { calm: 0, standard: 0, frantic: 0 }, combo: 0, plays: 0, caught: 0 };

const SKIN = {
  arcade: { bg: "#05070d", grid: "rgba(0,255,255,.07)", sig: "#7ff9ff", noise: "#ff2e7e", gold: "#ffe14a", rx: "#ffffff", text: "#9cf7ff" },
  ink: { bg: "#efe9dc", grid: "rgba(40,30,20,.06)", sig: "#1f3a5f", noise: "#a1302a", gold: "#b58a1e", rx: "#2b2520", text: "#2b2520" },
};

export default function Signal({ reality }: { reality: string }) {
  const skin = SKIN[reality === "ink" ? "ink" : "arcade"];
  const ink = reality === "ink";
  const sysReduced = useReducedMotion();
  const [reduceOpt, setReduceOpt] = useState<boolean | null>(null);
  const reduced = reduceOpt ?? sysReduced;
  const [diff, setDiff] = useState<Diff>("standard");
  const [rec, setRec] = usePersist<Rec>("signal-rec", REC0);
  const [phase, setPhase] = useState<"idle" | "playing" | "paused" | "over">("idle");
  const [hud, setHud] = useState({ score: 0, left: DURATION, lives: 3, combo: 0 });
  const [result, setResult] = useState<{ score: number; acc: number; maxCombo: number; newBest: boolean } | null>(null);
  const [board, setBoard] = useState<{ id: number; name: string; score: number }[]>([]);
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [announce, setAnnounce] = useState("");
  const cv = useRef<HTMLCanvasElement>(null);
  const g = useRef({ x: W / 2, tx: W / 2, items: [] as Item[], parts: [] as Part[], left: DURATION, score: 0, lives: 3, combo: 0, maxCombo: 0, caught: 0, missed: 0, spawn: 0, shake: 0, phase: "idle" as string, hold: 0, t: 0 });
  const live = useRef({ diff, reduced, skin, ink, rec });
  live.current = { diff, reduced, skin, ink, rec };

  const loadBoard = useCallback(() => { fetch(`/api/scores?difficulty=${diff}`).then((r) => r.json()).then((d) => setBoard(d.rows ?? [])).catch(() => setBoard([])); }, [diff]);
  useEffect(loadBoard, [loadBoard]);

  const start = useCallback(() => {
    const s = g.current;
    Object.assign(s, { x: W / 2, tx: W / 2, items: [], parts: [], left: DURATION, score: 0, lives: 3, combo: 0, maxCombo: 0, caught: 0, missed: 0, spawn: 0.5, shake: 0, phase: "playing", t: 0 });
    setHud({ score: 0, left: DURATION, lives: 3, combo: 0 }); setResult(null); setSent(false); setPhase("playing"); setAnnounce("Game started. Catch signals, avoid noise.");
    cv.current?.focus();
  }, []);
  const pause = useCallback(() => { const s = g.current; if (s.phase === "playing") { s.phase = "paused"; setPhase("paused"); } else if (s.phase === "paused") { s.phase = "playing"; setPhase("playing"); } }, []);

  const finish = useCallback(() => {
    const s = g.current; s.phase = "over";
    const d = live.current.diff, r = live.current.rec;
    const acc = s.caught + s.missed ? Math.round((s.caught / (s.caught + s.missed)) * 100) : 0;
    const nb = s.score > r.best[d];
    setRec({ best: { ...r.best, [d]: Math.max(r.best[d], s.score) }, combo: Math.max(r.combo, s.maxCombo), plays: r.plays + 1, caught: r.caught + s.caught });
    setResult({ score: s.score, acc, maxCombo: s.maxCombo, newBest: nb }); setPhase("over"); setAnnounce(`Game over. Score ${s.score}.`);
  }, [setRec]);

  useEffect(() => {
    let raf = 0, last = performance.now(), acc = 0, hudT = 0;
    const c = cv.current!; const ctx = c.getContext("2d")!;
    const burst = (x: number, y: number, col: string, n: number) => { if (live.current.reduced) return; for (let i = 0; i < n; i++) g.current.parts.push({ x, y, vx: (Math.random() - 0.5) * 240, vy: (Math.random() - 0.5) * 240, life: 0.5, c: col }); };
    const step = (dt: number) => {
      const s = g.current; const cfg = D[live.current.diff]; const sk = live.current.skin;
      const slow = live.current.reduced ? 0.8 : 1;
      s.t += dt; s.left -= dt;
      s.x += (s.tx - s.x) * Math.min(1, dt * 14);
      s.spawn -= dt;
      const ramp = 1 + (1 - s.left / DURATION) * 0.6;
      if (s.spawn <= 0) { s.spawn = (cfg.spawn / ramp) * (0.7 + Math.random() * 0.6); const r = Math.random(); s.items.push({ x: 24 + Math.random() * (W - 48), y: -20, k: r < cfg.noise ? "noise" : r > 0.95 ? "gold" : "sig", r: 13, vx: (Math.random() - 0.5) * 40 * (live.current.diff === "frantic" ? 2 : 1) }); }
      const rw = cfg.w / 2, ry = H - 46;
      for (const it of s.items) {
        it.y += cfg.speed * ramp * slow * dt; it.x += it.vx * dt; if (it.x < 14 || it.x > W - 14) it.vx *= -1;
        if (it.y > ry - 12 && it.y < ry + 14 && Math.abs(it.x - s.x) < rw + it.r * 0.6) {
          it.y = 9999;
          if (it.k === "noise") { s.lives--; s.combo = 0; if (!live.current.reduced) s.shake = 0.3; burst(it.x, ry, sk.noise, 18); setAnnounce(`Noise hit. ${s.lives} lives left.`); }
          else { s.caught++; s.combo++; s.maxCombo = Math.max(s.maxCombo, s.combo); s.score += (it.k === "gold" ? 50 : 10) * (1 + Math.floor(s.combo / 5)); burst(it.x, ry, it.k === "gold" ? sk.gold : sk.sig, 10); }
        } else if (it.y > H + 20 && it.k !== "noise") { s.missed++; s.combo = 0; }
      }
      s.items = s.items.filter((i) => i.y < H + 30);
      s.parts.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }); s.parts = s.parts.filter((p) => p.life > 0);
      s.shake = Math.max(0, s.shake - dt);
      const dir = s.hold; if (dir) s.tx = Math.max(rw, Math.min(W - rw, s.tx + dir * 520 * dt));
      if (s.lives <= 0 || s.left <= 0) { s.left = Math.max(0, s.left); finish(); }
    };
    const draw = () => {
      const s = g.current; const sk = live.current.skin; const cfg = D[live.current.diff]; const ink = live.current.ink;
      ctx.save(); ctx.fillStyle = sk.bg; ctx.fillRect(0, 0, W, H);
      if (s.shake > 0) ctx.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
      ctx.strokeStyle = sk.grid; for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = (s.t * 30) % 40; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      for (const it of s.items) {
        ctx.save(); ctx.translate(it.x, it.y);
        if (it.k === "noise") { ctx.strokeStyle = sk.noise; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = (i / 8) * 6.28 + s.t * 2, r = i % 2 ? 7 : 15; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.stroke(); }
        else { ctx.strokeStyle = it.k === "gold" ? sk.gold : sk.sig; ctx.fillStyle = ink ? "transparent" : (it.k === "gold" ? sk.gold : sk.sig) + "33"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 0, it.r, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, it.r * 0.4 + Math.sin(s.t * 6) * 2, 0, 7); ctx.stroke(); }
        ctx.restore();
      }
      ctx.fillStyle = sk.rx; const rw = cfg.w; ctx.fillRect(s.x - rw / 2, H - 46, rw, 6); ctx.fillRect(s.x - 3, H - 58, 6, 12);
      ctx.strokeStyle = sk.rx; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.arc(s.x, H - 46, rw / 2 + 6, Math.PI, 0); ctx.stroke(); ctx.globalAlpha = 1;
      s.parts.forEach((p) => { ctx.globalAlpha = Math.max(0, p.life * 2); ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, 4, 4); }); ctx.globalAlpha = 1;
      ctx.restore();
    };
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (g.current.phase === "playing") { acc += dt; while (acc >= 1 / 60 && g.current.phase === "playing") { step(1 / 60); acc -= 1 / 60; } } else acc = 0;
      draw();
      hudT += dt; if (hudT > 0.1) { hudT = 0; const s = g.current; setHud((h) => (h.score === s.score && h.lives === s.lives && h.combo === s.combo && Math.ceil(h.left) === Math.ceil(s.left) ? h : { score: s.score, left: s.left, lives: s.lives, combo: s.combo })); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const vis = () => { if (document.hidden) { if (g.current.phase === "playing") { g.current.phase = "paused"; setPhase("paused"); } } };
    document.addEventListener("visibilitychange", vis);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", vis); };
  }, [finish]);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement; if (t.tagName === "INPUT") return;
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") { g.current.hold = -1; e.preventDefault(); }
      if (k === "arrowright" || k === "d") { g.current.hold = 1; e.preventDefault(); }
      if (k === "p" || (k === " " && g.current.phase !== "idle" && g.current.phase !== "over")) { e.preventDefault(); pause(); }
      if (k === "r") start();
      if ((k === "enter" || k === " ") && (g.current.phase === "idle" || g.current.phase === "over") && t.tagName !== "BUTTON") { e.preventDefault(); start(); }
    };
    const ku = (e: KeyboardEvent) => { const k = e.key.toLowerCase(); if (["arrowleft", "a", "arrowright", "d"].includes(k)) g.current.hold = 0; };
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    return () => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [pause, start]);

  const move = (e: React.PointerEvent) => { const r = cv.current!.getBoundingClientRect(); const rw = D[diff].w / 2; g.current.tx = Math.max(rw, Math.min(W - rw, ((e.clientX - r.left) / r.width) * W)); };
  const submit = async (e: React.FormEvent) => { e.preventDefault(); if (!result) return; await post("/api/scores", { name: name || "anon", difficulty: diff, score: result.score }); setSent(true); loadBoard(); };
  const font = ink ? "'Newsreader Variable', serif" : "'Press Start 2P', monospace";
  const C = ink ? "bg-[#efe9dc] text-[#2b2520]" : "bg-[#05070d] text-[#9cf7ff]";
  const btn = ink ? "border border-[#2b2520] px-4 py-3 hover:bg-[#2b2520] hover:text-[#efe9dc]" : "border-2 border-[#9cf7ff] px-4 py-3 hover:bg-[#9cf7ff] hover:text-black";

  return (
    <div className={`${C} min-h-[calc(100vh-88px)] px-3 py-6 sm:px-8`} style={{ fontFamily: font }}>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,480px)_1fr]">
        <div>
          <div className="mb-2 flex items-center justify-between text-[10px] sm:text-xs" aria-label="Game status">
            <span>SCORE {String(hud.score).padStart(5, "0")}</span><span aria-label={`${Math.ceil(hud.left)} seconds left`}>{Math.ceil(hud.left)}s</span><span aria-label={`${hud.lives} lives`}>{"♥".repeat(Math.max(0, hud.lives)) + "·".repeat(3 - Math.max(0, hud.lives))}</span><span>x{1 + Math.floor(hud.combo / 5)}</span>
          </div>
          <div className="relative" style={{ aspectRatio: `${W}/${H}` }}>
            <canvas ref={cv} width={W} height={H} tabIndex={0} aria-label="SIGNAL game. Move the receiver with left and right arrows, A and D, mouse or touch. P pauses, R restarts." className={"h-full w-full touch-none border-2 " + (ink ? "border-[#2b2520]" : "border-[#9cf7ff]")} onPointerMove={move} onPointerDown={(e) => { move(e); (e.target as HTMLElement).setPointerCapture(e.pointerId); }} />
            {!ink && <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,.5) 0 1px, transparent 1px 3px)" }} aria-hidden="true" />}
            {phase !== "playing" && (
              <div className={"absolute inset-0 flex flex-col items-center justify-center gap-4 p-5 text-center backdrop-blur-[2px] " + (ink ? "bg-[#efe9dc]/90" : "bg-black/75")}>
                {phase === "idle" && <><h1 className="text-2xl sm:text-3xl">SIGNAL</h1><p className="max-w-xs text-[10px] leading-relaxed sm:text-xs">Catch the pulses. Dodge the noise. Forty-five seconds, three lives.</p><button className={btn + " text-xs"} onClick={start}>START ▶</button></>}
                {phase === "paused" && <><h2 className="text-2xl">PAUSED</h2><button className={btn + " text-xs"} onClick={pause}>RESUME</button><button className="text-[10px] underline" onClick={start}>Restart</button></>}
                {phase === "over" && result && <><h2 className="text-xl">{g.current.lives <= 0 ? "SIGNAL LOST" : "TIME"}</h2><p className="text-2xl">{result.score}</p><p className="text-[10px] leading-loose">ACCURACY {result.acc}% · BEST COMBO {result.maxCombo}{result.newBest && <><br />★ NEW PERSONAL BEST</>}</p>
                  {!sent ? <form onSubmit={submit} className="flex gap-2"><label className="sr-only" htmlFor="sn">Name for the leaderboard</label><input id="sn" value={name} onChange={(e) => setName(e.target.value.slice(0, 12))} placeholder="NAME" maxLength={12} className="w-28 border bg-transparent px-2 py-2 text-xs" /><button className={btn + " py-2 text-[10px]"}>SUBMIT</button></form> : <p className="text-[10px]">Score submitted.</p>}
                  <button className={btn + " text-xs"} onClick={start}>AGAIN ↻</button></>}
              </div>
            )}
          </div>
          <div className="mt-3 flex gap-2 sm:hidden" aria-label="Touch controls">
            {([["◀", -1], ["▶", 1]] as const).map(([l, d]) => <button key={l} aria-label={d < 0 ? "Move left" : "Move right"} className={btn + " h-16 flex-1 select-none text-2xl touch-none"} onPointerDown={() => (g.current.hold = d)} onPointerUp={() => (g.current.hold = 0)} onPointerLeave={() => (g.current.hold = 0)} onPointerCancel={() => (g.current.hold = 0)}>{l}</button>)}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px]">
            <button onClick={pause} disabled={phase === "idle" || phase === "over"} className={btn + " !px-3 !py-2 disabled:opacity-30"}>{phase === "paused" ? "RESUME (P)" : "PAUSE (P)"}</button><button onClick={start} className={btn + " !px-3 !py-2"}>RESTART (R)</button>
            <label className="ml-auto flex items-center gap-2"><input type="checkbox" checked={reduced} onChange={(e) => setReduceOpt(e.target.checked)} />Reduce motion</label>
          </div>
          <p className="sr-only" role="status" aria-live="polite">{announce}</p>
        </div>
        <aside className="space-y-6 text-[10px] leading-relaxed sm:text-xs">
          <div><h2 className="mb-2 opacity-70">DIFFICULTY</h2><div className="flex gap-2" role="radiogroup" aria-label="Difficulty">{(Object.keys(D) as Diff[]).map((d) => <button key={d} role="radio" aria-checked={diff === d} disabled={phase === "playing"} onClick={() => setDiff(d)} className={"flex-1 border-2 px-2 py-3 " + (diff === d ? (ink ? "bg-[#2b2620] text-[#efe9dc]" : "bg-[#9cf7ff] text-black") : "opacity-70")}>{D[d].label}</button>)}</div></div>
          <div><h2 className="mb-2 opacity-70">RECORDS</h2><dl className="grid grid-cols-2 gap-y-2"><dt>Best · calm</dt><dd>{rec.best.calm}</dd><dt>Best · standard</dt><dd>{rec.best.standard}</dd><dt>Best · frantic</dt><dd>{rec.best.frantic}</dd><dt>Best combo</dt><dd>{rec.combo}</dd><dt>Games played</dt><dd>{rec.plays}</dd><dt>Signals caught</dt><dd>{rec.caught}</dd></dl></div>
          <div><h2 className="mb-2 opacity-70">LEADERBOARD · {D[diff].label.toUpperCase()}</h2>{board.length === 0 ? <p className="opacity-60">No scores yet. Be the first.</p> : <ol className="space-y-1">{board.map((b, i) => <li key={b.id} className="flex justify-between"><span>{i + 1}. {b.name}</span><span>{b.score}</span></li>)}</ol>}</div>
          <div className="opacity-70"><h2 className="mb-2">HOW</h2><p>◆ Pulses +10, gold +50. Every 5 chain raises the multiplier.<br />◆ Noise costs a life. Missing a pulse only breaks the chain.<br />◆ Keys: ← → or A D. Mouse or finger: drag. P pause, R restart.</p></div>
        </aside>
      </div>
    </div>
  );
}

