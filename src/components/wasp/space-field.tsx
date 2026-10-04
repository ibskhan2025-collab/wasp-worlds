"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { REALITIES } from "@/lib/realities";
import { WORLDS } from "@/lib/worlds";

const ACCENT: Record<string, string> = {
  casa: "#ff5a2e",
  noir: "#f4f1ea",
  orbit: "#6fc3ff",
  still: "#ececec",
  signal: "#6fc3ff",
  objects: "#e2c08d",
  archive: "#c9a86d",
  motion: "#e8b86d",
  void: "#3ddc84",
  atlas: "#c98a3d",
  forge: "#ffb020",
  pulse: "#9d5cff",
  civic: "#2e6bd8",
  nest: "#c98a3d",
  vector: "#6fc3ff",
};

function pos(i: number) {
  const a = i * 2.39996;
  const r = Math.sqrt((i + 0.6) / 15.4);
  return { x: 50 + Math.cos(a) * r * 44, y: 50 + Math.sin(a) * r * 41 };
}

/**
 * SPACE: the exhibition as a constellation. Fifteen worlds positioned by
 * phyllotaxis, drifting on canvas, linked where they share disciplines.
 * Hover, focus or tap a world to read it; lines light up its kin.
 */
export function SpaceField() {
  const [hov, setHov] = useState<string | null>(null);
  const wrap = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const P = useMemo(() => WORLDS.map((_, i) => pos(i)), []);
  const reduced = useRef(false);

  const links = useMemo(() => {
    const out: [number, number][] = [];
    WORLDS.forEach((a, i) =>
      WORLDS.forEach((b, j) => {
        if (j > i && a.tags.filter((t) => b.tags.includes(t)).length >= 2) out.push([i, j]);
      }),
    );
    return out;
  }, []);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const layout = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);
    if (reduced.current) {
      paint(ctx, el);
      return () => ro.disconnect();
    }
    let raf = 0;
    let t = 0;
    const loop = () => {
      t += 1;
      paint(ctx, el, t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const hw = hov ? WORLDS.find((w) => w.id === hov) ?? null : null;
  const lit = (id: string) => {
    if (!hw) return true;
    if (id === hw.id) return true;
    const o = WORLDS.find((w) => w.id === id)!;
    return o.tags.filter((t) => hw.tags.includes(t)).length >= 2;
  };

  return (
    <section id="space" aria-label="Space: all fifteen worlds" style={{ borderBottom: "1px solid var(--line)" }}>
      <div style={{ padding: "16px var(--pad) 8px", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
        <p className="ex-kicker" style={{ margin: 0 }}>Space · 15 worlds, one sky</p>
        <Link className="kicker" href="/matrix" style={{ borderBottom: "1px solid currentColor" }}>Matrix view →</Link>
      </div>
      <div ref={wrap} style={{ position: "relative", width: "100%", height: "72vh", minHeight: 520, overflow: "hidden" }} role="group" aria-label="Field of 15 worlds">
        <canvas ref={canvas} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden>
          {links.map(([i, j]) => {
            const a = WORLDS[i];
            const b = WORLDS[j];
            const hl = hov !== null && (a.id === hov || b.id === hov);
            const act = lit(a.id) && lit(b.id);
            return (
              <line
                key={`${i}-${j}`}
                x1={P[i].x}
                y1={P[i].y}
                x2={P[j].x}
                y2={P[j].y}
                stroke={hl ? "#f4f1ea" : "#ffffff"}
                strokeOpacity={hl ? 0.8 : act ? 0.13 : 0.03}
                strokeWidth={0.15}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        {WORLDS.map((w, i) => (
          <Link
            key={w.id}
            href={w.href}
            onPointerEnter={() => setHov(w.id)}
            onPointerLeave={() => setHov(null)}
            onFocus={() => setHov(w.id)}
            onBlur={() => setHov(null)}
            aria-label={`Room ${w.room}: ${w.name}. ${w.line}`}
            style={{
              position: "absolute",
              zIndex: 10,
              left: `${P[i].x}%`,
              top: `${P[i].y}%`,
              transform: "translate(-50%,-50%)",
              opacity: lit(w.id) ? 1 : 0.15,
              transition: "opacity 0.5s",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                aria-hidden
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: ACCENT[w.id],
                  boxShadow: `0 0 18px ${ACCENT[w.id]}`,
                  transform: hov === w.id ? "scale(2.2)" : "scale(1)",
                  transition: "transform 0.3s",
                }}
              />
              <span style={{ fontFamily: "var(--font-code)", fontSize: 10, color: "var(--muted)" }}>{w.room}</span>
              <span style={{ fontWeight: 900, fontSize: "clamp(1rem, 3.2vw, 2.6rem)", letterSpacing: "-0.02em", lineHeight: 1, color: hov === w.id ? ACCENT[w.id] : "var(--fg)" }}>
                {w.name}
              </span>
            </span>
          </Link>
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 20, borderTop: "1px solid var(--line)", background: "linear-gradient(transparent, rgba(0,0,0,0.8))", padding: "16px var(--pad)" }} aria-live="polite">
          {hw ? (
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "baseline" }}>
              <p style={{ fontSize: "1.9rem", fontWeight: 900, margin: 0, color: ACCENT[hw.id] }}>{hw.name}</p>
              <p style={{ maxWidth: 480, margin: 0, color: "var(--fg)" }}>{hw.line}</p>
              <p className="kicker" style={{ margin: 0 }}>
                {(REALITIES[hw.id] ?? []).length} realities · {hw.kind} · <Link href={hw.href} style={{ textDecoration: "underline" }}>Enter →</Link>
              </p>
            </div>
          ) : (
            <p className="kicker" style={{ margin: 0 }}>15 worlds · hover, focus or tap a world · lines connect worlds that share disciplines</p>
          )}
        </div>
      </div>
    </section>
  );
}

function paint(
  ctx: CanvasRenderingContext2D,
  el: HTMLDivElement,
  t = 0,
) {
  const w = el.clientWidth;
  const h = el.clientHeight;
  ctx.clearRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) {
    const px = ((i * 97) % 100) / 100;
    const py = ((i * 57) % 100) / 100;
    const tw = 0.25 + 0.2 * Math.sin(t / 40 + i);
    ctx.fillStyle = `rgba(244,241,234,${Math.max(0.05, tw)})`;
    ctx.fillRect(px * w, py * h, 1.5, 1.5);
  }
}
