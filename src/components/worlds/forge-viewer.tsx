"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { forgeProducts } from "@/data/forge";

/**
 * FORGE/VIEWER — parts as CSS-3D solids built from their real dims.
 * Drag to rotate, auto-spins when idle. Reduced motion: static 3/4 view.
 */
export function ForgeViewer() {
  const [slug, setSlug] = useState(forgeProducts[0].slug);
  const [rot, setRot] = useState({ x: -18, y: 32 });
  const [spin, setSpin] = useState(true);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const p = forgeProducts.find((x) => x.slug === slug) ?? forgeProducts[0];
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) setSpin(false);
  }, []);

  useEffect(() => {
    if (!spin || reduced.current) return;
    let raf = 0;
    const tick = () => {
      setRot((r) => ({ ...r, y: (r.y + 0.6) % 360 }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [spin]);

  // Scale mm into px, capped so monsters fit the stage.
  const W = Math.max(60, Math.min(220, p.dims.w));
  const H = Math.max(50, Math.min(180, p.dims.h));
  const D = Math.max(50, Math.min(180, p.dims.h * 0.8));
  const face = (transform: string, extra?: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    transform,
    background: "rgba(232,241,255,0.06)",
    border: "2px solid #e8f1ff",
    backfaceVisibility: "visible",
    ...extra,
  });

  function down(e: React.PointerEvent) {
    setSpin(false);
    drag.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function move(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    setRot((r) => ({ x: Math.max(-70, Math.min(30, r.x + dy * 0.3)), y: r.y + dx * 0.4 }));
  }

  return (
    <div style={{ background: "#0a1c33", color: "#e8f1ff", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="forge" label="Room 11 · FORGE/VIEWER" />
      <RealityShell world="forge" current="viewer" basePath="/worlds/forge" />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#6fc3ff" }}>VIEWER · DRAG TO ROTATE · SCROLL FOR SPECS</p>
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", margin: "8px 0" }}>{p.name}</h1>
        <div
          role="application"
          aria-label={`${p.name} in 3D. Drag to rotate.`}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={() => (drag.current = null)}
          style={{ perspective: 800, height: 320, border: "1px solid rgba(232,241,255,0.3)", touchAction: "none", cursor: "grab", overflow: "hidden", background: "radial-gradient(circle at 50% 40%, rgba(111,195,255,0.12), transparent 70%)" }}
        >
          <div style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}>
            <div style={face(`translate(-50%,-50%) translateZ(${D / 2}px)`, { width: W, height: H, margin: 0 })} />
            <div style={face(`translate(-50%,-50%) rotateY(180deg) translateZ(${D / 2}px)`, { width: W, height: H, margin: 0 })} />
            <div style={face(`translate(-50%,-50%) rotateY(90deg) translateZ(${W / 2}px)`, { width: D, height: H, margin: 0 })} />
            <div style={face(`translate(-50%,-50%) rotateY(-90deg) translateZ(${W / 2}px)`, { width: D, height: H, margin: 0 })} />
            <div style={face(`translate(-50%,-50%) rotateX(90deg) translateZ(${H / 2}px)`, { width: W, height: D, margin: 0 })} />
            <div style={face(`translate(-50%,-50%) rotateX(-90deg) translateZ(${H / 2}px)`, { width: W, height: D, margin: 0 })} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginTop: 12, fontSize: "0.9rem" }}>
          <span>{p.dims.w}×{p.dims.h}{p.dims.bore ? ` Ø${p.dims.bore}` : ""} mm · {p.tolerance} · {p.load} kN</span>
          <button type="button" onClick={() => setSpin((s) => !s)} aria-pressed={spin} style={{ background: "none", border: "1px solid #6fc3ff", color: "#6fc3ff", padding: "6px 12px", fontFamily: "inherit", fontSize: 12 }}>
            {spin ? "■ STOP SPIN" : "▶ SPIN"}
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          {forgeProducts.map((x) => (
            <button key={x.slug} type="button" onClick={() => setSlug(x.slug)} aria-pressed={slug === x.slug} style={{ background: slug === x.slug ? "#6fc3ff" : "transparent", color: slug === x.slug ? "#0a1c33" : "#e8f1ff", border: "1px solid #6fc3ff", padding: "8px 12px", fontFamily: "inherit", fontSize: 12 }}>
              {x.name}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <Link href={`/worlds/forge/${p.slug}`} style={{ color: "#6fc3ff", textDecoration: "underline" }}>Full spec sheet →</Link>
        </div>
      </div>
      <WorldProof
        proves="Dimensions you can turn over. The viewer builds solids from the same numbers as the diagrams — one source of truth, two presentations."
        relatedHref="/worlds/vector"
        relatedName="VECTOR"
      />
    </div>
  );
}
