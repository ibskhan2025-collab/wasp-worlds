"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { nestMaterials, nestRooms } from "@/data/nest";

/**
 * NEST/WALK — the room as a CSS-3D box you orbit by dragging.
 * Same rooms, same materials, one dimension up. No WebGL, no library:
 * six transformed divs, pointer handlers, reduced-motion static view.
 */
export function NestWalk() {
  const [slug, setSlug] = useState(nestRooms[0].slug);
  const [mat, setMat] = useState("plaster");
  const [rot, setRot] = useState({ x: -12, y: 28 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const room = nestRooms.find((r) => r.slug === slug) ?? nestRooms[0];
  const material = nestMaterials.find((m) => m.id === mat) ?? nestMaterials[0];
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  function down(e: React.PointerEvent) {
    if (reduced.current) return;
    drag.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function move(e: React.PointerEvent) {
    if (!drag.current || reduced.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    setRot((r) => ({ x: Math.max(-60, Math.min(10, r.x + dy * 0.25)), y: r.y + dx * 0.35 }));
  }
  function up() {
    drag.current = null;
  }

  const S = 240;
  const wall = (transform: string, extra?: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: S,
    height: S,
    left: "50%",
    top: "50%",
    marginLeft: -S / 2,
    marginTop: -S / 2,
    transform,
    background: material.hex,
    border: "2px solid #1c1a16",
    backfaceVisibility: "hidden",
    ...extra,
  });

  return (
    <div style={{ background: "#101210", color: "#e8e0d2", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="nest" label="Room 14 · NEST/WALK" />
      <RealityShell world="nest" current="walk" basePath="/worlds/nest" />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#c98a3d" }}>IN THE ROOM · DRAG TO ORBIT</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.6rem)", margin: "8px 0" }}>{room.name}</h1>
        <div
          role="application"
          aria-label={`${room.name} in 3D. Drag to orbit.`}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          style={{ perspective: 900, height: 340, border: "1px solid #e8e0d244", touchAction: "none", cursor: "grab", overflow: "hidden" }}
        >
          <div style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}>
            <div style={wall(`translateZ(${S / 2}px)`, { overflow: "hidden" })}>
              <img src={room.image} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
            </div>
            <div style={wall(`rotateY(180deg) translateZ(${S / 2}px)`, { background: material.hex })} />
            <div style={wall(`rotateY(90deg) translateZ(${S / 2}px)`, { filter: "brightness(0.85)" })} />
            <div style={wall(`rotateY(-90deg) translateZ(${S / 2}px)`, { filter: "brightness(0.85)" })} />
            <div style={wall(`rotateX(90deg) translateZ(${S / 2}px)`, { filter: "brightness(0.7)" })} />
            <div style={wall(`rotateX(-90deg) translateZ(${S / 2}px)`, { filter: "brightness(1.1)" })} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          {nestRooms.map((r) => (
            <button key={r.slug} type="button" onClick={() => setSlug(r.slug)} aria-pressed={slug === r.slug} className={slug === r.slug ? "chip-on" : "chip"}>
              {r.name}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {nestMaterials.map((m) => (
            <button key={m.id} type="button" onClick={() => setMat(m.id)} aria-pressed={mat === m.id} className={mat === m.id ? "chip-on" : "chip"} title={m.note}>
              {m.name}
            </button>
          ))}
        </div>
        <p style={{ color: "#8a7f6e", fontSize: "0.85rem", marginTop: 12 }}>
          {room.size} · {room.light} · shown in {material.name}. Same rooms, same materials as the plan — one dimension up.
        </p>
        <div style={{ marginTop: 12 }}>
          <Link href={`/worlds/nest/${room.slug}`} style={{ color: "#c98a3d", textDecoration: "underline" }}>Room dossier →</Link>
        </div>
      </div>
      <WorldProof
        proves="Space you can orbit: the same room graph, the same material tokens, rendered spatially. No engine, no download."
        relatedHref="/worlds/atlas"
        relatedName="ATLAS"
      />
    </div>
  );
}
