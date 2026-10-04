"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { loadJson, saveJson, WORKSHOP_KEY } from "@/lib/storage";

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
      <NervousType />
      <GravityWords />
      <Hum />
    </div>
  );
}

/** Liquid type: the word rendered offscreen, redrawn as slices bent toward the pointer. */
function LiquidType() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [visc, setVisc] = useState(26);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0.5, y: 0.5 };
    let raf = 0;
    let t = 0;
    const off = document.createElement("canvas");
    const paint = () => {
      const W = (canvas.width = canvas.offsetWidth);
      const H = (canvas.height = 240);
      const o = off.getContext("2d");
      if (!o) return;
      off.width = W;
      off.height = H;
      const fg = getComputedStyle(document.body).getPropertyValue("--fg").trim() || "#fff";
      const bg = getComputedStyle(document.body).getPropertyValue("--bg").trim() || "#000";
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      o.fillStyle = fg;
      o.font = `800 ${Math.min(W / 5.5, 96)}px sans-serif`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillText("LIQUID", W / 2, H / 2);
      const slices = 48;
      for (let i = 0; i < slices; i++) {
        const sy = (i / slices) * H;
        const sh = H / slices + 1;
        const d = Math.abs(sy / H - mouse.y);
        const amp = visc * Math.exp(-d * 6);
        const dx = Math.sin(t * 2 + i * 0.25) * amp + (mouse.x - 0.5) * amp * 1.4;
        ctx.drawImage(off, 0, sy, W, sh, dx, sy, W, sh);
      }
    };
    const move = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
    };
    canvas.addEventListener("pointermove", move);
    if (reduced) {
      paint();
      return () => canvas.removeEventListener("pointermove", move);
    }
    const loop = () => {
      t += 0.016;
      paint();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", move);
    };
  }, [visc]);
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)", marginTop: 24 }}>
      <p className="kicker">01 · Liquid typography — move across it</p>
      <canvas ref={ref} style={{ width: "100%", height: 240, display: "block", border: "1px solid var(--line)", marginTop: 12 }} aria-label="The word LIQUID distorted toward your pointer" />
      <label style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12, fontSize: 12 }}>
        VISCOSITY {visc}
        <input type="range" min={4} max={60} value={visc} onChange={(e) => setVisc(Number(e.target.value))} aria-label="Viscosity" style={{ flex: 1 }} />
      </label>
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
      <p className="kicker">02 · Boids — sixty specks, three rules, no leader</p>
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
function PosterGen() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [seed, setSeed] = useState(3);
  const [word, setWord] = useState("WASP");
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = 240);
    const r = rng(seed * 1337);
    const pals = [
      ["#0b0b0c", "#ffe34d", "#ff4d2e"],
      ["#f3f1ec", "#0b0b0c", "#3fd6a0"],
      ["#1b1a17", "#e8ff3a", "#4f8cff"],
    ];
    const pal = pals[Math.floor(r() * pals.length)] ?? pals[0];
    ctx.fillStyle = pal[0];
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = r() > 0.5 ? pal[1] : pal[2];
      ctx.globalAlpha = 0.15 + r() * 0.5;
      if (r() > 0.5) ctx.fillRect(r() * W, r() * H, r() * W * 0.6, r() * 14 + 4);
      else {
        ctx.beginPath();
        ctx.arc(r() * W, r() * H, r() * 70 + 12, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    const w = (word || "WASP").toUpperCase().slice(0, 12);
    const size = Math.min(W / (w.length * 0.62), H * 0.5);
    ctx.font = `900 ${size}px sans-serif`;
    ctx.fillStyle = pal[1];
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(w, W / 2, H / 2);
    ctx.font = "600 10px monospace";
    ctx.fillStyle = pal[2];
    ctx.textAlign = "left";
    ctx.fillText(`SEED ${seed}`, 12, H - 14);
  }, [seed, word]);
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">03 · Generative poster — same seed, same poster</p>
      <canvas ref={ref} style={{ width: "100%", height: 240, display: "block", border: "1px solid var(--line)", marginTop: 12 }} aria-label="Generated poster" />
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
      </div>
    </section>
  );
}

const FRAG = `precision highp float;
uniform vec2 u_res; uniform float u_time; uniform float u_scale; uniform float u_warp;
void main(){
  vec2 p = (gl_FragCoord.xy - 0.5*u_res)/u_res.y * u_scale;
  float t = u_time*0.25;
  for(int i=0;i<4;i++){
    p += u_warp*0.35*vec2(sin(p.y*1.7+t), cos(p.x*1.5-t));
  }
  float v = 0.5+0.5*sin(p.x*2.0+p.y*1.3);
  vec3 col = mix(vec3(0.02,0.02,0.03), vec3(1.0,0.89,0.30), smoothstep(0.35,0.75,v));
  col = mix(col, vec3(0.1,0.5,0.9), smoothstep(0.8,1.0,v));
  gl_FragColor = vec4(col,1.0);
}`;

