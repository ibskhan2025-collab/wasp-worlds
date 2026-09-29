"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { useWasp } from "@/context/wasp-context";
import { loadJson, saveJson } from "@/lib/storage";

type P = { x: number; y: number; vx: number; vy: number; c: string; life: number; ch?: string };

const SET_KEY = "wasp-v11-void-settings";

export default function VoidPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ps = useRef<P[]>([]);
  const mouse = useRef({ x: 0, y: 0, down: false, still: 0 });
  const densityRef = useRef(180);
  const { discover, discoveries } = useWasp();
  const [msg, setMsg] = useState("MOVE. TYPE. HOLD.");
  const [repel, setRepel] = useState(false);
  const [density, setDensity] = useState(180);
  const repelRef = useRef(false);
  const stillFound = useRef(false);

  // Hydrate persisted settings after mount (avoids SSR mismatch).
  useEffect(() => {
    const s = loadJson<{ repel: boolean; density: number }>(SET_KEY, { repel: false, density: 180 });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRepel(s.repel === true);
    setDensity(typeof s.density === "number" && s.density >= 40 && s.density <= 420 ? Math.floor(s.density) : 180);
  }, []);
  useEffect(() => {
    saveJson(SET_KEY, { repel, density });
  }, [repel, density]);

  useEffect(() => {
    repelRef.current = repel;
  }, [repel]);

  useEffect(() => {
    densityRef.current = density;
    // Grow live toward the new density; shrinking happens naturally.
    const canvas = canvasRef.current;
    while (ps.current.length < density) {
      ps.current.push({
        x: Math.random() * (canvas?.width || window.innerWidth),
        y: Math.random() * (canvas?.height || window.innerHeight),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        c: `hsla(${40 + Math.random() * 30}, 20%, ${70 + Math.random() * 20}%, 0.7)`,
        life: 1,
      });
    }
    if (ps.current.length > density) ps.current.splice(0, ps.current.length - density);
  }, [density]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < densityRef.current; i++) {
      ps.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        c: `hsla(${40 + Math.random() * 30}, 20%, ${70 + Math.random() * 20}%, 0.7)`,
        life: 1,
      });
    }

    const loop = () => {
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const m = mouse.current;
      m.still += 1;
      if (m.still > 180 && !stillFound.current) {
        stillFound.current = true;
        setMsg("THE PORTFOLIO IS THE PRODUCT");
        discover("void-still");
      }
      for (const p of ps.current) {
        const dx = p.x - m.x;
        const dy = p.y - m.y;
        const d = Math.hypot(dx, dy) + 0.001;
        const force = Math.min(180, 14000 / (d * d));
        const dir = repelRef.current || m.down ? 1 : -1;
        p.vx += (dx / d) * force * 0.02 * dir;
        p.vy += (dy / d) * force * 0.02 * dir;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.fillStyle = p.c;
        if (p.ch) {
          ctx.font = "18px IBM Plex Mono, monospace";
          ctx.fillText(p.ch, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const move = (e: PointerEvent) => {
      mouse.current = { ...mouse.current, x: e.clientX, y: e.clientY, still: 0 };
    };
    const down = () => {
      mouse.current.down = true;
    };
    const up = () => {
      mouse.current.down = false;
    };
    const key = (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        ps.current.push({
          x: mouse.current.x || canvas.width / 2,
          y: mouse.current.y || canvas.height / 2,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          c: "#f4f1ea",
          life: 1,
          ch: e.key,
        });
        if (ps.current.length > 420) ps.current.shift();
      }
      if (e.key === " ") {
        e.preventDefault();
        setRepel((v) => !v);
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("keydown", key);
    };
  }, [discover]);

  return (
    <div className="void-root">
      <WorldExit id="void" label="Room 09 · VOID" />
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <div className="void-ui">
        <div>VOID</div>
        <div>{msg}</div>
        <div>SPACE = {repel ? "REPEL" : "ATTRACT"}</div>
        {discoveries.includes("void-still") ? <div>YOU HELD STILL. GOOD.</div> : null}
        <div><Link href="/worlds/void/notes" style={{ pointerEvents: "auto" }}>Field notes →</Link></div>
        <div style={{ pointerEvents: "auto", display: "flex", gap: 12 }}>
          <Link href="/start">Start a project →</Link>
          <Link href="/worlds/signal">SIGNAL →</Link>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 18, left: 18, right: 18, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", zIndex: 2 }}>
        <button type="button" className="ghost" style={{ color: "#f4f1ea", borderColor: "#f4f1ea55" }} onClick={() => setRepel((v) => !v)} aria-pressed={repel}>
          {repel ? "REPEL" : "ATTRACT"}
        </button>
        <label className="kicker" style={{ display: "flex", gap: 8, alignItems: "center", color: "#f4f1ea" }}>
          Dust {density}
          <input type="range" min={40} max={420} step={20} value={density} onChange={(e) => setDensity(Number(e.target.value))} aria-label="Particle density" />
        </label>
        <button
          type="button"
          className="ghost"
          style={{ color: "#f4f1ea", borderColor: "#f4f1ea55" }}
          onClick={() => {
            const canvas = canvasRef.current;
            ps.current.push({
              x: mouse.current.x || (canvas ? canvas.width / 2 : 200),
              y: mouse.current.y || (canvas ? canvas.height / 2 : 200),
              vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
              c: "#f4f1ea", life: 1, ch: "✳",
            });
            mouse.current.still = 0;
          }}
        >
          Burst
        </button>
      </div>
    </div>
  );
}
