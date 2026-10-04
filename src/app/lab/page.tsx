"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import "@fontsource-variable/space-grotesk";
import { loadJson, saveJson, WORKSHOP_KEY } from "@/lib/storage";

const Lab3D = dynamic(() => import("@/components/lab/lab-3d"), {
  ssr: false,
  loading: () => <p style={{ padding: 16, fontSize: 12 }}>Loading 3D…</p>,
});

type W = {
  serif: boolean;
  scale: number;
  tracking: number;
  space: number;
  cols: number;
  radius: number;
  motion: number;
  gray: boolean;
  btn: "solid" | "line" | "text";
  nav: "top" | "side" | "none";
};

const fallback: W = { serif: true, scale: 1, tracking: -0.04, space: 1, cols: 2, radius: 0, motion: 400, gray: true, btn: "line", nav: "top" };

export default function LabPage() {
  const [w, setW] = useState<W>(fallback);
  // Hydrate persisted workshop after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setW(loadJson(WORKSHOP_KEY, fallback));
  }, []);
  useEffect(() => {
    saveJson(WORKSHOP_KEY, w);
  }, [w]);

  return (
    <div className="studio-page">
      <p className="kicker">Lab · workshop</p>
      <h1 className="display">Change one decision. Watch the room change.</h1>
      <div className="workshop-grid" style={{ marginTop: 28 }}>
        <aside className="panel">
          <label className="field"><span>Serif display</span>
            <input type="checkbox" checked={w.serif} onChange={(e) => setW({ ...w, serif: e.target.checked })} />
          </label>
          <label className="field"><span>Type scale {w.scale.toFixed(2)}</span>
            <input type="range" min={0.7} max={1.4} step={0.02} value={w.scale} onChange={(e) => setW({ ...w, scale: Number(e.target.value) })} />
          </label>
          <label className="field"><span>Tracking {w.tracking}</span>
            <input type="range" min={-0.08} max={0.12} step={0.01} value={w.tracking} onChange={(e) => setW({ ...w, tracking: Number(e.target.value) })} />
          </label>
          <label className="field"><span>Spacing {w.space.toFixed(2)}</span>
            <input type="range" min={0.6} max={1.6} step={0.05} value={w.space} onChange={(e) => setW({ ...w, space: Number(e.target.value) })} />
          </label>
          <label className="field"><span>Grid {w.cols}</span>
            <input type="range" min={1} max={4} value={w.cols} onChange={(e) => setW({ ...w, cols: Number(e.target.value) })} />
          </label>
          <label className="field"><span>Radius {w.radius}</span>
            <input type="range" min={0} max={28} value={w.radius} onChange={(e) => setW({ ...w, radius: Number(e.target.value) })} />
          </label>
          <label className="field"><span>Motion {w.motion}ms</span>
            <input type="range" min={0} max={900} step={20} value={w.motion} onChange={(e) => setW({ ...w, motion: Number(e.target.value) })} />
          </label>
          <label className="field"><span>Image grayscale</span>
            <input type="checkbox" checked={w.gray} onChange={(e) => setW({ ...w, gray: e.target.checked })} />
          </label>
          <label className="field"><span>Button</span>
            <select value={w.btn} onChange={(e) => setW({ ...w, btn: e.target.value as W["btn"] })}>
              <option value="solid">Solid</option>
              <option value="line">Line</option>
              <option value="text">Text</option>
            </select>
          </label>
          <label className="field"><span>Navigation</span>
            <select value={w.nav} onChange={(e) => setW({ ...w, nav: e.target.value as W["nav"] })}>
              <option value="top">Top</option>
              <option value="side">Side</option>
              <option value="none">Almost none</option>
            </select>
          </label>
        </aside>
        <div
          className="preview-site"
          style={{
            padding: 24 * w.space,
            fontFamily: w.serif ? "var(--font-serif)" : "var(--font-sans)",
            transition: `all ${w.motion}ms ease`,
            display: w.nav === "side" ? "grid" : "block",
            gridTemplateColumns: w.nav === "side" ? "140px 1fr" : undefined,
          }}
        >
          {w.nav !== "none" ? (
            <div style={{ display: "flex", flexDirection: w.nav === "side" ? "column" : "row", gap: 12, marginBottom: 16, letterSpacing: "0.16em", fontSize: 11, textTransform: "uppercase" }}>
              <span>House</span><span>Work</span><span>Index</span>
            </div>
          ) : (
            <div className="kicker">A mark, nothing else</div>
          )}
          <div>
            <h2 style={{ fontSize: `${3.2 * w.scale}rem`, letterSpacing: `${w.tracking}em`, lineHeight: 0.9, margin: 0 }}>
              The room after the decision.
            </h2>
            <p style={{ maxWidth: "36ch", marginTop: 16 * w.space }}>
              Hierarchy is not a style. It is what you chose to make large.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${w.cols}, 1fr)`, gap: 12 * w.space, marginTop: 20 }}>
              {[1, 2, 3, 4].slice(0, Math.max(w.cols, 2)).map((n) => (
                <div key={n} style={{ border: "1px solid var(--line)", borderRadius: w.radius, overflow: "hidden" }}>
                  <div style={{ height: 80, background: "#222", filter: w.gray ? "grayscale(1)" : "none" }} />
                  <div style={{ padding: 10 }}>Object {n}</div>
                </div>
              ))}
            </div>
            <button
              type="button"
              style={{
                marginTop: 20,
                border: w.btn === "text" ? "0" : "1px solid var(--fg)",
                background: w.btn === "solid" ? "var(--fg)" : "transparent",
                color: w.btn === "solid" ? "var(--bg)" : "var(--fg)",
                padding: w.btn === "text" ? 0 : "10px 16px",
                borderRadius: w.radius,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontSize: 11,
              }}
            >
              A button with a job
            </button>
          </div>
        </div>
      </div>
      <hr className="rule" style={{ marginTop: 40 }} />
      <p className="kicker" style={{ marginTop: 32 }}>Experiments — raw, playable, unfinished on purpose</p>
      <LiquidType />
      <Boids />
      <PosterGen />
      <ShaderPlay />
      <RoomGen />
      <Fountain />
      <Drone />
      <Terrain />
      <Room3D />
      <Radial />
      <Chain />
      <TypeLab />
      <NervousType />
      <GravityWords />
      <Hum />
    </div>
  );
}

/** Decision: pick a decision, move the slider, watch the room change. */
function Decision() {
  const [d, setD] = useState("scale");
  const [v, setV] = useState(50);
  const st = { scale: { fontSize: `${1.1 + v * 0.05}rem` }, weight: { fontWeight: 100 + v * 8 }, contrast: { color: `hsl(0 0% ${70 - v * 0.7}%)` }, space: {} } as Record<string, CSSProperties>;
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">01 · Change one decision — pick, slide, watch the room change</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }} role="radiogroup" aria-label="Decision">
        {[["scale", "Size"], ["weight", "Weight"], ["contrast", "Contrast"], ["space", "Space"]].map(([k, l]) => (
          <button key={k} role="radio" aria-checked={d === k} onClick={() => setD(k)} style={{ border: "1px solid var(--fg)", background: d === k ? "var(--fg)" : "transparent", color: d === k ? "var(--bg)" : "var(--fg)", padding: "6px 12px", fontSize: 12 }}>
            {l}
          </button>
        ))}
      </div>
      <label style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 12, marginTop: 12 }}>
        Decision {v}
        <input type="range" min={0} max={100} step={1} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Decision" style={{ flex: 1 }} />
      </label>
      <div style={{ marginTop: 12, background: "#efe9dc", color: "#1a1712", padding: 20, paddingBlock: d === "space" ? 8 + v * 0.5 : 20 }} aria-live="polite">
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em" }}>House · Work · Index</p>
        <p style={{ fontSize: "1.6rem", fontWeight: 700, lineHeight: "tight", margin: "12px 0 0", ...st[d] }}>The room after the decision.</p>
        <p style={{ fontSize: "0.9rem", marginTop: d === "space" ? v * 0.3 : 8 }}>Hierarchy is not a style. It is what you chose to make large.</p>
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <span style={{ background: "#1a1712", padding: 8, fontSize: 12, color: "#fff", marginRight: d === "space" ? v * 0.4 : 0 }}>Object 1</span>
          <span style={{ border: "1px solid #1a1712", padding: 8, fontSize: 12 }}>Object 2</span>
        </div>
      </div>
    </section>
  );
}

/** Liquid type: the word rendered offscreen, redrawn as slices bent toward the pointer. */
function LiquidType() {
  const [p, setP] = useState({ f: 0.012, s: 20 });
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)", marginTop: 24 }}>
      <p className="kicker">02 · Liquid typography — move the pointer across the word</p>
      <div
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setP({ f: 0.004 + ((e.clientX - r.left) / r.width) * 0.03, s: 6 + ((e.clientY - r.top) / r.height) * 50 });
        }}
        style={{ display: "flex", height: 176, alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#000", border: "1px solid var(--line)", marginTop: 12, touchAction: "none" }}
      >
        <svg viewBox="0 0 400 140" style={{ width: "100%" }} role="img" aria-label="Liquid typography: the word LIQUID distorted by pointer position">
          <defs>
            <filter id="liq">
              <feTurbulence type="fractalNoise" baseFrequency={`${p.f} ${p.f * 2}`} numOctaves="2" seed="3" />
              <feDisplacementMap in="SourceGraphic" scale={p.s} />
            </filter>
          </defs>
          <text x="200" y="100" textAnchor="middle" fontSize="92" fontWeight="900" fill="#ffd23f" filter="url(#liq)" fontFamily="'Space Grotesk Variable', sans-serif">LIQUID</text>
        </svg>
      </div>
    </section>
  );
}

/** Boids: sixty specks, three rules — separation, alignment, cohesion. No leader. */
function Boids() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    type B = { x: number; y: number; vx: number; vy: number };
    const flock: B[] = Array.from({ length: 60 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.004, vy: (Math.random() - 0.5) * 0.004,
    }));
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = 260);
    const paint = () => {
      const bg = getComputedStyle(document.body).getPropertyValue("--bg").trim() || "#000";
      const fg = getComputedStyle(document.body).getPropertyValue("--fg").trim() || "#fff";
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = fg;
      for (const b of flock) {
        ctx.fillRect(b.x * W, b.y * H, 2, 2);
      }
    };
    const step = () => {
      for (const b of flock) {
        let cx = 0, cy = 0, ax = 0, ay = 0, sx = 0, sy = 0, n = 0;
        for (const o of flock) {
          if (o === b) continue;
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 0.004) {
            n += 1;
            cx += o.x; cy += o.y; ax += o.vx; ay += o.vy;
            if (d2 < 0.0004 && d2 > 0) { sx -= dx / d2; sy -= dy / d2; }
          }
        }
        if (n) {
          b.vx += ((cx / n - b.x) * 0.4 + (ax / n - b.vx) * 0.08 + sx * 0.00002);
          b.vy += ((cy / n - b.y) * 0.4 + (ay / n - b.vy) * 0.08 + sy * 0.00002);
        }
        const sp = Math.hypot(b.vx, b.vy) || 1;
        const max = 0.004;
        if (sp > max) { b.vx = (b.vx / sp) * max; b.vy = (b.vy / sp) * max; }
        b.x = (b.x + b.vx + 1) % 1;
        b.y = (b.y + b.vy + 1) % 1;
      }
    };
    if (reduced) {
      for (let i = 0; i < 200; i++) step();
      paint();
      return;
    }
    let raf = 0;
    const loop = () => {
      step();
      paint();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">03 · Boids — sixty specks, three rules, no leader</p>
      <canvas ref={ref} style={{ width: "100%", height: 260, display: "block", border: "1px solid var(--line)", marginTop: 12 }} aria-label="Flocking specks following separation, alignment and cohesion" />
      <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Separation, alignment, cohesion. The flock is never computed — only the three rules are.</p>
    </section>
  );
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Poster generator: seeded shapes + a word. Same seed, same poster — always. */
type PlateKind = "dunes" | "peaks" | "sea" | "city" | "forest" | "ice" | "rings" | "grid" | "wave";
const PLATE_KINDS: PlateKind[] = ["dunes", "peaks", "sea", "city", "forest", "ice", "rings", "grid", "wave"];

/** Procedural imagery: every plate generated from a seed. */
function drawPlate(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number, kind: PlateKind, hue = 30) {
  const R = rng(seed * 9973 + 11);
  const hs = (hh: number, s: number, l: number, a = 1) => `hsla(${hh},${s}%,${l}%,${a})`;
  const sky = (top: string, bot: string, to = h) => {
    const g = ctx.createLinearGradient(0, 0, 0, to);
    g.addColorStop(0, top);
    g.addColorStop(1, bot);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  };
  const ridge = (base: number, amp: number, freq: number, col: string, jag = 0) => {
    const ph = R() * 10;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += jag ? 6 : 4) {
      const y = base + Math.sin(x * freq + ph) * amp + Math.sin(x * freq * 2.3 + ph * 2) * amp * 0.4 + (jag ? (R() - 0.5) * jag : 0);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();
  };
  if (kind === "dunes") {
    sky(hs(hue, 55, 72), hs(hue + 15, 70, 88));
    ctx.fillStyle = hs(hue, 90, 92, 0.9);
    ctx.beginPath();
    ctx.arc(w * (0.2 + R() * 0.6), h * 0.28, w * 0.07, 0, 7);
    ctx.fill();
    for (let i = 0; i < 6; i++) ridge(h * (0.45 + i * 0.1), 18 + i * 6, 0.006 + i * 0.002, hs(hue - i * 3, 50, 62 - i * 9));
  } else if (kind === "peaks") {
    sky(hs(hue, 30, 60), hs(hue, 30, 90));
    for (let i = 0; i < 5; i++) {
      ridge(h * (0.4 + i * 0.12), 40 - i * 4, 0.004 + i * 0.001, hs(hue + 190, 25, 70 - i * 13), 30 - i * 4);
      const g = ctx.createLinearGradient(0, h * (0.45 + i * 0.12), 0, h * (0.6 + i * 0.12));
      g.addColorStop(0, hs(hue, 20, 92, 0));
      g.addColorStop(1, hs(hue, 20, 92, 0.55));
      ctx.fillStyle = g;
      ctx.fillRect(0, h * (0.45 + i * 0.12), w, h * 0.2);
    }
  } else if (kind === "sea") {
    const hz = h * (0.5 + R() * 0.12);
    sky(hs(hue + 200, 40, 30), hs(hue, 80, 78), hz);
    ctx.fillStyle = hs(hue + 200, 40, 30);
    ctx.fillRect(0, 0, w, hz * 0.02);
    const g = ctx.createLinearGradient(0, hz, 0, h);
    g.addColorStop(0, hs(hue + 10, 60, 60));
    g.addColorStop(1, hs(hue + 210, 50, 12));
    ctx.fillStyle = g;
    ctx.fillRect(0, hz, w, h - hz);
    ctx.fillStyle = hs(hue, 95, 90, 0.9);
    ctx.beginPath();
    ctx.arc(w * 0.5, hz - 4, w * 0.06, Math.PI, 0);
    ctx.fill();
    for (let y = hz + 4; y < h; y += 5 + (y - hz) * 0.06) {
      ctx.fillStyle = hs(hue, 90, 85, Math.max(0, 0.5 - (y - hz) / h));
      const ww = w * 0.12 * R() + 10;
      ctx.fillRect(w * 0.5 - ww / 2 + (R() - 0.5) * 30, y, ww, 1.5);
    }
  } else if (kind === "city") {
    sky(hs(hue + 220, 50, 8), hs(hue + 280, 50, 24));
    for (let l = 0; l < 3; l++) {
      let x = -10;
      while (x < w) {
        const bw = 20 + R() * 50;
        const bh = h * (0.15 + R() * 0.4) * (1 - l * 0.2);
        ctx.fillStyle = hs(hue + 230, 30, 6 + l * 6);
        ctx.fillRect(x, h - bh - l * 30, bw, bh + l * 30);
        if (l < 2)
          for (let wy = h - bh - l * 30 + 8; wy < h - 8; wy += 10)
            for (let wx = x + 4; wx < x + bw - 4; wx += 8) if (R() > 0.72) { ctx.fillStyle = hs(hue + 10, 90, 70, 0.85); ctx.fillRect(wx, wy, 3, 4); }
        x += bw + R() * 4;
      }
    }
  } else if (kind === "forest") {
    sky(hs(hue + 100, 20, 70), hs(hue + 90, 20, 92));
    for (let l = 0; l < 4; l++) {
      ctx.fillStyle = hs(hue + 110, 30 - l * 4, 62 - l * 15);
      for (let x = -20; x < w + 20; x += 14 + R() * 12) {
        const th = h * (0.3 + R() * 0.25) * (1 + l * 0.12);
        const by = h * (0.62 + l * 0.11);
        ctx.beginPath();
        ctx.moveTo(x, by - th);
        ctx.lineTo(x - 14 - l * 3, by);
        ctx.lineTo(x + 14 - l * 3, by);
        ctx.fill();
      }
      const g = ctx.createLinearGradient(0, h * (0.5 + l * 0.1), 0, h * (0.75 + l * 0.1));
      g.addColorStop(0, hs(hue + 90, 20, 92, 0));
      g.addColorStop(1, hs(hue + 90, 20, 92, 0.5));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  } else if (kind === "ice") {
    sky(hs(hue + 190, 40, 88), hs(hue + 200, 50, 62));
    for (let i = 0; i < 14; i++) {
      const x = R() * w, y = h * (0.35 + R() * 0.6), s = 30 + R() * 130;
      ctx.fillStyle = hs(hue + 190 + R() * 20, 40, 50 + R() * 45, 0.9);
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.lineTo(x + s * 0.5, y);
      ctx.lineTo(x - s * 0.4, y + s * 0.2);
      ctx.fill();
    }
  } else if (kind === "rings") {
    sky(hs(hue, 60, 8), hs(hue + 30, 60, 18));
    const cx = w * (0.35 + R() * 0.3), cy = h * (0.35 + R() * 0.3);
    for (let i = 26; i > 0; i--) {
      ctx.strokeStyle = hs(hue + i * 6, 90, 35 + i * 2);
      ctx.lineWidth = 1 + i * 0.25;
      ctx.beginPath();
      ctx.arc(cx + i * R() * 1.5, cy + i * R() * 1.5, i * (w / 36), 0, 7);
      ctx.stroke();
    }
  } else if (kind === "grid") {
    ctx.fillStyle = hs(hue, 10, 94);
    ctx.fillRect(0, 0, w, h);
    const n = 14;
    for (let i = 0; i <= n; i++) {
      ctx.strokeStyle = hs(hue, 80, 20);
      ctx.lineWidth = 1 + R() * 2;
      ctx.beginPath();
      for (let j = 0; j <= 60; j++) {
        const t = j / 60;
        const x = (i / n) * w + Math.sin(t * 6 + seed) * 30 * Math.sin(i + seed);
        if (j) ctx.lineTo(x, t * h);
        else ctx.moveTo(x, 0);
      }
      ctx.stroke();
    }
    ctx.fillStyle = hs(hue + 160, 90, 50);
    ctx.fillRect(w * 0.1, h * 0.72, w * 0.8, h * 0.08);
  } else {
    sky(hs(hue, 70, 12), hs(hue + 60, 80, 30));
    for (let i = 0; i < 40; i++) {
      ctx.strokeStyle = hs(hue + i * 4, 90, 60, 0.8);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const y = h * 0.5 + (i - 20) * 9 + Math.sin(x * 0.02 + i * 0.3 + seed) * (30 + i) * Math.sin(x * 0.004 + seed);
        if (x) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
  }
  const n = Math.floor((w * h) / 30);
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = R() > 0.5 ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.06)";
    ctx.fillRect(R() * w, R() * h, 1.5, 1.5);
  }
}

function PosterGen() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [seed, setSeed] = useState(3);
  const [word, setWord] = useState("WASP");
  const [kind, setKind] = useState<PlateKind>("rings");
  const [hue, setHue] = useState(30);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = 240);
    drawPlate(ctx, W, H, seed, kind, hue);
    const w = (word || "WASP").toUpperCase().slice(0, 12);
    const size = Math.min(W / (w.length * 0.62), H * 0.5);
    ctx.font = `900 ${size}px sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(w, W / 2, H / 2);
    ctx.font = "600 10px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`SEED ${seed} · ${kind.toUpperCase()}`, 12, H - 14);
  }, [seed, word, kind, hue]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
      if (e.code === "Space") {
        e.preventDefault();
        setSeed((s) => s + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">04 · Generative poster — nine kinds, spacebar rerolls</p>
      <canvas ref={ref} style={{ width: "100%", height: 240, display: "block", border: "1px solid var(--line)", marginTop: 12 }} aria-label="Generated poster" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12, alignItems: "center" }}>
        {PLATE_KINDS.map((k) => (
          <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={kind === k} style={{ border: "1px solid var(--line)", background: kind === k ? "var(--fg)" : "transparent", color: kind === k ? "var(--bg)" : "var(--fg)", padding: "6px 12px", fontSize: 11 }}>
            {k}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12, alignItems: "center" }}>
        <button type="button" onClick={() => setSeed((s) => s + 1)} style={{ border: "1px solid var(--fg)", background: "transparent", color: "var(--fg)", padding: "8px 16px", fontSize: 12 }}>
          New poster ({seed})
        </button>
        <button
          type="button"
          onClick={() => {
            const c = ref.current;
            if (!c) return;
            c.toBlob((b) => {
              if (!b) return;
              const u = URL.createObjectURL(b);
              const a = document.createElement("a");
              a.href = u;
              a.download = `wasp-poster-${seed}.png`;
              a.click();
              URL.revokeObjectURL(u);
            });
          }}
          style={{ border: "1px solid var(--line)", background: "transparent", color: "var(--fg)", padding: "8px 16px", fontSize: 12 }}
        >
          Download PNG
        </button>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12 }}>
          Word
          <input value={word} maxLength={12} onChange={(e) => setWord(e.target.value)} aria-label="Poster word" style={{ border: "1px solid var(--line)", background: "transparent", color: "var(--fg)", padding: "8px 12px" }} />
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12 }}>
          Hue {hue}
          <input type="range" min={0} max={360} value={hue} onChange={(e) => setHue(Number(e.target.value))} aria-label="Hue" />
        </label>
        <span style={{ fontSize: 11, color: "var(--muted)" }}>Spacebar rerolls (outside inputs).</span>
      </div>
    </section>
  );
}