/** Shader playground: hand-written GLSL, scale + warp as live uniforms. */
function ShaderPlay() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const uni = useRef({ scale: 3, warp: 0.6 });
  const [scale, setScale] = useState(3);
  const [warp, setWarp] = useState(0.6);
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
    const uScale = gl.getUniformLocation(pr, "u_scale");
    const uWarp = gl.getUniformLocation(pr, "u_warp");
    let raf = 0;
    const t0 = performance.now();
    const paint = (t: number) => {
      canvas.width = canvas.offsetWidth;
      canvas.height = 240;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uScale, uni.current.scale);
      gl.uniform1f(uWarp, uni.current.warp);
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
      <p className="kicker">04 · Shader playground — four-iteration domain warp, live uniforms</p>
      {ok ? (
        <canvas ref={ref} style={{ width: "100%", height: 240, display: "block", border: "1px solid var(--line)", marginTop: 12 }} aria-label="GLSL domain-warp shader" />
      ) : (
        <p style={{ border: "1px solid var(--line)", padding: 20, marginTop: 12 }}>WebGL unavailable here — the canvas experiments above still run.</p>
      )}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, flex: 1, minWidth: 200 }}>
          Scale {scale.toFixed(1)}
          <input type="range" min={1} max={9} step={0.1} value={scale} onChange={(e) => { const v = Number(e.target.value); uni.current.scale = v; setScale(v); }} aria-label="Scale" style={{ flex: 1 }} />
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, flex: 1, minWidth: 200 }}>
          Warp {warp.toFixed(2)}
          <input type="range" min={0} max={1.6} step={0.02} value={warp} onChange={(e) => { const v = Number(e.target.value); uni.current.warp = v; setWarp(v); }} aria-label="Warp" style={{ flex: 1 }} />
        </label>
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
      <p className="kicker">05 · Room generator — change one decision, the room changes</p>
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
  const gRef = useRef(g);
  useEffect(() => {
    gRef.current = g;
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
    const fg = getComputedStyle(document.body).getPropertyValue("--fg").trim() || "#fff";
    const bg = getComputedStyle(document.body).getPropertyValue("--bg").trim() || "#000";
    const emit = (px: number, py: number) => {
      for (let i = 0; i < 40; i++) {
        ps.push({ x: px, y: py, vx: (Math.random() - 0.5) * 200, vy: -150 - Math.random() * 250, l: 2 });
      }
    };
    if (reduced) {
      emit(canvas.width / 2, canvas.height - 20);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = fg;
      for (const p of ps) ctx.fillRect(p.x, p.y, 3, 3);
      return;
    }
    const dn = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      emit(((e.clientX - r.left) / r.width) * canvas.width, ((e.clientY - r.top) / r.height) * canvas.height);
    };
    canvas.addEventListener("pointerdown", dn);
    const frame = (n: number) => {
      const dt = Math.min(0.05, (n - last) / 1000);
      last = n;
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (const p of ps) {
        p.vy += gRef.current * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.l -= dt;
        if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -0.5; }
        ctx.fillStyle = fg;
        ctx.globalAlpha = Math.max(0, p.l / 2);
        ctx.fillRect(p.x, p.y, 3, 3);
      }
      ctx.globalAlpha = 1;
      ps = ps.filter((p) => p.l > 0);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", dn);
    };
  }, []);
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">06 · Particle fountain — click to emit, gravity goes negative</p>
      <canvas ref={ref} width={400} height={176} style={{ width: "100%", height: 176, display: "block", border: "1px solid var(--line)", marginTop: 12, touchAction: "none", cursor: "crosshair" }} aria-label="Particle fountain: click or tap to emit" />
      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, marginTop: 12 }}>
        Gravity {g}
        <input type="range" min={-300} max={900} step={10} value={g} onChange={(e) => setG(Number(e.target.value))} aria-label="Gravity" style={{ flex: 1 }} />
      </label>
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
      <p className="kicker">07 · Audio visualiser — three oscillators, no samples</p>
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
  const [seed, setSeed] = useState(7);
  const [ridges, setRidges] = useState(46);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = 220);
    const fg = getComputedStyle(document.body).getPropertyValue("--fg").trim() || "#fff";
    const bg = getComputedStyle(document.body).getPropertyValue("--bg").trim() || "#000";
    const h = (i: number, j: number, oct: number) => {
      let v = 0;
      for (let o = 0; o < oct; o++) {
        const f = 2 ** o;
        v += (Math.sin(i * 0.11 * f + seed * 1.7 + o) * Math.cos(j * 0.17 * f + seed * 0.9)) / f;
      }
      return v;
    };
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    for (let k = ridges; k >= 0; k--) {
      const d = k / ridges;
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 8) {
        const y = H * (0.35 + d * 0.6) - h(x / 8, k, 3) * 60 * (1 - d * 0.5) - Math.sin(x * 0.01 + k) * 8;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.5 - d * 0.4;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }, [seed, ridges]);
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">08 · Procedural terrain — ridge lines, seeded</p>
      <canvas ref={ref} style={{ width: "100%", height: 220, display: "block", border: "1px solid var(--line)", marginTop: 12 }} aria-label="Procedural terrain" />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12, alignItems: "center" }}>
        <button type="button" onClick={() => setSeed((s) => s + 1)} style={{ border: "1px solid var(--fg)", background: "transparent", color: "var(--fg)", padding: "8px 16px", fontSize: 12 }}>
          New terrain ({seed})
        </button>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, flex: 1, minWidth: 200 }}>
          Ridges {ridges}
          <input type="range" min={8} max={80} value={ridges} onChange={(e) => setRidges(Number(e.target.value))} aria-label="Ridges" style={{ flex: 1 }} />
        </label>
      </div>
    </section>
  );
}

