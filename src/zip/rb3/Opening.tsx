"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Magnetic } from "@/zip/rb3/ui";

function Count({ to, label }: { to: number | string; label: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (typeof to !== "number") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(to);
    let raf = 0; const t0 = performance.now();
    const f = (t: number) => { const p = Math.min(1, (t - t0) / 1600); setN(Math.round(to * (1 - (1 - p) ** 3))); if (p < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf);
  }, [to]);
  return <div><p className="text-5xl font-black tabular-nums sm:text-7xl">{typeof to === "number" ? n : to}</p><p className="mt-1 font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">{label}</p></div>;
}

export default function Opening({ afterCtas, beforeCounts }: { afterCtas?: ReactNode; beforeCounts?: ReactNode }) {
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current!, ctx = c.getContext("2d")!; let W = 0, H = 0, raf = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ps = Array.from({ length: 72 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.00006, vy: (Math.random() - 0.5) * 0.00006 }));
    const m = { x: -1, y: -1 };
    const fit = () => { W = c.width = c.clientWidth; H = c.height = c.clientHeight; };
    fit();
    const mv = (e: PointerEvent) => { const r = c.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; };
    window.addEventListener("pointermove", mv); window.addEventListener("resize", fit);
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ps.forEach((p) => { if (!reduce) { p.x += p.vx * 16; p.y += p.vy * 16; } if (p.x < 0 || p.x > 1) p.vx *= -1; if (p.y < 0 || p.y > 1) p.vy *= -1; const dx = p.x * W - m.x, dy = p.y * H - m.y, d = Math.hypot(dx, dy); if (d < 140 && !reduce) { p.x += (dx / d) * 0.0012; p.y += (dy / d) * 0.0012; } });
      for (let i = 0; i < ps.length; i++) { const a = ps[i]; ctx.fillStyle = "rgba(255,210,63,.75)"; ctx.fillRect(a.x * W - 1, a.y * H - 1, 2.5, 2.5); for (let j = i + 1; j < ps.length; j++) { const b = ps[j], d = Math.hypot((a.x - b.x) * W, (a.y - b.y) * H); if (d < 130) { ctx.strokeStyle = `rgba(255,255,255,${0.14 * (1 - d / 130)})`; ctx.beginPath(); ctx.moveTo(a.x * W, a.y * H); ctx.lineTo(b.x * W, b.y * H); ctx.stroke(); } } }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", mv); window.removeEventListener("resize", fit); };
  }, []);
  return (
    <section className="relative flex min-h-[calc(100vh-44px)] flex-col justify-between overflow-hidden px-5 pb-8 pt-10 sm:px-10" aria-labelledby="home-h">
      <canvas ref={cv} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="relative">
        <p className="wasp-up font-mono text-[11px] uppercase tracking-[0.35em] text-[#ffd23f]">Independent creative technology studio</p>
        <h1 id="home-h" className="mt-6 select-none text-[clamp(6rem,30vw,28rem)] font-black leading-[0.78] tracking-[-0.05em]">
          <span className="sr-only">WASP — We don&apos;t make websites. We build worlds.</span>
          <span aria-hidden="true" className="wasp-up inline-block" style={{ animationDelay: ".1s" }}>WASP</span>
        </h1>
      </div>
      {beforeCounts}
      <div className="relative mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div>
          <p className="wasp-up text-[clamp(1.6rem,4.5vw,4rem)] font-black leading-[1.02] tracking-tight" style={{ animationDelay: ".35s" }}>WE DON&apos;T MAKE<br />WEBSITES.</p>
          <p className="wasp-up text-[clamp(1.6rem,4.5vw,4rem)] font-black leading-[1.02] tracking-tight text-[#ffd23f]" style={{ animationDelay: ".55s" }}>WE BUILD<br />WORLDS.</p>
          <div className="wasp-up mt-8 flex flex-wrap items-center gap-4" style={{ animationDelay: ".8s" }}>
            <Magnetic><Link href="/worlds" className="inline-block bg-[#ffd23f] px-8 py-4 text-sm font-black uppercase tracking-[0.15em] text-black">Enter the worlds →</Link></Magnetic>
            <Link href="/start" className="border-b border-white/50 pb-1 text-sm uppercase tracking-[0.15em] text-white/80 hover:text-white">Start a project</Link>
          </div>
          {afterCtas}
        </div>
        <div className="wasp-up grid grid-cols-3 gap-4 border-t border-white/20 pt-6" style={{ animationDelay: "1s" }}>
          <Count to={15} label="Worlds" /><Count to="∞" label="Realities" /><Count to={1} label="Studio" />
        </div>
      </div>
      <a href="#field" className="relative mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-white/50 hover:text-white">Scroll · the field ↓</a>
    </section>
  );
}