const FRAG = `precision mediump float;
uniform vec2 u_res; uniform float u_time; uniform float u_freq; uniform float u_speed; uniform float u_hue; uniform float u_warp;
vec3 pal(float x){return .5+.5*cos(6.283*(x+vec3(u_hue,u_hue+.33,u_hue+.66)));}
void main(){
  vec2 p=(gl_FragCoord.xy*2.-u_res)/u_res.y;
  float a=0.;
  for(float i=1.;i<5.;i++){p+=u_warp*sin(p.yx*u_freq*.3*i+u_time*u_speed*.5*i)/i;a+=length(p);}
  gl_FragColor=vec4(pal(a*.25+u_time*.05),1.);
}`;

/** Shader playground: live GLSL, four uniforms under your control. */
function ShaderPlay() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const uni = useRef({ f: 4, s: 1, h: 0.6, w: 0.5 });
  const [v, setV] = useState({ f: 4, s: 1, h: 0.6, w: 0.5 });
  const [ok, setOk] = useState(true);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) {
      queueMicrotask(() => setOk(false));
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vs || !fs) {
      queueMicrotask(() => setOk(false));
      return;
    }
    gl.shaderSource(vs, "attribute vec2 a; void main(){gl_Position=vec4(a,0.,1.);}");
    gl.compileShader(vs);
    gl.shaderSource(fs, FRAG);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      queueMicrotask(() => setOk(false));
      return;
    }
    const pr = gl.createProgram();
    if (!pr) {
      queueMicrotask(() => setOk(false));
      return;
    }
    gl.attachShader(pr, vs);
    gl.attachShader(pr, fs);
    gl.linkProgram(pr);
    gl.useProgram(pr);
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(pr, "u_res");
    const uTime = gl.getUniformLocation(pr, "u_time");
    const uFreq = gl.getUniformLocation(pr, "u_freq");
    const uSpeed = gl.getUniformLocation(pr, "u_speed");
    const uHue = gl.getUniformLocation(pr, "u_hue");
    const uWarp = gl.getUniformLocation(pr, "u_warp");
    let raf = 0;
    const t0 = performance.now();
    const paint = (t: number) => {
      canvas.width = canvas.offsetWidth;
      canvas.height = 240;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uFreq, uni.current.f);
      gl.uniform1f(uSpeed, uni.current.s);
      gl.uniform1f(uHue, uni.current.h);
      gl.uniform1f(uWarp, uni.current.w);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    if (reduced) {
      paint(1.5);
      return;
    }
    const loop = () => {
      paint((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">05 · Shader playground — a live fragment shader, four uniforms</p>
      {ok ? (
        <canvas ref={ref} style={{ width: "100%", height: 240, display: "block", border: "1px solid var(--line)", marginTop: 12 }} aria-label="Live GLSL shader with adjustable uniforms" />
      ) : (
        <p style={{ border: "1px solid var(--line)", padding: 20, marginTop: 12 }}>WebGL unavailable here — the canvas experiments above still run.</p>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px 16px", marginTop: 12 }}>
        {([
          ["Frequency", "f", v.f, 1, 12, 0.5],
          ["Speed", "s", v.s, 0, 4, 0.1],
          ["Hue", "h", v.h, 0, 1, 0.02],
          ["Warp", "w", v.w, 0, 1.2, 0.05],
        ] as const).map(([label, k, val, min, max, step]) => (
          <label key={k} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12 }}>
            {label} {typeof val === "number" ? val.toFixed(2) : val}
            <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => { const n = Number(e.target.value); uni.current[k] = n; setV({ ...v, [k]: n }); }} aria-label={label} style={{ flex: 1 }} />
          </label>
        ))}
      </div>
    </section>
  );
}

