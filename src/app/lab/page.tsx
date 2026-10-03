"use client";

import { useEffect, useRef, useState } from "react";
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
