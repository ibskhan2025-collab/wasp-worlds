"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWasp } from "@/context/wasp-context";
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

const TAGS = [...new Set(WORLDS.flatMap((w) => w.tags))];

/**
 * SPACE: all three fields combined. Phyllotaxis constellation with glowing
 * nodes, a drifting starfield canvas that feels the pointer, discipline
 * lines, hover fan-out, capability pills synced to ?cap=, visited marks,
 * gentle float, and a map/index toggle. Keyboard-focusable throughout.
 */
export function SpaceField() {
  const wasp = useWasp();
  const [hov, setHov] = useState<string | null>(null);
  const [sel, setSel] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const c = new URLSearchParams(window.location.search).get("cap");
    return c && TAGS.includes(c) ? [c] : [];
  });
  const [index, setIndex] = useState(false);
  const wrap = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const ptr = useRef({ x: -1, y: -1 });
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

  const matches = (id: string) => {
    if (sel.length === 0) return true;
    const w = WORLDS.find((x) => x.id === id)!;
    return sel.some((s) => w.tags.includes(s));
  };

  function toggle(tag: string) {
    const next = sel.includes(tag) ? sel.filter((t) => t !== tag) : [...sel, tag];
    setSel(next);
    try {
      const u = new URL(window.location.href);
      if (next.length === 1) u.searchParams.set("cap", next[0]);
      else u.searchParams.delete("cap");
      window.history.replaceState(null, "", u.pathname + u.search + u.hash);
    } catch {
      /* share URL stays as-is */
    }
  }

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
    const mv = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    };
    const lv = () => {
      ptr.current = { x: -1, y: -1 };
    };
    el.addEventListener("pointermove", mv);
    el.addEventListener("pointerleave", lv);
    if (reduced.current) {
      paint(ctx, el, ptr.current, 0);
      return () => {
        ro.disconnect();
        el.removeEventListener("pointermove", mv);
        el.removeEventListener("pointerleave", lv);
      };
    }
    let raf = 0;
    let t = 0;
    const loop = () => {
      t += 1;
      paint(ctx, el, ptr.current, t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointermove", mv);
      el.removeEventListener("pointerleave", lv);
    };
  }, []);

  const hw = hov ? WORLDS.find((w) => w.id === hov) ?? null : null;
  const kin = (id: string) => {
    const w = WORLDS.find((x) => x.id === id)!;
    return WORLDS.filter((o) => o.id !== id && o.tags.filter((t) => w.tags.includes(t)).length >= 2);
  };
  const hwKin = hw ? kin(hw.id) : [];
  const litCount = WORLDS.filter((w) => matches(w.id)).length;
  const lit = (id: string) => {
    if (!matches(id)) return false;
    if (!hw) return true;
    if (id === hw.id) return true;
    const o = WORLDS.find((w) => w.id === id)!;
    return o.tags.filter((t) => hw.tags.includes(t)).length >= 2;
  };

  return (
    <section id="space" aria-label="Space: all fifteen worlds" style={{ borderBottom: "1px solid var(--line)" }}>
      <div style={{ padding: "16px var(--pad) 8px", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
        <p className="ex-kicker" style={{ margin: 0 }}>Space · 15 worlds, one sky</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => setIndex(false)} aria-pressed={!index} className={index ? "chip" : "chip-on"}>
            Map
          </button>
          <button type="button" onClick={() => setIndex(true)} aria-pressed={index} className={index ? "chip-on" : "chip"}>
            Index
          </button>
          <Link className="kicker" href="/matrix" style={{ borderBottom: "1px solid currentColor", alignSelf: "center" }}>
            Matrix view →
          </Link>
        </div>
      </div>
      <div style={{ padding: "0 var(--pad) 12px", display: "flex", gap: 8, flexWrap: "wrap" }} role="group" aria-label="Filter worlds by capability">
        {TAGS.map((t) => {
          const n = WORLDS.filter((w) => w.tags.includes(t)).length;
          const on = sel.includes(t);
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(t)}
              className={on ? "chip-on" : "chip"}
            >
              {t} · {n}
            </button>
          );
        })}
        {sel.length > 0 ? (
          <button type="button" onClick={() => toggle(sel[0])} className="chip">
            Clear
          </button>
        ) : null}
      </div>
      {index ? (
        <div style={{ padding: "0 var(--pad) 32px" }}>
          {WORLDS.filter((w) => matches(w.id)).map((w) => (
            <Link
              key={w.id}
              href={w.href}
              style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 12, padding: "12px 0", borderTop: "1px solid var(--line)", alignItems: "baseline" }}
            >
              <span className="kicker">ROOM {w.room}</span>
              <span>
                <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem" }}>{w.name}</strong>
                <span style={{ color: "var(--muted)", marginLeft: 12 }}>
                  {w.kind} · {(REALITIES[w.id] ?? []).length} realities{wasp.visited.includes(w.id) ? " · seen" : ""}
                </span>
              </span>
              <span className="kicker">Enter →</span>
            </Link>
          ))}
        </div>
      ) : (
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
                  strokeOpacity={hl ? 1 : act ? 0.35 : 0.08}
                  strokeWidth={hl ? 0.3 : 0.15}
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
              className="space-node"
              style={{
                left: `${P[i].x}%`,
                top: `${P[i].y}%`,
                opacity: lit(w.id) ? 1 : 0.12,
                animationDuration: `${5 + (i % 5)}s`,
                animationDelay: `${i * 0.3}s`,
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
                    boxShadow: `0 0 18px ${ACCENT[w.id]}${wasp.visited.includes(w.id) ? `, 0 0 0 3px ${ACCENT[w.id]}55` : ""}`,
                    transform: hov === w.id ? "scale(2.2)" : "scale(1)",
                    transition: "transform 0.3s",
                  }}
                />
                <span style={{ fontFamily: "var(--font-code)", fontSize: 10, color: "var(--muted)" }}>
                  {w.room}
                  {wasp.visited.includes(w.id) ? " · seen" : ""}
                </span>
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
                <p style={{ maxWidth: 420, margin: 0, color: "var(--fg)" }}>{hw.line}</p>
                <p className="kicker" style={{ margin: 0 }}>
                  {(REALITIES[hw.id] ?? []).length} realities · {hw.kind} · <Link href={hw.href} style={{ textDecoration: "underline" }}>Enter →</Link>
                </p>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)" }}>
                  Connected to{" "}
                  {hwKin.map((k, i) => (
                    <span key={k.id}>
                      <Link
                        href={k.href}
                        onPointerEnter={() => setHov(k.id)}
                        style={{ textDecoration: "underline", color: "var(--fg)" }}
                      >
                        {k.name}
                      </Link>
                      <span style={{ fontSize: 11 }}> ({k.tags.filter((t) => hw.tags.includes(t)).slice(0, 2).join(" · ")})</span>
                      {i < hwKin.length - 1 ? " · " : ""}
                    </span>
                  ))}
                </p>
              </div>
            ) : (
              <p className="kicker" style={{ margin: 0 }}>
                {litCount} of 15 worlds lit · hover, focus or tap a world · lines connect worlds that share disciplines
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function paint(
  ctx: CanvasRenderingContext2D,
  el: HTMLDivElement,
  ptr: { x: number; y: number },
  t = 0,
) {
  const w = el.clientWidth;
  const h = el.clientHeight;
  ctx.clearRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) {
    const sx = ((i * 97) % 100) / 100;
    const sy = ((i * 57) % 100) / 100;
    const dx = sx - ptr.x;
    const dy = sy - ptr.y;
    const d = Math.hypot(dx, dy);
    const near = ptr.x >= 0 && d < 0.18 ? (1 - d / 0.18) * 0.5 : 0;
    const tw = 0.25 + 0.2 * Math.sin(t / 40 + i) + near;
    ctx.fillStyle = `rgba(244,241,234,${Math.max(0.05, Math.min(0.9, tw))})`;
    const jx = near > 0 ? (dx / (d || 1)) * near * 0.02 : 0;
    const jy = near > 0 ? (dy / (d || 1)) * near * 0.02 : 0;
    ctx.fillRect((sx + jx) * w, (sy + jy) * h, 1.5, 1.5);
  }
}