/** Room generator: seeded packing lays out rooms left to right, wrapping at the plot edge. */
function RoomGen() {
  const [seed, setSeed] = useState(4);
  const [rooms, setRooms] = useState(6);
  const r = rng(seed * 4211);
  const cells: { x: number; y: number; w: number; h: number }[] = [];
  let x = 0;
  let y = 0;
  for (let i = 0; i < rooms; i++) {
    const w = 60 + Math.floor(r() * 110);
    const h = 50 + Math.floor(r() * 90);
    if (x + w > 420) {
      x = 0;
      y += 100;
    }
    cells.push({ x, y, w, h });
    x += w;
  }
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">06 · Room generator — change one decision, the room changes</p>
      <svg viewBox="-10 -10 460 300" style={{ width: "100%", border: "1px solid var(--line)", marginTop: 12, background: "var(--bg)" }} role="img" aria-label={`Generated plan with ${rooms} rooms`}>
        {cells.map((c, i) => (
          <g key={i}>
            <rect x={c.x} y={c.y} width={c.w} height={c.h} fill={i % 3 === 0 ? "rgba(232,184,109,0.12)" : "transparent"} stroke="var(--fg)" strokeOpacity={0.4} />
            <text x={c.x + 6} y={c.y + 16} fontSize={9} fontFamily="monospace" fill="var(--muted)">
              R{String(i + 1).padStart(2, "0")} · {Math.floor((c.w * c.h) / 100)}m²
            </text>
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12, alignItems: "center" }}>
        <button type="button" onClick={() => setSeed((s) => s + 1)} style={{ border: "1px solid var(--fg)", background: "transparent", color: "var(--fg)", padding: "8px 16px", fontSize: 12 }}>
          New plan ({seed})
        </button>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, flex: 1, minWidth: 200 }}>
          Rooms {rooms}
          <input type="range" min={3} max={12} value={rooms} onChange={(e) => setRooms(Number(e.target.value))} aria-label="Rooms" style={{ flex: 1 }} />
        </label>
      </div>
    </section>
  );
}

