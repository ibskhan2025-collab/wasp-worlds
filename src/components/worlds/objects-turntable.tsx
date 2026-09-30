"use client";

import Link from "next/link";
import { useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { objectProducts } from "@/data/objects";
import { money } from "@/lib/use-cart";

/**
 * OBJECTS/TURNTABLE — the catalogue as a 3D ring. Drag to spin,
 * click a vessel to open it. Pure CSS 3D, no library.
 */
export function ObjectsTurntable() {
  const [angle, setAngle] = useState(0);
  const [drag, setDrag] = useState<number | null>(null);
  const n = objectProducts.length;
  const R = 300;

  function down(e: React.PointerEvent) {
    setDrag(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function move(e: React.PointerEvent) {
    if (drag === null) return;
    setAngle((a) => a + (e.clientX - drag) * 0.35);
    setDrag(e.clientX);
  }

  return (
    <div style={{ background: "#141210", color: "#efeae2", minHeight: "100dvh", fontFamily: "var(--font-shop)" }}>
      <WorldExit id="objects" label="Room 06 · OBJECTS/TURNTABLE" />
      <RealityShell world="objects" current="turntable" basePath="/worlds/objects" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 80px", textAlign: "center" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#a89a80" }}>DRAG TO SPIN · CLICK TO OPEN</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.6rem)", margin: "8px 0 4px", fontWeight: 500 }}>Turntable</h1>
        <div
          role="application"
          aria-label="Rotating product ring. Drag to spin."
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={() => setDrag(null)}
          style={{ perspective: 1100, height: 380, position: "relative", overflow: "hidden", touchAction: "pan-y", cursor: "grab", marginTop: 12 }}
        >
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 0, height: 0, transformStyle: "preserve-3d", transform: `rotateY(${angle}deg)` }}>
            {objectProducts.map((p, i) => {
              const a = (i / n) * Math.PI * 2;
              const x = Math.sin(a) * R;
              const z = Math.cos(a) * R - R;
              const facing = Math.cos(a + (angle * Math.PI) / 180);
              return (
                <Link
                  key={p.id}
                  href={`/worlds/objects/product/${p.id}`}
                  aria-label={p.name}
                  style={{
                    position: "absolute",
                    width: 150,
                    left: -75,
                    top: -110,
                    transform: `translate3d(${x}px, 0, ${z}px) rotateY(${-angle}deg)`,
                    opacity: facing > -0.2 ? 1 : 0.25,
                    pointerEvents: facing > -0.2 ? "auto" : "none",
                    transition: "opacity 200ms",
                    background: "#1c1a16",
                    border: "1px solid #efeae255",
                  }}
                >
                  <img src={p.image} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: 150, objectFit: "cover", display: "block", pointerEvents: "none" }} draggable={false} />
                  <div style={{ padding: "8px 10px", fontSize: 12 }}>
                    <div>{p.name}</div>
                    <strong>{money(p.price)}</strong>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <p style={{ color: "#a89a80", fontSize: "0.9rem" }}>{n} vessels on the ring. Behind cards are dimmed and unclickable — spin them round.</p>
      </div>
      <WorldProof
        proves="The catalogue as an object: spatial browsing with the same stock, prices and product pages underneath."
        relatedHref="/worlds/nest"
        relatedName="NEST"
      />
    </div>
  );
}