/** 3D room: seeded raw-three.js box room. Drag to orbit, scroll to zoom. */
function Room3D() {
  const mount = useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = useState({ w: 8, d: 6, h: 3, items: 8, seed: 3 });
  const [wall, setWall] = useState("#c9b8a0");
  const cfg = useRef(dims);
  const wallRef = useRef(wall);
  useEffect(() => {
    cfg.current = dims;
    wallRef.current = wall;
  }, [dims, wall]);
  useEffect(() => {
    let raf = 0;
    let dead = false;
    let cleanup = () => {};
    void import("three").then((m) => {
      if (dead) return;
      const T = m;
      const el = mount.current;
      if (!el) return;
      const W = el.clientWidth || 1;
      const H = 260;
      const renderer = new T.WebGLRenderer({ antialias: true });
      renderer.setSize(W, H);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.display = "block";
      renderer.domElement.style.touchAction = "none";
      el.appendChild(renderer.domElement);
      const scene = new T.Scene();
      scene.background = new T.Color(0x15151a);
      const camera = new T.PerspectiveCamera(45, W / H, 0.1, 200);
      scene.add(new T.AmbientLight(0xffffff, 0.6));
      const sun = new T.DirectionalLight(0xffffff, 1.6);
      sun.position.set(5, 8, 4);
      scene.add(sun);
      const group = new T.Group();
      scene.add(group);
      const build = () => {
        const { w, d, h, items, seed } = cfg.current;
        while (group.children.length) {
          const o = group.children.pop()!;
          group.remove(o);
        }
        const r = rng(seed * 991 + 3);
        const floor = new T.Mesh(
          new T.PlaneGeometry(w, d),
          new T.MeshStandardMaterial({ color: 0x8a6a48, roughness: 0.7 }),
        );
        floor.rotation.x = -Math.PI / 2;
        group.add(floor);
        const wallMat = new T.MeshStandardMaterial({ color: new T.Color(wallRef.current), roughness: 0.9 });
        const back = new T.Mesh(new T.BoxGeometry(w, h, 0.1), wallMat);
        back.position.set(0, h / 2, -d / 2);
        group.add(back);
        const side = new T.Mesh(new T.BoxGeometry(0.1, h, d), wallMat);
        side.position.set(-w / 2, h / 2, 0);
        group.add(side);
        for (let i = 0; i < items; i++) {
          const s: [number, number, number] = [0.4 + r() * 0.9, 0.3 + r() * 1.1, 0.4 + r() * 0.9];
          const mesh = new T.Mesh(
            new T.BoxGeometry(s[0], s[1], s[2]),
            new T.MeshStandardMaterial({ color: new T.Color(`hsl(${Math.floor(r() * 360)},35%,${45 + Math.floor(r() * 25)}%)`), roughness: 0.6 }),
          );
          mesh.position.set((r() - 0.5) * (w - 1.2), s[1] / 2, (r() - 0.5) * (d - 1.2));
          group.add(mesh);
        }
        const { w: bw, d: bd, h: bh } = cfg.current;
        camera.position.set(bw * 0.9, bh * 1.6, bd * 1.2);
        camera.lookAt(0, bh / 3, 0);
      };
      build();
      let theta = 0.6;
      let dist = 14;
      let dragging: { x: number; y: number } | null = null;
      const dom = renderer.domElement;
      const down = (e: PointerEvent) => {
        dragging = { x: e.clientX, y: e.clientY };
        dom.setPointerCapture(e.pointerId);
      };
      const mv = (e: PointerEvent) => {
        if (!dragging) return;
        theta += (e.clientX - dragging.x) * 0.008;
        dragging = { x: e.clientX, y: e.clientY };
      };
      const up = () => { dragging = null; };
      const wheel = (e: WheelEvent) => {
        e.preventDefault();
        dist = Math.max(6, Math.min(30, dist + e.deltaY * 0.02));
      };
      dom.addEventListener("pointerdown", down);
      dom.addEventListener("pointermove", mv);
      dom.addEventListener("pointerup", up);
      dom.addEventListener("wheel", wheel, { passive: false });
      const size = () => {
        const w = el.clientWidth || 1;
        renderer.setSize(w, 260, false);
        camera.aspect = w / 260;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", size);
      let lastKey = "";
      const loop = () => {
        const key = JSON.stringify([cfg.current.w, cfg.current.d, cfg.current.h, cfg.current.items, cfg.current.seed]);
        if (key !== lastKey) {
          lastKey = key;
          build();
        }
        const bh = cfg.current.h;
        camera.position.set(
          Math.sin(theta) * dist,
          bh * 1.6,
          Math.cos(theta) * dist,
        );
        camera.lookAt(0, bh / 3, 0);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", size);
        dom.removeEventListener("pointerdown", down);
        dom.removeEventListener("pointermove", mv);
        dom.removeEventListener("pointerup", up);
        dom.removeEventListener("wheel", wheel);
        renderer.dispose();
        if (dom.parentElement === el) el.removeChild(dom);
      };
    });
    return () => {
      dead = true;
      cleanup();
    };
  }, []);
  // Controls read the live dims below.
  const geo = dims;
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">09 · 3D room generator — real WebGL, drag to orbit</p>
      <div ref={mount} style={{ width: "100%", height: 260, border: "1px solid var(--line)", marginTop: 12 }} role="application" aria-label="Procedural 3D room. Drag to orbit, scroll to zoom." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginTop: 12 }}>
        {(["w", "d", "h", "items"] as const).map((k) => (
          <label key={k} style={{ fontSize: 12 }}>
            {k.toUpperCase()} {geo[k]}
            <input
              type="range"
              min={k === "items" ? 0 : k === "h" ? 2 : 4}
              max={k === "items" ? 20 : k === "h" ? 5 : 14}
              step={k === "h" ? 0.5 : 1}
              value={geo[k]}
              onChange={(e) => setDims({ ...geo, [k]: Number(e.target.value) })}
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
      <button type="button" onClick={() => setDims({ ...geo, seed: geo.seed + 1 })} style={{ border: "1px solid var(--fg)", background: "transparent", color: "var(--fg)", padding: "8px 16px", fontSize: 12, marginTop: 12 }}>
        New layout ({geo.seed})
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
      <p className="kicker">10 · Experimental navigation — click anywhere, choose a door</p>
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
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = 176);
    const fg = getComputedStyle(document.body).getPropertyValue("--fg").trim() || "#fff";
    const bg = getComputedStyle(document.body).getPropertyValue("--bg").trim() || "#000";
    const ptr = { x: W / 2, y: H / 2 };
    let chain: { x: number; y: number }[] = [];
    const paint = () => {
      const { stiff: k, links: n } = cfg.current;
      if (chain.length !== n) chain = Array.from({ length: n }, () => ({ x: W / 2, y: H / 2 }));
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      let tx = ptr.x;
      let ty = ptr.y;
      chain.forEach((s, i) => {
        s.x += (tx - s.x) * k;
        s.y += (ty - s.y) * k;
        tx = s.x;
        ty = s.y;
        ctx.fillStyle = fg;
        ctx.globalAlpha = 1 - (i / n) * 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 14 - i * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };
    const mv = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      ptr.x = ((e.clientX - r.left) / r.width) * W;
      ptr.y = ((e.clientY - r.top) / r.height) * H;
    };
    canvas.addEventListener("pointermove", mv);
    if (reduced) {
      paint();
      return () => canvas.removeEventListener("pointermove", mv);
    }
    let raf = 0;
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
      <p className="kicker">11 · Physics chain — each link chases the one before it</p>
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

/** Nervous type: letters grow heavier near the pointer, and settle back. */
function NervousType() {
  const [p, setP] = useState<{ x: number; y: number } | null>(null);
  const word = "VARIABLE";
  return (
    <section style={{ padding: "24px 0", borderTop: "1px solid var(--line)" }}>
      <p className="kicker">13 · Nervous type — weight follows your cursor</p>
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
      <p className="kicker">14 · Gravity words — they fall, pile up, and can be thrown</p>
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
      <p className="kicker">15 · Hum — move across it to play, watch it draw itself</p>
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