/** Fountain: click or tap to emit. Gravity is a slider, including upside down. */
function Fountain() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [g, setG] = useState(300);
  const gr = useRef(g);
  useEffect(() => {
    gr.current = g;
  }, [g]);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let ps: { x: number; y: number; vx: number; vy: number; l: number }[] = [];
    let src = { x: 200, y: 160 };
    const em = (px: number, py: number) => {
      src = { x: px, y: py };
      for (let i = 0; i < 40; i++) ps.push({ x: px, y: py, vx: (Math.random() - 0.5) * 200, vy: -150 - Math.random() * 250, l: 2 });
    };
    if (reduced) {
      em(200, 150);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffd23f";
      for (const p of ps) ctx.fillRect(p.x, p.y, 3, 3);
      return;
    }
    const dn = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      em(((e.clientX - r.left) / r.width) * canvas.width, ((e.clientY - r.top) / r.height) * canvas.height);
    };
    canvas.addEventListener("pointerdown", dn);
    const f = (n: number) => {
      void src;
      const dt = Math.min(0.05, (n - last) / 1000);
      last = n;
      ctx.fillStyle = "rgba(0,0,0,.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (const p of ps) {
        p.vy += gr.current * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.l -= dt;
        if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -0.5; }
        ctx.fillStyle = `rgba(255,210,63,${Math.max(0, p.l / 2)})`;
        ctx.fillRect(p.x, p.y, 3, 3);
      }
      ps = ps.filter((p) => p.l > 0);
      raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", dn);
    };
  }, []);
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">07 · Particle system — click to emit, gravity goes negative</p>
      <canvas ref={ref} width={400} height={176} style={{ width: "100%", height: 176, display: "block", border: "1px solid var(--line)", marginTop: 12, touchAction: "none", cursor: "crosshair", background: "#000" }} aria-label="Particle fountain: click or tap to emit" />
      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, marginTop: 12 }}>
        Gravity {g}
        <input type="range" min={-300} max={900} step={10} value={g} onChange={(e) => setG(Number(e.target.value))} aria-label="Gravity" style={{ flex: 1 }} />
      </label>
      <p style={{ fontSize: 11, color: "var(--muted)" }}>Click or tap the canvas to emit.</p>
    </section>
  );
}

