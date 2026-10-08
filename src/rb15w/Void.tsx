"use client";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { usePersist, useReducedMotion } from "@/rb15l/hooks";

const Shader = dynamic(() => import("./void/Shader"), { ssr: false });
const Space3D = dynamic(() => import("./void/Space3D"), { ssr: false });

type P = { x: number; y: number; vx: number; vy: number; tx: number; ty: number };
type G = { x: number; y: number; vy: number; ch: string; life: number };
const GLYPHS = "∴∵◦◇△▽⌇≈∿✳";
const SECRETS: Record<string, [string, string]> = { glyph: ["Type anything", "Letters become matter"], bang: ["Double-click", "Everything has a beginning"], hole: ["Hold still", "Patience has gravity"], wasp: ["Type a four-letter name", "The studio is in the field"], void: ["Say the word", "It looks back"] };
const NOTES = [
  ["Why 180?", "We tried 60 (too sparse to feel like a material), 600 (the screen turned into fog) and settled on 180. At that number individual particles are still readable while the swarm still behaves like one body. The density slider is there so you can disagree."],
  ["Pointer as a physical object", "The pointer is not a cursor here, it is a mass with a radius. Forces fall off linearly toward its edge, so nothing snaps. Holding flips its sign. That single inversion — push to pull — accounts for most of the pleasure."],
  ["Liquid is a lie (a good one)", "The Liquid reality runs the exact same simulation. The trick is at render time: draw soft white circles, blur the canvas, then push the contrast through a threshold. Where blurs overlap, they merge. No fluid dynamics involved."],
  ["Fixed frame, variable time", "Everything is integrated by frame delta with a hard clamp at 50ms, so a background tab returning to focus doesn't explode the simulation. Verlet would be more stable; Euler is more legible, and legible won."],
  ["Hidden things", "Five interactions are hidden on purpose. They are documented here and in the discovery counter. A fallback exists for everything: Space triggers a burst, the pause button freezes the field, and Reduced Motion starts the world paused."],
];

