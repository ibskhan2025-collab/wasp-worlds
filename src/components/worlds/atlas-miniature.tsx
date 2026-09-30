"use client";

import Link from "next/link";
import { useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { destinations } from "@/data/atlas";
import { money } from "@/lib/use-cart";

/**
 * ATLAS/MINIATURE — the valley as a tilted tabletop model.
 * Routes become raised pins with height by price; click a pin
 * to open the route. Pure CSS 3D, no library.
 */
export function AtlasMiniature() {
  const [tilt, setTilt] = useState(48);
  const [spin, setSpin] = useState(-24);
  const [drag, setDrag] = useState<number | null>(null);
  const max = Math.max(...destinations.map((d) => d.price));

  function down(e: React.PointerEvent) {
    setDrag(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function move(e: React.PointerEvent) {
    if (drag === null) return;
    setSpin((s) => s + (e.clientX - drag) * 0.3);
    setDrag(e.clientX);
  }

  return (
    <div style={{ background: "#101418", color: "#e8e4dc", minHeight: "100dvh" }}>
      <WorldExit id="atlas" label="Room 10 · ATLAS/MINIATURE" />
      <RealityShell world="atlas" current="miniature" basePath="/worlds/atlas" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 80px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.3em", color: "#c98a3d" }}>TABLETOP MODEL · DRAG TO SPIN · TILT {tilt}°</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 7vw, 4.6rem)", margin: "8px 0" }}>THE VALLEY, SMALL.</h1>
        <input
          type="range" min={20} max={70} value={tilt} onChange={(e) => setTilt(Number(e.target.value))}
          aria-label="Model tilt" style={{ width: "min(420px, 80%)" }}
        />
        <div
          role="application"
          aria-label="Miniature valley model. Drag to spin."
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={() => setDrag(null)}
          style={{ perspective: 1000, height: 420, position: "relative", overflow: "hidden", touchAction: "pan-y", cursor: "grab", marginTop: 8, border: "1px solid rgba(232,228,220,0.2)" }}
        >
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 0, height: 0, transformStyle: "preserve-3d", transform: `rotateX(${tilt}deg) rotateZ(${spin}deg)` }}>
            <div style={{ position: "absolute", width: 340, height: 340, left: -170, top: -170, transform: "translateZ(0px)", background: "radial-gradient(circle at 60% 40%, #1c2620, #101418 75%)", border: "1px solid rgba(201,138,61,0.5)" }} />
            {destinations.map((d) => {
              const px = ((d.map.x / 400) - 0.5) * 320;
              const py = ((d.map.y / 300) - 0.5) * 320;
              const h = 30 + (d.price / max) * 110;
              return (
                <div key={d.slug} style={{ position: "absolute", left: px, top: py, transformStyle: "preserve-3d" }}>
                  <div style={{ width: 3, height: h, marginLeft: -1.5, transform: `translateZ(${h / 2}px)`, background: "#c98a3d" }} />
                  <Link
                    href={`/worlds/atlas/${d.slug}`}
                    aria-label={`${d.name}: ${d.days} days, ${money(d.price)}`}
                    title={`${d.name} — ${money(d.price)}`}
                    style={{
                      position: "absolute", left: -11, top: 0, width: 22, height: 22, borderRadius: "50%",
                      transform: `translateZ(${h}px)`, background: "#c98a3d", border: "2px solid #e8e4dc",
                      display: "block",
                    }}
                  />
                  <div style={{ position: "absolute", left: 16, top: 0, transform: `translateZ(${h}px)`, whiteSpace: "nowrap", fontFamily: "var(--font-code)", fontSize: 11, color: "#e8e4dc", background: "rgba(16,20,24,0.85)", padding: "2px 6px" }}>
                    {d.name} · {money(d.price)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <p style={{ fontFamily: "var(--font-code)", fontSize: 12, color: "#8a938f" }}>Pin height = price. Six routes, one tabletop. Same destinations, same arithmetic.</p>
      </div>
      <WorldProof
        proves="Cartography you can tilt: the same six routes and the same totals, modeled as a place instead of listed as pages."
        relatedHref="/worlds/nest"
        relatedName="NEST"
      />
    </div>
  );
}