/** Drone: three oscillators through a filter into an analyser. Sound starts only on press. */
function Drone() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const ac = useRef<{ ctx: AudioContext; o: OscillatorNode[]; an: AnalyserNode } | null>(null);
  const [on, setOn] = useState(false);
  const [f, setF] = useState(110);
  async function toggle() {
    if (on) {
      ac.current?.o.forEach((o) => { try { o.stop(); } catch { /* already stopped */ } });
      try { await ac.current?.ctx.close(); } catch { /* already closed */ }
      ac.current = null;
      setOn(false);
      return;
    }
    const Ctx = window.AudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const g = ctx.createGain();
    const an = ctx.createAnalyser();
    g.gain.value = 0.12;
    an.fftSize = 128;
    g.connect(an);
    an.connect(ctx.destination);
    const o = [1, 1.5, 2.01].map((m) => {
      const x = ctx.createOscillator();
      x.type = "sawtooth";
      x.frequency.value = f * m;
      const fl = ctx.createBiquadFilter();
      fl.frequency.value = 600;
      x.connect(fl);
      fl.connect(g);
      x.start();
      return x;
    });
    ac.current = { ctx, o, an };
    setOn(true);
  }
  useEffect(() => {
    ac.current?.o.forEach((o, i) => { o.frequency.value = f * [1, 1.5, 2.01][i]; });
  }, [f]);
  useEffect(() => {
    if (!on) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !ac.current) return;
    const an = ac.current.an;
    const b = new Uint8Array(an.frequencyBinCount);
    let raf = 0;
    const fg = getComputedStyle(document.body).getPropertyValue("--fg").trim() || "#fff";
    const draw = () => {
      an.getByteFrequencyData(b);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = fg;
      b.forEach((v, i) => {
        ctx.fillRect(i * 6.2, canvas.height - v * 0.65, 5, v * 0.65);
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [on]);
  useEffect(() => () => {
    ac.current?.o.forEach((o) => { try { o.stop(); } catch { /* already stopped */ } });
    ac.current?.ctx.close().catch(() => {});
  }, []);
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">08 · Audio visualiser — three oscillators, no samples</p>
      <canvas ref={ref} width={400} height={120} style={{ width: "100%", height: 120, display: "block", border: "1px solid var(--line)", marginTop: 12 }} role="img" aria-label={on ? "Live audio spectrum" : "Audio visualiser, silent"} />
      <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
        <button type="button" onClick={toggle} style={{ border: "1px solid var(--fg)", background: on ? "var(--fg)" : "transparent", color: on ? "var(--bg)" : "var(--fg)", padding: "10px 18px", fontSize: 12, fontWeight: 700 }}>
          {on ? "■ Stop" : "▶ Start drone"}
        </button>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, flex: 1 }}>
          Pitch {f}Hz
          <input type="range" min={55} max={220} value={f} onChange={(e) => setF(Number(e.target.value))} aria-label="Pitch" style={{ flex: 1 }} />
        </label>
      </div>
      <p style={{ fontSize: 11, color: "var(--muted)" }}>Sound starts only when you press the button.</p>
    </section>
  );
}

