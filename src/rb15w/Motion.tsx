"use client";
import "@fontsource-variable/space-grotesk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/rb15l/hooks";

type Curve = [number, number, number, number];
const PRESETS: Record<string, Curve> = { linear: [0, 0, 1, 1], ease: [0.25, 0.1, 0.25, 1], "ease-in": [0.42, 0, 1, 1], "ease-out": [0, 0, 0.58, 1], "ease-in-out": [0.42, 0, 0.58, 1], "expo-out": [0.16, 1, 0.3, 1], "back-out": [0.34, 1.56, 0.64, 1], anticipate: [0.7, -0.45, 0.3, 1.4] };

function bez([x1, y1, x2, y2]: Curve) {
  return (t: number) => {
    if (t <= 0) return 0; if (t >= 1) return 1;
    let lo = 0, hi = 1, u = t;
    for (let i = 0; i < 28; i++) { const x = 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u * u * x2 + u ** 3; if (Math.abs(x - t) < 1e-5) break; if (x < t) lo = u; else hi = u; u = (lo + hi) / 2; }
    return 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u * u * y2 + u ** 3;
  };
}
const css = (c: Curve) => `cubic-bezier(${c.map((n) => +n.toFixed(2)).join(", ")})`;
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const font = { fontFamily: "'Space Grotesk Variable', sans-serif" };
const LIME = "#c6ff3d";

function Editor({ c, setC, f, t }: { c: Curve; setC: (c: Curve) => void; f: (t: number) => number; t: number }) {
  const S = 300, Y0 = -0.6, Y1 = 1.6;
  const px = (x: number) => x * S, py = (y: number) => S - ((y - Y0) / (Y1 - Y0)) * S;
  const drag = useRef<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const setH = (i: 0 | 1, x: number, y: number) => { const n = [...c] as Curve; n[i * 2] = clamp(x, 0, 1); n[i * 2 + 1] = clamp(y, Y0, Y1); setC(n); };
  const move = (e: React.PointerEvent) => { if (drag.current === null) return; const r = svg.current!.getBoundingClientRect(); const x = ((e.clientX - r.left) / r.width); const y = Y1 - ((e.clientY - r.top) / r.height) * (Y1 - Y0); setH(drag.current as 0 | 1, x, y); };
  const path = useMemo(() => Array.from({ length: 61 }, (_, i) => `${i ? "L" : "M"}${px(i / 60)},${py(f(i / 60))}`).join(" "), [f]); // eslint-disable-line react-hooks/exhaustive-deps
  const key = (i: 0 | 1) => (e: React.KeyboardEvent) => { const s = e.shiftKey ? 0.1 : 0.02; const dx = e.key === "ArrowRight" ? s : e.key === "ArrowLeft" ? -s : 0; const dy = e.key === "ArrowUp" ? s : e.key === "ArrowDown" ? -s : 0; if (dx || dy) { e.preventDefault(); setH(i, c[i * 2] + dx, c[i * 2 + 1] + dy); } };
  return (
    <svg ref={svg} viewBox={`0 0 ${S} ${S}`} className="w-full max-w-[340px] touch-none select-none border border-white/20 bg-white/[0.03]" onPointerMove={move} onPointerUp={() => (drag.current = null)} onPointerLeave={() => (drag.current = null)} role="group" aria-label="Cubic bezier editor. Use arrow keys on each handle.">
      <line x1="0" x2={S} y1={py(0)} y2={py(0)} stroke="#fff" strokeOpacity=".25" /><line x1="0" x2={S} y1={py(1)} y2={py(1)} stroke="#fff" strokeOpacity=".25" strokeDasharray="4 4" />
      <line x1={px(0)} y1={py(0)} x2={px(c[0])} y2={py(c[1])} stroke={LIME} strokeOpacity=".6" /><line x1={px(1)} y1={py(1)} x2={px(c[2])} y2={py(c[3])} stroke={LIME} strokeOpacity=".6" />
      <path d={path} fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx={px(t)} cy={py(f(t))} r="6" fill={LIME} /><line x1={px(t)} x2={px(t)} y1={py(f(t))} y2={py(0)} stroke={LIME} strokeOpacity=".4" />
      {([0, 1] as const).map((i) => <circle key={i} cx={px(c[i * 2])} cy={py(c[i * 2 + 1])} r="10" fill={LIME} stroke="#000" strokeWidth="2" tabIndex={0} role="slider" aria-label={`Handle ${i + 1}`} aria-valuetext={`x ${c[i * 2].toFixed(2)}, y ${c[i * 2 + 1].toFixed(2)}`} className="cursor-grab outline-offset-4" onKeyDown={key(i)} onPointerDown={(e) => { drag.current = i; (e.target as Element).setPointerCapture(e.pointerId); }} />)}
    </svg>
  );
}

