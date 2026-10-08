"use client";

import { useEffect, useRef, useState } from "react";
type XP = { reality: string; world?: unknown };

const GLYPHS = "WASP·/\\*+=<>{}#";

export default function Void({ reality }: XP) {
  const cv = useRef<HTMLCanvasElement>(null);
  const [density, setDensity] = useState(1);
  const [stat, setStat] = useState({ n: 0, energy: 0, fps: 60 });
  const ink = reality === "ink", glyphs = reality === "glyphs";

  useEffect(() => {
    const c = cv.current!; const g = c.getContext("2d")!;
    let W = 0, H = 0, raf = 0, N = 0;
    let px = new Float32Array(0), py = px, vx = px, vy = px, hx = px, hy = px, ch = new Uint8Array(0);
    const m = { x: -9999, y: -9999, vx: 0, vy: 0, down: false, active: false, last: 0 };
    const setup = () => {
      const r = c.getBoundingClientRect(); W = r.width; H = r.height;
      c.width = W * devicePixelRatio; c.height = H * devicePixelRatio; g.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      N = Math.min(4000, Math.floor((W * H) / (glyphs ? 900 : 260) * density));
      px = new Float32Array(N); py = new Float32Array(N); vx = new Float32Array(N); vy = new Float32Array(N); hx = new Float32Array(N); hy = new Float32Array(N); ch = new Uint8Array(N);
      for (let i = 0; i < N; i++) { const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * Math.min(W, H) * 0.42; hx[i] = W / 2 + Math.cos(a) * rr * 1.4; hy[i] = H / 2 + Math.sin(a) * rr; px[i] = Math.random() * W; py[i] = Math.random() * H; ch[i] = (Math.random() * GLYPHS.length) | 0; }
    };
    setup();
    const ro = new ResizeObserver(setup); ro.observe(c);
    const pos = (e: PointerEvent) => { const r = c.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top; m.vx = m.vx * 0.7 + (x - m.x) * 0.3; m.vy = m.vy * 0.7 + (y - m.y) * 0.3; m.x = x; m.y = y; m.active = true; m.last = performance.now(); };
    let hold: ReturnType<typeof setTimeout>;
    const down = (e: PointerEvent) => { pos(e); if (e.pointerType === "touch") hold = setTimeout(() => (m.down = true), 350); else m.down = true; };
    const up = () => { clearTimeout(hold); m.down = false; };
    const leave = () => { m.active = false; m.x = m.y = -9999; };
    c.addEventListener("pointermove", pos); c.addEventListener("pointerdown", down); addEventListener("pointerup", up); c.addEventListener("pointerleave", leave);
    let frames = 0, t0 = performance.now(), energyAcc = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const idle = now - m.last > 2500;
      const speed = Math.min(Math.hypot(m.vx, m.vy), 80);
      m.vx *= 0.92; m.vy *= 0.92;
      // Faster cursor → wider, stronger influence. Slow → gentle.
      const R = 90 + speed * 3, R2 = R * R, force = (m.down ? -1 : 1) * (0.6 + speed * 0.05);
      g.fillStyle = ink ? "rgba(244,241,234,0.35)" : glyphs ? "rgba(5,6,8,0.5)" : "rgba(5,6,8,0.18)";
      g.fillRect(0, 0, W, H);
      g.fillStyle = ink ? "#161412" : glyphs ? "#7cf5d0" : "#d7e0ea";
      if (glyphs) { g.font = "11px JetBrains Mono, monospace"; }
      let e = 0;
      for (let i = 0; i < N; i++) {
        let ax = (hx[i] - px[i]) * (idle ? 0.004 : 0.0012), ay = (hy[i] - py[i]) * (idle ? 0.004 : 0.0012);
        if (m.active) {
          const dx = m.x - px[i], dy = m.y - py[i], d2 = dx * dx + dy * dy;
          if (d2 < R2) { const d = Math.sqrt(d2) + 0.01, f = (1 - d / R) * force; ax += (dx / d) * f + m.vx * 0.012 * (1 - d / R); ay += (dy / d) * f + m.vy * 0.012 * (1 - d / R); ax += (-dy / d) * 0.25 * (1 - d / R); ay += (dx / d) * 0.25 * (1 - d / R); }
        }
        vx[i] = (vx[i] + ax) * 0.94; vy[i] = (vy[i] + ay) * 0.94;
        px[i] += vx[i]; py[i] += vy[i];
        const sp = vx[i] * vx[i] + vy[i] * vy[i]; e += sp;
        if (glyphs) g.fillText(GLYPHS[ch[i]], px[i], py[i]);
        else { const s = ink ? 1.6 : sp > 4 ? 2 : 1.2; g.fillRect(px[i], py[i], s, s); }
      }
      energyAcc = e / Math.max(N, 1);
      frames++;
      if (now - t0 > 500) { setStat({ n: N, energy: energyAcc, fps: Math.round((frames * 1000) / (now - t0)) }); frames = 0; t0 = now; }
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); c.removeEventListener("pointermove", pos); c.removeEventListener("pointerdown", down); removeEventListener("pointerup", up); c.removeEventListener("pointerleave", leave); };
  }, [density, ink, glyphs]);

  const calm = stat.energy < 0.3;
  return (
    <div className={`grid lg:grid-cols-[1fr_300px] ${ink ? "bg-[#f4f1ea] text-[#161412]" : "bg-[#050608] text-[#d7e0ea]"}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <canvas ref={cv} className="h-[78vh] w-full touch-none" aria-label="Interactive particle field. Move to attract, hold to repel." data-cursor={calm ? "EXPLORE" : "STIR"} />
      <aside className="space-y-6 border-l border-current/10 p-6 text-xs">
        <div><p className="opacity-50">FIELD</p><p className="mt-2 text-lg">{stat.n.toLocaleString()} particles · {stat.fps} fps</p>
          <div className="mt-2 h-1 bg-current/10"><div className="h-full bg-[#7cf5d0] transition-all" style={{ width: `${Math.min(stat.energy * 30, 100)}%` }} /></div>
          <p className="mt-1 opacity-60">energy — {calm ? "resting" : stat.energy > 2 ? "stirred" : "moving"}</p></div>
        <label className="block">DENSITY ×{density.toFixed(1)}<input type="range" min={0.2} max={1.6} step={0.1} value={density} onChange={(e) => setDensity(+e.target.value)} className="mt-2 w-full accent-[#7cf5d0]" /></label>
        <div className="space-y-3 leading-relaxed opacity-80">
          <p className="opacity-50">FIELD NOTES</p>
          <p>Move slowly: particles lean toward you. Move fast: the radius grows and they&apos;re dragged along with your velocity, not just your position.</p>
          <p>Hold (long-press on touch) to push them away instead.</p>
          <p>Leave it for 2.5s and home-pull quadruples — the field goes back to rest.</p>
          <p>There&apos;s a small tangential force, which is why they swirl instead of clumping.</p>
        </div>
      </aside>
    </div>
  );
}