/** Terrain: ridge lines from summed sine octaves. Every seed a landscape; same seed, same land. */
function Terrain() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [s, setS] = useState({ seed: 7, amp: 40, oct: 3 });
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = (canvas.width = 400);
    const H = (canvas.height = 176);
    const h = (i: number, j: number) => {
      let v = 0;
      for (let o = 0; o < s.oct; o++) {
        const f = 2 ** o;
        v += (Math.sin(i * 0.11 * f + s.seed * 1.7 + o) * Math.cos(j * 0.17 * f + s.seed * 0.9)) / f;
      }
      return v;
    };
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, W, H);
    for (let j = 0; j < 40; j++) {
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const X = 20 + i * 4.75;
        const Y = 40 + j * 3.5 - h(i, j) * s.amp * Math.sin((i / 80) * Math.PI);
        if (i) ctx.lineTo(X, Y);
        else ctx.moveTo(X, Y);
      }
      ctx.lineTo(400, 176);
      ctx.lineTo(0, 176);
      ctx.closePath();
      ctx.fillStyle = "#0a0a0a";
      ctx.fill();
      ctx.strokeStyle = `rgba(255,210,63,${0.25 + j / 55})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }, [s]);
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">09 · Procedural terrain — ridge lines from summed sine octaves</p>
      <canvas ref={ref} style={{ width: "100%", height: 176, display: "block", border: "1px solid var(--line)", marginTop: 12, background: "#000" }} aria-label="Procedural terrain drawn as ridge lines" />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12, alignItems: "center" }}>
        <button type="button" onClick={() => setS({ ...s, seed: s.seed + 1 })} style={{ border: "1px solid var(--fg)", background: "transparent", color: "var(--fg)", padding: "8px 16px", fontSize: 12 }}>
          New terrain ({s.seed})
        </button>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, flex: 1, minWidth: 160 }}>
          Height {s.amp}
          <input type="range" min={5} max={90} value={s.amp} onChange={(e) => setS({ ...s, amp: Number(e.target.value) })} aria-label="Height" style={{ flex: 1 }} />
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, flex: 1, minWidth: 160 }}>
          Detail {s.oct}
          <input type="range" min={1} max={5} value={s.oct} onChange={(e) => setS({ ...s, oct: Number(e.target.value) })} aria-label="Detail" style={{ flex: 1 }} />
        </label>
      </div>
    </section>
  );
}

/** 3D room: seeded raw-three.js box room. Drag to orbit, scroll to zoom. */
/** 3D room generator: dimensions rebuild a real WebGL room with contents. */
function Room3D() {
  const [r, setR] = useState({ w: 8, d: 6, h: 3, items: 8, seed: 3 });
  const [wall, setWall] = useState("#c9b8a0");
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">10 · 3D room generator — real WebGL, change the dimensions</p>
      <div style={{ height: 260, border: "1px solid var(--line)", marginTop: 12 }}>
        <Lab3D {...r} wall={wall} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginTop: 12 }}>
        {(["w", "d", "h", "items"] as const).map((k) => (
          <label key={k} style={{ fontSize: 12 }}>
            {k.toUpperCase()} {r[k]}
            <input
              type="range"
              min={k === "items" ? 0 : k === "h" ? 2 : 4}
              max={k === "items" ? 20 : k === "h" ? 5 : 14}
              step={k === "h" ? 0.5 : 1}
              value={r[k]}
              onChange={(e) => setR({ ...r, [k]: Number(e.target.value) })}
              aria-label={k}
              style={{ width: "100%" }}
            />
          </label>
        ))}
        <label style={{ fontSize: 12 }}>
          Wall
          <input type="color" value={wall} onChange={(e) => setWall(e.target.value)} aria-label="Wall color" style={{ display: "block", width: 60, height: 30 }} />
        </label>
      </div>
      <button type="button" onClick={() => setR({ ...r, seed: r.seed + 1 })} style={{ border: "1px solid var(--fg)", background: "transparent", color: "var(--fg)", padding: "8px 16px", fontSize: 12, marginTop: 12 }}>
        New layout ({r.seed})
      </button>
    </section>
  );
}

/** Radial nav: click anywhere, destinations fan out around the pointer. */
function Radial() {
  const [o, setO] = useState<{ x: number; y: number } | null>(null);
  const items: [string, string][] = [["Worlds", "/matrix"], ["Lab", "/lab"], ["Tools", "/tools"], ["Studio", "/studio"], ["OS", "/os"], ["Start", "/start"]];
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">11 · Experimental navigation — click anywhere, choose a door</p>
      <div
        style={{ position: "relative", height: 220, overflow: "hidden", border: "1px solid var(--line)", marginTop: 12, background: "var(--bg)" }}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("a")) return;
          const r = e.currentTarget.getBoundingClientRect();
          setO(o ? null : { x: e.clientX - r.left, y: e.clientY - r.top });
        }}
      >
        <p style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 12, color: "var(--muted)", margin: 0 }}>
          {o ? "Choose a destination" : "Click anywhere"}
        </p>
        {o && items.map(([l, h], i) => {
          const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
          return (
              <a
                key={l}
                href={h}
                style={{
                  position: "absolute",
                  width: 64, height: 64, borderRadius: "50%",
                  display: "grid", placeItems: "center",
                  background: "var(--fg)", color: "var(--bg)",
                  fontSize: 10, fontWeight: 700,
                  left: Math.max(34, Math.min(366, o.x + Math.cos(a) * 62)),
                  top: Math.max(34, Math.min(186, o.y + Math.sin(a) * 52)),
                  transform: "translate(-50%,-50%)",
                  animation: `wasp-in .3s ${i * 0.04}s both`,
                }}
              >
              {l}
            </a>
          );
        })}
        {o && <span style={{ position: "absolute", width: 10, height: 10, borderRadius: "50%", background: "var(--fg)", left: o.x, top: o.y, transform: "translate(-50%,-50%)" }} />}
      </div>
    </section>
  );
}

/** Physics chain: spring-damped links chasing the pointer. */
function Chain() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [stiff, setStiff] = useState(0.3);
  const [links, setLinks] = useState(14);
  const cfg = useRef({ stiff, links });
  useEffect(() => {
    cfg.current = { stiff, links };
  }, [stiff, links]);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const W = (canvas.width = 400);
    const H = (canvas.height = 176);
    const ptr = { x: 150, y: 80 };
    const seg: { x: number; y: number }[] = [];
    const paint = () => {
      const { stiff: k, links: n } = cfg.current;
      while (seg.length < n) seg.push({ x: 150, y: 80 });
      seg.length = n;
      ctx.fillStyle = "rgba(0,0,0,.25)";
      ctx.fillRect(0, 0, W, H);
      let tx = ptr.x;
      let ty = ptr.y;
      seg.forEach((s, i) => {
        s.x += (tx - s.x) * k;
        s.y += (ty - s.y) * k;
        tx = s.x;
        ty = s.y;
        ctx.fillStyle = `hsl(${48 - i * 3},100%,${62 - i * 2}%)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 14 - i * 0.8, 0, 7);
        ctx.fill();
      });
    };
    if (reduced) {
      paint();
      return;
    }
    let raf = 0;
    const mv = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      ptr.x = ((e.clientX - r.left) / r.width) * canvas.width;
      ptr.y = ((e.clientY - r.top) / r.height) * canvas.height;
    };
    canvas.addEventListener("pointermove", mv);
    const loop = () => {
      paint();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", mv);
    };
  }, []);
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">12 · Physics chain — each link chases the one before it</p>
      <canvas ref={ref} style={{ width: "100%", height: 176, display: "block", border: "1px solid var(--line)", marginTop: 12, touchAction: "none" }} aria-label="A chain of circles following the pointer with lag" />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, flex: 1, minWidth: 200 }}>
          Stiffness {stiff.toFixed(2)}
          <input type="range" min={0.04} max={0.5} step={0.01} value={stiff} onChange={(e) => setStiff(Number(e.target.value))} aria-label="Stiffness" style={{ flex: 1 }} />
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, flex: 1, minWidth: 200 }}>
          Links {links}
          <input type="range" min={3} max={30} value={links} onChange={(e) => setLinks(Number(e.target.value))} aria-label="Links" style={{ flex: 1 }} />
        </label>
      </div>
    </section>
  );
}