function useClock(dur: number, loop: boolean) {
  const [t, setT] = useState(1);
  const raf = useRef(0);
  const play = useCallback(() => { cancelAnimationFrame(raf.current); const t0 = performance.now(); const tick = (n: number) => { const e = (n - t0) / dur; if (e >= 1) { setT(1); if (loop) raf.current = window.setTimeout(play, 500) as unknown as number; return; } setT(e); raf.current = requestAnimationFrame(tick); }; raf.current = requestAnimationFrame(tick); }, [dur, loop]);
  useEffect(() => () => { cancelAnimationFrame(raf.current); clearTimeout(raf.current); }, []);
  return { t, play, set: setT };
}

function Stage({ c, reduced }: { c: Curve; reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const f = useMemo(() => bez(c), [c]);
  useEffect(() => { const fn = () => { const r = ref.current!.getBoundingClientRect(); setP(clamp(-r.top / Math.max(1, r.height - window.innerHeight + 88), 0, 1)); }; fn(); window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn); }, []);
  const chapters = [["01", "Timing", "Same start, same end, different middle. Four curves race across the same distance."], ["02", "Anticipation", "To go up, first go down. The squash before the launch is what makes it feel alive."], ["03", "Overlap", "Nothing in the world stops all at once. Offset the parts and they become one body."], ["04", "Weight", "The same curve at different durations: light things hurry, heavy things arrive."]];
  const ci = Math.min(3, Math.floor(p * 4)), lt = reduced ? 1 : clamp(p * 4 - ci, 0, 1), e = f(lt);
  return (
    <div ref={ref} style={{ height: reduced ? "auto" : "400vh" }}>
      <div className={reduced ? "" : "sticky top-[88px] h-[calc(100vh-88px)]"}>
        {(reduced ? [0, 1, 2, 3] : [ci]).map((i) => (
          <section key={i} className="grid h-full min-h-[70vh] items-center gap-6 px-5 sm:px-12 md:grid-cols-[1fr_1.2fr]" aria-label={`Chapter ${chapters[i][0]}: ${chapters[i][1]}`}>
            <div><p className="font-mono text-xs" style={{ color: LIME }}>CHAPTER {chapters[i][0]} / 04</p><h2 className="mt-2 text-6xl font-bold leading-none sm:text-8xl">{chapters[i][1]}</h2><p className="mt-4 max-w-sm text-white/70">{chapters[i][2]}</p>{!reduced && <div className="mt-6 h-1 w-full max-w-sm bg-white/10"><div className="h-1" style={{ width: `${p * 100}%`, background: LIME }} /></div>}</div>
            <svg viewBox="0 0 400 260" className="w-full max-w-xl" role="img" aria-label={`Illustration for ${chapters[i][1]}`}>
              {i === 0 && [["linear", (x: number) => x], ["ease-in", (x: number) => x * x * x], ["ease-out", (x: number) => 1 - (1 - x) ** 3], ["your curve", f]].map(([n, fn], k) => <g key={n as string}><line x1="30" x2="370" y1={50 + k * 60} y2={50 + k * 60} stroke="#fff" strokeOpacity=".15" /><circle cx={30 + (fn as (x: number) => number)(reduced ? 1 : lt) * 340} cy={50 + k * 60} r="11" fill={k === 3 ? LIME : "#fff"} /><text x="30" y={38 + k * 60} fill="#fff" fontSize="10" opacity=".6">{n as string}</text></g>)}
              {i === 1 && (() => { const a = lt < 0.3 ? 1 - (f(lt / 0.3) * 0.4) : 0.6 + f((lt - 0.3) / 0.7) * 0.4; const y = lt < 0.3 ? 200 : 200 - f((lt - 0.3) / 0.7) * 150; return <g><line x1="40" x2="360" y1="216" y2="216" stroke="#fff" strokeOpacity=".3" /><ellipse cx="200" cy={y} rx={34 / Math.sqrt(a)} ry={34 * (lt < 0.3 ? a : 1)} fill={LIME} /></g>; })()}
              {i === 2 && Array.from({ length: 9 }, (_, k) => { const tt = clamp(lt * 1.6 - k * 0.07, 0, 1); return <rect key={k} x={40 + k * 36} y={130 - 10 - f(tt) * 90} width="24" height="110" fill={k % 2 ? "#fff" : LIME} opacity={0.4 + 0.6 * tt} />; })}
              {i === 3 && [["light · 300ms", 0.3], ["medium · 900ms", 0.9], ["heavy · 1800ms", 1.8]].map(([n, d], k) => { const tt = clamp((lt * 1.8) / (d as number), 0, 1); return <g key={n as string}><text x="30" y={44 + k * 76} fill="#fff" fontSize="10" opacity=".6">{n as string}</text><rect x={30 + f(tt) * 280} y={50 + k * 76} width={20 + k * 14} height={20 + k * 14} fill={k === 2 ? LIME : "#fff"} /></g>; })}
            </svg>
          </section>
        ))}
      </div>
    </div>
  );
}