export default function Void({ reality }: { reality: string }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(180);
  const [attract, setAttract] = useState(false);
  const [paused, setPaused] = useState(false);
  const [found, setFound] = usePersist<string[]>("void-found", []);
  const [toast, setToast] = useState("");
  const cv = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const live = useRef({ n, attract, paused, reality, found });
  live.current = { n, attract, paused, reality, found };
  const pausedInit = useRef(false);
  useEffect(() => { if (reduced && !pausedInit.current) { pausedInit.current = true; setPaused(true); } }, [reduced]);
  const discover = useRef((k: string) => { void k; });
  discover.current = (k: string) => { if (live.current.found.includes(k)) return; setFound((f) => (f.includes(k) ? f : [...f, k])); setToast(`Discovered: ${SECRETS[k][1]}`); setTimeout(() => setToast(""), 2600); };
  const canvasMode = reality === "particles" || reality === "liquid" || reality === "gravity";

  useEffect(() => {
    if (!canvasMode) return;
    const c = cv.current!, ctx = c.getContext("2d")!, el = box.current!;
    let W = 0, H = 0, raf = 0, last = performance.now();
    const ptr = { x: -999, y: -999, down: false, hx: 0, hy: 0, hold: 0 };
    let ps: P[] = [], gl: G[] = [], invert = 0, form = 0, hole = 0, buf = "";
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const fit = () => { W = c.width = el.clientWidth; H = c.height = el.clientHeight; };
    const make = (k: number) => { while (ps.length < k) ps.push({ x: rnd(0, W), y: rnd(0, H), vx: rnd(-30, 30), vy: rnd(-30, 30), tx: 0, ty: 0 }); ps.length = k; };
    const waspTargets = () => {
      const o = document.createElement("canvas"); o.width = W; o.height = H; const x = o.getContext("2d")!; x.fillStyle = "#fff"; x.font = `900 ${Math.min(H * 0.4, W * 0.26)}px 'IBM Plex Mono', monospace`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("WASP", W / 2, H / 2);
      const d = x.getImageData(0, 0, W, H).data, pts: [number, number][] = []; for (let yy = 0; yy < H; yy += 7) for (let xx = 0; xx < W; xx += 7) if (d[(yy * W + xx) * 4 + 3] > 128) pts.push([xx, yy]);
      pts.sort(() => Math.random() - 0.5); ps.forEach((p, i) => { const t = pts[i % Math.max(1, pts.length)] ?? [W / 2, H / 2]; p.tx = t[0]; p.ty = t[1]; });
    };
    const spawnGlyph = (ch: string, x = ptr.x > 0 ? ptr.x : W / 2, y = ptr.y > 0 ? ptr.y : H / 2) => gl.push({ x, y, vy: -20, ch, life: 6 });
    const bang = (x: number, y: number) => { ps.forEach((p) => { const a = Math.atan2(p.y - y, p.x - x), s = rnd(300, 900); p.vx += Math.cos(a) * s; p.vy += Math.sin(a) * s; }); for (let i = 0; i < 12; i++) spawnGlyph(GLYPHS[i % GLYPHS.length], x + rnd(-40, 40), y + rnd(-40, 40)); };
    fit(); make(live.current.n);
    const rect = () => c.getBoundingClientRect();
    const mv = (e: PointerEvent) => { const r = rect(); const x = e.clientX - r.left, y = e.clientY - r.top; if (Math.hypot(x - ptr.hx, y - ptr.hy) > 14) { ptr.hx = x; ptr.hy = y; ptr.hold = 0; } ptr.x = x; ptr.y = y; };
    const dn = (e: PointerEvent) => { ptr.down = true; mv(e); ptr.hold = 0; if (e.detail === 0) return; };
    const up = () => (ptr.down = false);
    const lv = () => { ptr.x = -999; ptr.y = -999; };
    const dbl = (e: MouseEvent) => { const r = rect(); bang(e.clientX - r.left, e.clientY - r.top); discover.current("bang"); };
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement; if (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "TEXTAREA" || e.metaKey || e.ctrlKey) return;
      if (e.key === " " && t === document.body) { e.preventDefault(); bang(W / 2, H / 2); return; }
      if (e.key.length !== 1) return;
      spawnGlyph(e.key.toUpperCase()); discover.current("glyph"); buf = (buf + e.key.toLowerCase()).slice(-6);
      if (buf.endsWith("wasp")) { waspTargets(); form = 5; discover.current("wasp"); buf = ""; }
      if (buf.endsWith("void")) { invert = 6; discover.current("void"); buf = ""; }
    };
    c.addEventListener("pointermove", mv); c.addEventListener("pointerdown", dn); window.addEventListener("pointerup", up); c.addEventListener("pointerleave", lv); c.addEventListener("dblclick", dbl); window.addEventListener("keydown", key);
    const ro = new ResizeObserver(() => { fit(); }); ro.observe(el);
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const L = live.current; const mode = L.reality;
      if (ps.length !== L.n) make(L.n);
      if (!L.paused) {
        invert = Math.max(0, invert - dt); form = Math.max(0, form - dt); hole = Math.max(0, hole - dt);
        if (ptr.down || (ptr.x > 0 && !ptr.down)) { ptr.hold += dt; if (ptr.hold > 1.3 && hole <= 0 && ptr.x > 0) { hole = 3; ptr.hold = -99; discover.current("hole"); } }
        const R = 170, sign = ((L.attract ? 1 : -1) * (ptr.down ? -1 : 1)) * (invert > 0 ? -1 : 1);
        for (const p of ps) {
          if (mode === "gravity") {
            for (const [mx, my, M] of [[W / 2, H / 2, 160000], [ptr.x, ptr.y, ptr.x > 0 ? (ptr.down ? 900000 : 220000) : 0]] as [number, number, number][]) { if (!M) continue; const dx = mx - p.x, dy = my - p.y, d2 = dx * dx + dy * dy + 900, d = Math.sqrt(d2), a = M / d2; p.vx += (dx / d) * a * dt * (invert > 0 ? -1 : 1); p.vy += (dy / d) * a * dt * (invert > 0 ? -1 : 1); }
            if (Math.random() < 0.0004) { p.vx += rnd(-60, 60); p.vy += rnd(-60, 60); }
          } else {
            const dx = ptr.x - p.x, dy = ptr.y - p.y, d = Math.hypot(dx, dy);
            if (d < R && ptr.x > 0) { const f = (1 - d / R) * 900 * dt; p.vx += (dx / (d + 1)) * f * sign; p.vy += (dy / (d + 1)) * f * sign; }
            p.vx += rnd(-1, 1) * 40 * dt; p.vy += rnd(-1, 1) * 40 * dt;
          }
          if (hole > 0 && ptr.x > 0) { const dx = ptr.x - p.x, dy = ptr.y - p.y, d = Math.hypot(dx, dy) + 1; p.vx += (dx / d) * 1800 * dt; p.vy += (dy / d) * 1800 * dt; if (d < 14) { const a = rnd(0, 6.28); p.x = ptr.x + Math.cos(a) * 30; p.y = ptr.y + Math.sin(a) * 30; p.vx = Math.cos(a) * 500; p.vy = Math.sin(a) * 500; } }
          if (form > 0) { p.vx += (p.tx - p.x) * 7 * dt; p.vy += (p.ty - p.y) * 7 * dt; p.vx *= 0.9; p.vy *= 0.9; }
          const damp = mode === "gravity" ? 0.15 : 0.9;
          p.vx *= 1 - damp * dt; p.vy *= 1 - damp * dt;
          const sp = Math.hypot(p.vx, p.vy); if (sp > 900) { p.vx *= 900 / sp; p.vy *= 900 / sp; }
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (mode === "gravity") { if (p.x < -50) p.x = W + 50; if (p.x > W + 50) p.x = -50; if (p.y < -50) p.y = H + 50; if (p.y > H + 50) p.y = -50; }
          else { if (p.x < 0) { p.x = 0; p.vx *= -0.8; } if (p.x > W) { p.x = W; p.vx *= -0.8; } if (p.y < 0) { p.y = 0; p.vy *= -0.8; } if (p.y > H) { p.y = H; p.vy *= -0.8; } }
        }
        gl.forEach((g) => { g.y += g.vy * dt; g.life -= dt; }); gl = gl.filter((g) => g.life > 0);
      }
      if (mode === "liquid") { ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#fff"; for (const p of ps) { ctx.beginPath(); ctx.arc(p.x, p.y, 14 + Math.min(10, Math.hypot(p.vx, p.vy) * 0.02), 0, 7); ctx.fill(); } }
      else {
        ctx.fillStyle = mode === "gravity" ? "rgba(0,0,0,.08)" : "rgba(0,0,0,.28)"; ctx.fillRect(0, 0, W, H);
        if (mode === "particles") { ctx.lineWidth = 1; for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) { const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y; if (dx * dx + dy * dy < 4900) { ctx.strokeStyle = `rgba(150,130,255,${0.35 - Math.hypot(dx, dy) / 200})`; ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.stroke(); } } }
        for (const p of ps) { const sp = Math.hypot(p.vx, p.vy); ctx.fillStyle = `hsl(${250 + Math.min(80, sp * 0.3)},90%,${60 + Math.min(25, sp * 0.06)}%)`; ctx.beginPath(); ctx.arc(p.x, p.y, mode === "gravity" ? 1.6 : 2.6, 0, 7); ctx.fill(); }
        if (mode === "gravity") { ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.beginPath(); ctx.arc(W / 2, H / 2, 6, 0, 7); ctx.stroke(); }
      }
      if (hole > 0 && ptr.x > 0) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ptr.x, ptr.y, 14 + Math.sin(now / 80) * 3, 0, 7); ctx.stroke(); }
      ctx.font = "600 22px 'IBM Plex Mono', monospace"; ctx.textAlign = "center"; gl.forEach((g) => { ctx.globalAlpha = Math.min(1, g.life / 2); ctx.fillStyle = "#d8d8ff"; ctx.fillText(g.ch, g.x, g.y); }); ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); c.removeEventListener("pointermove", mv); c.removeEventListener("pointerdown", dn); window.removeEventListener("pointerup", up); c.removeEventListener("pointerleave", lv); c.removeEventListener("dblclick", dbl); window.removeEventListener("keydown", key); };
  }, [canvasMode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-black text-[#d8d8ff]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <div ref={box} className="relative h-[calc(100vh-132px)] min-h-[440px] overflow-hidden">
        {canvasMode && <div className="absolute inset-0" style={reality === "liquid" ? { filter: "blur(9px) contrast(22)" } : undefined}><canvas ref={cv} className="block h-full w-full touch-none" role="img" aria-label={`Interactive particle field, ${n} particles. Move the pointer to push them, hold to pull, double-click to burst. Press Space for a burst.`} /></div>}
        {reality === "liquid" && <div className="pointer-events-none absolute inset-0 mix-blend-multiply" style={{ background: "linear-gradient(120deg,#7a5cff,#19e6d1 60%,#ff4fa3)" }} aria-hidden="true" />}
        {reality === "shader" && <Shader />}
        {reality === "space" && <Space3D n={n} mode={attract ? "attract" : "repel"} />}
        <div className="pointer-events-none absolute left-4 top-4"><p className="text-xs uppercase tracking-[0.3em] text-white/60">VOID / {reality}</p><h1 className="text-[clamp(2.5rem,8vw,7rem)] font-semibold leading-none">{reality === "shader" ? "FIELD" : `${n} BODIES`}</h1></div>
        {toast && <p role="status" className="absolute inset-x-0 top-1/2 mx-auto w-fit bg-white px-4 py-2 text-sm text-black">{toast}</p>}
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-3 bg-gradient-to-t from-black/80 to-transparent p-3 text-xs">
          {reality !== "shader" && <><label className="flex items-center gap-2">Density <b>{n}</b><input type="range" min={60} max={300} step={10} value={n} onChange={(e) => setN(+e.target.value)} aria-label="Particle density" style={{ accentColor: "#7a5cff" }} /></label>
            <button aria-pressed={attract} onClick={() => setAttract(!attract)} className="border border-white/40 px-3 py-1.5">Pointer: {attract ? "attracts" : "repels"}</button></>}
          {canvasMode && <button aria-pressed={paused} onClick={() => setPaused(!paused)} className="border border-white/40 px-3 py-1.5">{paused ? "▶ Resume" : "❚❚ Pause"}</button>}
          <span className="ml-auto text-white/50">{reality === "shader" ? "move · press" : "move = push · hold = flip · dbl-click = burst · type to spawn · Space = burst"}</span>
        </div>
      </div>
      <section className="border-t border-white/10 px-5 py-14 sm:px-12" aria-labelledby="notes-h">
        <div className="flex flex-wrap items-end justify-between gap-4"><h2 id="notes-h" className="text-4xl font-semibold sm:text-6xl">Field notes</h2><p className="text-xs text-white/60">Hidden interactions: {found.length}/5 discovered</p></div>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Hidden interactions">{Object.entries(SECRETS).map(([k, [hint, name]]) => <li key={k} className={"border px-3 py-1.5 text-xs " + (found.includes(k) ? "border-[#7a5cff] text-white" : "border-white/20 text-white/40")}>{found.includes(k) ? `✓ ${name}` : `? ${hint}`}</li>)}</ul>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">{NOTES.map(([t, b], i) => <article key={t}><p className="text-xs text-[#7a5cff]">NOTE {String(i + 1).padStart(2, "0")}</p><h3 className="mt-1 text-xl font-semibold">{t}</h3><p className="mt-2 text-sm leading-relaxed text-white/70">{b}</p></article>)}</div>
      </section>
    </div>
  );
}