/** Variable type: weight follows the pointer, per letter. */
function TypeLab() {
  const [p, setP] = useState<{ x: number; y: number } | null>(null);
  const text = "VARIABLE";
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">13 · Interactive type — a variable font, weight follows distance</p>
      <div
        onPointerMove={(e) => setP({ x: e.clientX, y: e.clientY })}
        onPointerLeave={() => setP(null)}
        style={{ display: "flex", minHeight: 176, alignItems: "center", justifyContent: "center", border: "1px solid var(--line)", marginTop: 12, background: "#000", color: "#ffd23f", touchAction: "none", fontFamily: "'Space Grotesk Variable', sans-serif" }}
        role="img"
        aria-label="Interactive type: letters grow heavier near the pointer"
      >
        {text.split("").map((ch, i) => (
          <TypeLetter key={i} ch={ch} p={p} />
        ))}
      </div>
    </section>
  );
}

function TypeLetter({ ch, p }: { ch: string; p: { x: number; y: number } | null }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [w, setW] = useState(300);
  useEffect(() => {
    if (!p || !ref.current) {
      setW(300);
      return;
    }
    const b = ref.current.getBoundingClientRect();
    const d = Math.hypot(p.x - (b.left + b.width / 2), p.y - (b.top + b.height / 2));
    setW(300 + Math.max(0, 1 - d / 160) * 400);
  }, [p]);
  return (
    <span ref={ref} aria-hidden style={{ fontSize: "clamp(2rem, 7vw, 4rem)", lineHeight: 1, fontWeight: w, transition: "font-weight .12s" }}>
      {ch}
    </span>
  );
}

/** Nervous type: letters grow heavier near the pointer, and settle back. */
function NervousType() {
  const [p, setP] = useState<{ x: number; y: number } | null>(null);
  const word = "VARIABLE";
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">14 · Nervous type — weight follows your cursor</p>
      <div
        style={{ display: "flex", minHeight: 176, alignItems: "center", justifyContent: "center", border: "1px solid var(--line)", marginTop: 12, touchAction: "none", overflow: "hidden" }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setP({ x: e.clientX - r.left, y: e.clientY - r.top });
        }}
        onPointerLeave={() => setP(null)}
        role="img"
        aria-label="The word VARIABLE growing heavier near the pointer"
      >
        {word.split("").map((ch, i) => (
          <NervousLetter key={i} ch={ch} p={p} />
        ))}
      </div>
      <p style={{ fontSize: 11, color: "var(--muted)" }}>Same word, no font files — weight is interpolated per letter from pointer distance.</p>
    </section>
  );
}

function NervousLetter({ ch, p }: { ch: string; p: { x: number; y: number } | null }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [w, setW] = useState(400);
  useEffect(() => {
    if (!p || !ref.current) {
      setW(400);
      return;
    }
    const b = ref.current.getBoundingClientRect();
    const d = Math.hypot(p.x - (b.left + b.width / 2 - ref.current.offsetParent!.getBoundingClientRect().left), p.y - (b.top + b.height / 2 - (ref.current.offsetParent as HTMLElement).getBoundingClientRect().top));
    const f = Math.max(0, 1 - d / 220);
    setW(Math.round(400 + f * 500));
  }, [p]);
  return (
    <span ref={ref} aria-hidden style={{ fontSize: "clamp(2rem, 7vw, 4rem)", fontWeight: w, transition: "font-weight 0.12s", lineHeight: 1 }}>
      {ch}
    </span>
  );
}