function Playground({ c, setC, reduced }: { c: Curve; setC: (c: Curve) => void; reduced: boolean }) {
  const [dur, setDur] = useState(1200);
  const [loop, setLoop] = useState(false);
  const { t, play } = useClock(dur, loop);
  const f = useMemo(() => bez(c), [c]);
  const p = f(t);
  const name = Object.entries(PRESETS).find(([, v]) => v.every((n, i) => Math.abs(n - c[i]) < 0.005))?.[0] ?? "custom";
  const [copied, setCopied] = useState(false);
  return (
    <section id="playground" className="px-5 py-20 sm:px-12" aria-labelledby="pg-h">
      <h2 id="pg-h" className="text-5xl font-bold sm:text-7xl">Easing playground</h2><p className="mt-3 max-w-xl text-white/60">Drag the two handles (or focus one and use arrow keys). The plotted curve, the moving objects and the headline above all run through the same function.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[340px_1fr]">
        <div>
          <Editor c={c} setC={setC} f={f} t={t} />
          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Presets">{Object.keys(PRESETS).map((n) => <button key={n} aria-pressed={name === n} onClick={() => { setC(PRESETS[n]); play(); }} className={"border px-2.5 py-1 font-mono text-[11px] " + (name === n ? "border-[#c6ff3d] bg-[#c6ff3d] text-black" : "border-white/25")}>{n}</button>)}</div>
          <label className="mt-4 block text-sm">Duration <b>{dur}ms</b><input type="range" min={200} max={3000} step={50} value={dur} onChange={(e) => setDur(+e.target.value)} className="mt-1 w-full" style={{ accentColor: LIME }} /></label>
          <div className="mt-3 flex flex-wrap items-center gap-3"><button onClick={play} className="bg-[#c6ff3d] px-5 py-2.5 font-semibold text-black">▶ Replay</button><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} />Loop</label></div>
          <div className="mt-4 flex items-center gap-2"><code className="flex-1 overflow-x-auto border border-white/20 px-3 py-2 font-mono text-xs">{css(c)}</code><button className="border border-white/30 px-3 py-2 text-xs" onClick={() => { navigator.clipboard?.writeText(css(c)); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? "Copied" : "Copy"}</button></div>
        </div>
        <div className="space-y-6">
          {reduced && <p className="border border-white/30 p-3 text-sm">Reduced-motion mode: movement is replaced by state change. The objects below fade and change outline instead of travelling.</p>}
          <div className="relative h-16 border border-white/15" aria-label="Position demo"><div className="absolute top-2 h-12 w-12" style={{ left: reduced ? "auto" : `calc(${p * 100}% - ${p * 48}px)`, right: reduced ? 0 : "auto", background: LIME, opacity: reduced ? 0.3 + 0.7 * clamp(t, 0, 1) : 1 }} /></div>
          <div className="flex h-44 items-center justify-around border border-white/15"><div className="h-20 w-20 rounded-full" style={{ background: "#fff", transform: reduced ? "none" : `scale(${0.4 + p * 0.9})`, opacity: reduced ? 0.3 + 0.7 * t : 1, outline: reduced ? `${Math.round(t * 6)}px solid ${LIME}` : "none" }} aria-label="Scale demo" /><div className="h-20 w-20" style={{ background: LIME, transform: reduced ? "none" : `rotate(${p * 180}deg)`, opacity: reduced ? 0.3 + 0.7 * t : 1 }} aria-label="Rotation demo" /></div>
          <div className="border border-white/15 p-5" aria-label="Typography demo"><p className="text-[clamp(2rem,7vw,5rem)] leading-none" style={{ fontWeight: Math.round(300 + p * 400), letterSpacing: reduced ? "0" : `${(1 - p) * 0.4 - 0.04}em`, opacity: reduced ? 0.3 + 0.7 * t : 0.15 + p * 0.85 }}>Weight follows curve</p><p className="mt-2 font-mono text-xs text-white/50">t = {t.toFixed(2)} · f(t) = {p.toFixed(2)} {p > 1 || p < 0 ? "· overshoot" : ""}</p></div>
        </div>
      </div>
    </section>
  );
}

const TRACKS = [["Position", "ease-out", 0, 0.7], ["Scale", "back-out", 0.2, 0.8], ["Rotation", "ease-in-out", 0.1, 1], ["Opacity", "linear", 0, 0.4], ["Tracking", "expo-out", 0.3, 1]] as const;
function Dopesheet({ reduced }: { reduced: boolean }) {
  const [tr, setTr] = useState(TRACKS.map(([n, e, s, en]) => ({ n, e: e as string, s, en })));
  const [t, setT] = useState(0.5); const [play, setPlay] = useState(false);
  useEffect(() => { if (!play) return; let raf = 0; const t0 = performance.now() - t * 3000; const tick = (n: number) => { const v = ((n - t0) / 3000) % 1; setT(v); raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf); }, [play]); // eslint-disable-line react-hooks/exhaustive-deps
  const val = (i: number) => { const x = tr[i]; return bez(PRESETS[x.e])(clamp((t - x.s) / Math.max(0.01, x.en - x.s), 0, 1)); };
  const up = (i: number, k: "e" | "s" | "en", v: string | number) => setTr(tr.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  return (
    <div className="grid min-h-[calc(100vh-88px)] gap-0 lg:grid-cols-[1fr_380px]" style={font}>
      <div className="p-5 sm:p-8">
        <h1 className="text-5xl font-bold sm:text-7xl">Dopesheet</h1><p className="mt-2 max-w-lg text-white/60">Five animated properties, each with its own easing and time range. Scrub the playhead or press play.</p>
        <div className="mt-6 flex items-center gap-3"><button onClick={() => setPlay(!play)} className="bg-[#c6ff3d] px-5 py-2 font-semibold text-black">{play ? "❚❚ Pause" : "▶ Play"}</button><label className="flex flex-1 items-center gap-3 text-sm">Playhead<input type="range" min={0} max={1} step={0.005} value={t} onChange={(e) => { setPlay(false); setT(+e.target.value); }} className="flex-1" style={{ accentColor: LIME }} /><span className="w-12 font-mono">{t.toFixed(2)}</span></label></div>
        <div className="mt-6 space-y-2">{tr.map((x, i) => (
          <div key={x.n} className="grid items-center gap-3 border border-white/10 p-2 sm:grid-cols-[110px_1fr_auto]"><span className="text-sm font-semibold">{x.n}<span className="block font-mono text-[10px] text-white/50">{val(i).toFixed(2)}</span></span>
            <div className="relative h-8 bg-white/5"><div className="absolute top-1 h-6 bg-[#c6ff3d]/30" style={{ left: `${x.s * 100}%`, width: `${(x.en - x.s) * 100}%` }} /><span className="absolute top-2 h-4 w-4 rotate-45 bg-[#c6ff3d]" style={{ left: `calc(${x.s * 100}% - 8px)` }} /><span className="absolute top-2 h-4 w-4 rotate-45 bg-[#c6ff3d]" style={{ left: `calc(${x.en * 100}% - 8px)` }} /><span className="absolute inset-y-0 w-px bg-white" style={{ left: `${t * 100}%` }} /></div>
            <div className="flex gap-2 text-xs"><select aria-label={`${x.n} easing`} value={x.e} onChange={(e) => up(i, "e", e.target.value)} className="border border-white/25 bg-black px-1 py-1">{Object.keys(PRESETS).map((n) => <option key={n}>{n}</option>)}</select><label className="sr-only" htmlFor={`s${i}`}>{x.n} start</label><input id={`s${i}`} type="number" min={0} max={0.9} step={0.05} value={x.s} onChange={(e) => up(i, "s", clamp(+e.target.value, 0, x.en - 0.05))} className="w-14 border border-white/25 bg-black px-1 py-1" /><label className="sr-only" htmlFor={`e${i}`}>{x.n} end</label><input id={`e${i}`} type="number" min={0.1} max={1} step={0.05} value={x.en} onChange={(e) => up(i, "en", clamp(+e.target.value, x.s + 0.05, 1))} className="w-14 border border-white/25 bg-black px-1 py-1" /></div></div>))}</div>
      </div>
      <div className="flex flex-col items-center justify-center border-t border-white/10 bg-white/[0.03] p-8 lg:border-l lg:border-t-0" aria-label="Preview"><div className="flex h-64 w-full items-center" style={{ paddingLeft: `${(reduced ? 1 : val(0)) * 55}%` }}><div className="h-20 w-20" style={{ background: LIME, transform: reduced ? "none" : `scale(${0.4 + val(1) * 0.8}) rotate(${val(2) * 120}deg)`, opacity: 0.15 + val(3) * 0.85 }} /></div>
        <p className="mt-2 text-3xl font-bold" style={{ letterSpacing: `${(1 - val(4)) * 0.35}em` }}>MOTION</p></div>
    </div>
  );
}

export default function Motion({ reality }: { reality: string }) {
  const sys = useReducedMotion();
  const [opt, setOpt] = useState<boolean | null>(null);
  const reduced = opt ?? sys;
  const [c, setC] = useState<Curve>(PRESETS["expo-out"]);
  const [run, setRun] = useState(0);
  const f = css(c);
  const title = "MOVE WITH INTENT";
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#f2f2ee]" style={font}>
      <div className="flex items-center justify-end gap-3 border-b border-white/10 px-4 py-2 text-xs"><label className="flex items-center gap-2"><input type="checkbox" checked={reduced} onChange={(e) => setOpt(e.target.checked)} />Reduced-motion mode {sys && opt === null ? "(from your system)" : ""}</label></div>
      {reality === "stage" ? (
        <>
          <style>{`@keyframes mo-l{from{transform:translateY(110%) rotate(8deg);opacity:0}to{transform:none;opacity:1}}`}</style>
          <section className="flex min-h-[80vh] flex-col justify-end px-5 pb-16 sm:px-12"><h1 key={run + f} className="text-[clamp(3.2rem,12vw,11rem)] font-bold leading-[0.88] tracking-tight" aria-label={title}>{title.split(" ").map((w, wi) => <span key={wi} className="mr-[0.25em] inline-block overflow-hidden align-top" aria-hidden="true">{w.split("").map((ch, i) => <span key={i} className="inline-block" style={reduced ? undefined : { animation: `mo-l 900ms ${f} both`, animationDelay: `${(wi * 5 + i) * 45}ms` }}>{ch}</span>)}</span>)}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-4"><button onClick={() => setRun(run + 1)} className="border border-white/40 px-4 py-2 text-sm">↻ Replay headline</button><a href="#playground" className="text-sm underline" style={{ color: LIME }}>Edit its curve ↓</a><code className="font-mono text-xs text-white/50">{f}</code></div></section>
          <Stage c={c} reduced={reduced} />
          <Playground c={c} setC={setC} reduced={reduced} />
        </>
      ) : <Dopesheet reduced={reduced} />}
    </div>
  );
}