/** Gravity words: words fall, pile up, and can be thrown. */
function GravityWords() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const words = useMemo(() => ["HEAVY", "LIGHT", "FALL", "THROW", "PILE", "HELD"], []);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = 220);
    type O = { w: string; x: number; y: number; vx: number; vy: number };
    const r = rng(99);
    const objs: O[] = words.map((w) => ({ w, x: r() * W, y: r() * -H * 0.5, vx: 0, vy: 0 }));
    const fg = getComputedStyle(document.body).getPropertyValue("--fg").trim() || "#fff";
    const bg = getComputedStyle(document.body).getPropertyValue("--bg").trim() || "#000";
    ctx.font = "800 28px sans-serif";
    const widthOf = (w: string) => ctx.measureText(w).width;
    let raf = 0;
    let grab: { o: O; dx: number; dy: number } | null = null;
    const pos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: ((e.clientX - rect.left) / rect.width) * W, y: ((e.clientY - rect.top) / rect.height) * H };
    };
    const down = (e: PointerEvent) => {
      const p = pos(e);
      const hit = [...objs].reverse().find((o) => p.x >= o.x && p.x <= o.x + widthOf(o.w) && p.y - 24 <= o.y && p.y >= o.y);
      if (hit) grab = { o: hit, dx: p.x - hit.x, dy: p.y - hit.y };
    };
    const mv = (e: PointerEvent) => {
      if (!grab) return;
      const p = pos(e);
      grab.o.vx = (p.x - grab.dx - grab.o.x) * 0.4;
      grab.o.vy = (p.y - grab.dy - grab.o.y) * 0.4;
      grab.o.x = p.x - grab.dx;
      grab.o.y = p.y - grab.dy;
    };
    const up = () => { grab = null; };
    const step = () => {
      for (const o of objs) {
        if (grab?.o !== o) {
          o.vy += 0.5;
          o.vx *= 0.99;
          o.vy *= 0.99;
          o.x += o.vx;
          o.y += o.vy;
          if (o.y > H - 8) { o.y = H - 8; o.vy *= -0.3; o.vx *= 0.8; }
          if (o.x < 0) { o.x = 0; o.vx *= -0.5; }
          if (o.x + widthOf(o.w) > W) { o.x = W - widthOf(o.w); o.vx *= -0.5; }
        }
      }
      // pile: later words rest on earlier ones
      for (let i = 0; i < objs.length; i++) {
        for (let j = 0; j < i; j++) {
          const a = objs[i];
          const b = objs[j];
          if (a.x < b.x + widthOf(b.w) && a.x + widthOf(a.w) > b.x && Math.abs(a.y - b.y) < 24 && a.vy > 0) {
            a.y = b.y - 24;
            a.vy = 0;
          }
        }
      }
    };
    const paint = () => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = fg;
      ctx.font = "800 28px sans-serif";
      for (const o of objs) ctx.fillText(o.w, o.x, o.y);
    };
    if (reduced) {
      for (let i = 0; i < 300; i++) step();
      paint();
      return;
    }
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
    const loop = () => {
      step();
      paint();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", mv);
      window.removeEventListener("pointerup", up);
    };
  }, [words]);
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">15 · Gravity words — they fall, pile up, and can be thrown</p>
      <canvas ref={ref} style={{ width: "100%", height: 220, display: "block", border: "1px solid var(--line)", marginTop: 12, touchAction: "none", cursor: "grab" }} aria-label="Words falling under gravity; drag to throw them" />
    </section>
  );
}

/** Hum: an oscillator you play with your cursor, drawn as it sounds. */
function Hum() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const ac = useRef<{ ctx: AudioContext; o: OscillatorNode; g: GainNode; an: AnalyserNode } | null>(null);
  const [on, setOn] = useState(false);
  const [freq, setFreq] = useState(220);
  const freqRef = useRef(freq);
  useEffect(() => {
    freqRef.current = freq;
  }, [freq]);
  useEffect(() => {
    if (!on) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !ac.current) return;
    const an = ac.current.an;
    const b = new Uint8Array(an.frequencyBinCount);
    let raf = 0;
    const fg = getComputedStyle(document.body).getPropertyValue("--fg").trim() || "#fff";
    const draw = () => {
      an.getByteFrequencyData(b);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = fg;
      const n = 48;
      for (let i = 0; i < n; i++) {
        const v = b[Math.floor((i / n) * b.length)] / 255;
        const h = v * canvas.height;
        ctx.fillRect(i * (canvas.width / n), canvas.height - h, canvas.width / n - 2, h);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [on]);
  useEffect(() => () => {
    ac.current?.o.stop();
    ac.current?.ctx.close().catch(() => {});
  }, []);
  async function toggle() {
    if (on) {
      ac.current?.o.stop();
      try { await ac.current?.ctx.close(); } catch { /* already closed */ }
      ac.current = null;
      setOn(false);
      setFreq(220);
      return;
    }
    const Ctx = window.AudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const an = ctx.createAnalyser();
    o.type = "sine";
    o.frequency.value = freqRef.current;
    g.gain.value = 0.15;
    an.fftSize = 256;
    o.connect(g);
    g.connect(an);
    an.connect(ctx.destination);
    o.start();
    ac.current = { ctx, o, g, an };
    setOn(true);
  }
  function play(e: React.PointerEvent) {
    if (!on || !ac.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const f = 80 + ((e.clientX - r.left) / r.width) * 600;
    ac.current.o.frequency.value = f;
    setFreq(Math.round(f));
  }
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">16 · Hum — move across it to play, watch it draw itself</p>
      <canvas
        ref={ref}
        width={400}
        height={120}
        style={{ width: "100%", height: 120, display: "block", border: "1px solid var(--line)", marginTop: 12, touchAction: "none" }}
        role="img"
        aria-label={on ? "Live spectrum of the hummed note" : "Silent spectrum. Start humming to play."}
        onPointerMove={play}
      />
      <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
        <button type="button" onClick={toggle} style={{ border: "1px solid var(--fg)", background: on ? "var(--fg)" : "transparent", color: on ? "var(--bg)" : "var(--fg)", padding: "10px 18px", fontSize: 12, fontWeight: 700 }}>
          {on ? "■ Stop humming" : "▶ Start humming"}
        </button>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>{on ? `${freq}Hz — move horizontally to bend it` : "Sound starts only on press."}</span>
      </div>
    </section>
  );
}
