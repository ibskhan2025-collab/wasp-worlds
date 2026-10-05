"use client";

import Link from "next/link";
import { WorldNavLink } from "@/components/wasp/world-wipe";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "@fontsource-variable/bodoni-moda";
import "@fontsource-variable/jost";
import { WorldExit } from "@/components/wasp/world-exit";
import { WorldProof } from "@/components/worlds/world-proof";
import { SHOWROOM_PRODUCTS, SHOWROOM_SIL, type ShowroomProduct } from "@/data/noir-showroom";
import { Orbit, RoomEnv, Stage3D } from "@/lib/three";
import { money, useCart } from "@/lib/use-cart";
import { loadJson, saveJson } from "@/lib/storage";

type V3 = [number, number, number];

function useShape(sil: ShowroomProduct["sil"]) {
  return useMemo(() => {
    const pts = SHOWROOM_SIL[sil];
    const s = new THREE.Shape();
    pts.forEach(([x, y], i) => (i ? s.lineTo((x - 50) / 28, (64 - y) / 28) : s.moveTo((x - 50) / 28, (64 - y) / 28)));
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.22, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 3, curveSegments: 4 });
  }, [sil]);
}

function Piece({ p, pos, sel, onPick }: { p: ShowroomProduct; pos: V3; sel: boolean; onPick: () => void }) {
  const geo = useShape(p.sil);
  const g = useRef<THREE.Group>(null);
  const [h, setH] = useState(false);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * (sel ? 0.9 : h ? 0.4 : 0.12);
  });
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <group
      position={pos}
      onClick={(e) => {
        e.stopPropagation();
        onPick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setH(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setH(false);
        document.body.style.cursor = "";
      }}
    >
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.9, 1, 0.6, 40]} />
        <meshStandardMaterial color="#111" roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.61, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.86, 0.9, 48]} />
        <meshBasicMaterial color={sel ? "#b89b6a" : "#444"} />
      </mesh>
      <group ref={g} position={[0, 2.35, 0]}>
        <mesh geometry={geo} position={[0, 0, -0.11]}>
          <meshStandardMaterial color="#2a2a2c" roughness={0.5} metalness={0.15} emissive={sel ? "#b89b6a" : "#000"} emissiveIntensity={0.12} />
        </mesh>
      </group>
      <spotLight position={[0, 6, 2]} angle={0.35} penumbra={0.8} intensity={sel ? 90 : 45} color="#fff2dc" />
    </group>
  );
}

export function NoirBuyBox({ p }: { p: ShowroomProduct }) {
  const cart = useCart("noir");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  const [wish, setWish] = useState<string[]>(() => loadJson<string[]>("noir-showroom-wish", []));
  useEffect(() => {
    saveJson("noir-showroom-wish", wish);
  }, [wish]);
  const wished = wish.includes(p.id);
  return (
    <div>
      <fieldset>
        <legend style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em" }}>Size</legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {p.sizes.map((s) => (
            <label key={s} style={{ padding: "8px 16px", fontSize: "0.9rem", border: "1px solid rgba(255,255,255,0.3)", background: size === s ? "#b89b6a" : "transparent", color: size === s ? "#000" : "inherit" }}>
              <input type="radio" name={`size-${p.id}`} checked={size === s} onChange={() => { setSize(s); setMsg(""); }} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
              {s}
            </label>
          ))}
        </div>
      </fieldset>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 16 }}>
        <span style={{ fontSize: 12, letterSpacing: "0.15em" }}>Qty</span>
        <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity" style={{ width: 36, height: 36, border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "inherit" }}>−</button>
        <span style={{ width: 24, textAlign: "center" }}>{qty}</span>
        <button type="button" onClick={() => setQty(Math.min(9, qty + 1))} aria-label="Increase quantity" style={{ width: 36, height: 36, border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "inherit" }}>+</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        <button
          type="button"
          style={{ flex: 1, background: "#b89b6a", color: "#000", padding: "12px 20px", fontWeight: 700, border: 0 }}
          onClick={() => {
            if (!size) {
              setMsg("Please choose a size.");
              return;
            }
            cart.add({ id: `showroom-${p.id}`, name: p.name, price: p.price, qty, size, image: "" });
            setMsg(`Added ${qty} × ${p.name} (${size}) to your bag.`);
          }}
        >
          Add to bag
        </button>
        <button
          type="button"
          aria-pressed={wished}
          onClick={() => setWish(wished ? wish.filter((x) => x !== p.id) : [...wish, p.id])}
          style={{ border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "inherit", padding: "12px 16px" }}
        >
          {wished ? "♥ Saved" : "♡ Save"}
        </button>
      </div>
      <p role="status" style={{ minHeight: 20, fontSize: "0.9rem", marginTop: 8 }}>{msg}</p>
      <p style={{ fontSize: "0.85rem" }}>
        <Link href="/worlds/noir/bag" style={{ textDecoration: "underline" }}>Open the bag →</Link>
      </p>
    </div>
  );
}

export function NoirShowroom() {
  const [sel, setSel] = useState<string | null>(null);
  const pos = (i: number): V3 => {
    const a = (i / (SHOWROOM_PRODUCTS.length - 1) - 0.5) * 2.4;
    return [Math.sin(a) * 7, 0, -Math.cos(a) * 7 + 5];
  };
  const p = SHOWROOM_PRODUCTS.find((x) => x.id === sel) ?? null;
  const i = p ? SHOWROOM_PRODUCTS.indexOf(p) : -1;
  const focus = p ? { pos: [pos(i)[0] * 0.75, 2.6, pos(i)[2] + 4.2] as V3, target: [pos(i)[0], 2.3, pos(i)[2]] as V3 } : null;
  return (
    <div style={{ background: "#0a0a0a", color: "#eee9e0", minHeight: "100dvh" }}>
      <WorldExit id="noir" label="Room 02 · NOIR/SHOWROOM" />
      <NoirNav current="showroom" />
      <div style={{ display: "grid", minHeight: "70vh" }}>
        <div style={{ position: "relative", minHeight: 480 }}>
          <Stage3D bg="#050505" camera={[0, 3.4, 12]} label="3D showroom. Choose pieces from the list if you prefer not to use the pointer.">
            <ambientLight intensity={0.15} />
            <RoomEnv intensity={0.25} />
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[60, 60]} />
              <meshStandardMaterial color="#0c0c0d" roughness={0.25} metalness={0.7} />
            </mesh>
            {SHOWROOM_PRODUCTS.map((pr, k) => (
              <Piece key={pr.id} p={pr} pos={pos(k)} sel={sel === pr.id} onPick={() => setSel(pr.id)} />
            ))}
            <Orbit target={[0, 2, 0]} min={3} max={18} maxPolar={Math.PI / 2.1} focus={focus} />
          </Stage3D>
          <p style={{ position: "absolute", left: 12, top: 12, fontSize: 11, letterSpacing: "0.25em", color: "rgba(255,255,255,0.7)", margin: 0, pointerEvents: "none" }}>
            Drag to orbit · click a piece · silhouettes extruded from the shop patterns
          </p>
        </div>
        <aside style={{ borderTop: "1px solid rgba(255,255,255,0.15)", padding: 20 }} aria-label="Selected piece">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }} role="group" aria-label="Pieces">
            {SHOWROOM_PRODUCTS.map((pr) => (
              <button
                key={pr.id}
                type="button"
                aria-pressed={sel === pr.id}
                onClick={() => setSel(pr.id)}
                style={{ border: "1px solid rgba(255,255,255,0.2)", background: sel === pr.id ? "transparent" : "transparent", color: sel === pr.id ? "#b89b6a" : "inherit", borderColor: sel === pr.id ? "#b89b6a" : undefined, padding: "8px", fontSize: 11, textAlign: "left" }}
              >
                {pr.name}
              </button>
            ))}
          </div>
          {!p ? (
            <p style={{ marginTop: 24, fontSize: "0.95rem", color: "rgba(255,255,255,0.6)" }}>
              Nine pieces on nine pedestals. Select one to bring it forward, read what it is made of, choose a size and add it to the same bag the shop uses.
            </p>
          ) : (
            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#b89b6a", margin: 0 }}>{p.cat.toUpperCase()}</p>
              <h2 style={{ fontSize: "2.5rem", margin: "4px 0", fontFamily: "'Bodoni Moda Variable', serif" }}>{p.name}</h2>
              <p style={{ fontSize: "1.25rem", margin: 0 }}>{money(p.price)}</p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem" }}>{p.desc}</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>{p.fabric} · {p.care}</p>
              <div style={{ marginTop: 20 }}>
                <NoirBuyBox key={p.id} p={p} />
              </div>
            </div>
          )}
        </aside>
      </div>
      <WorldProof
        proves="Desire, dimensioned: nine garments as real geometry, each buyable in the same bag."
        relatedHref="/worlds/motion"
        relatedName="MOTION"
      />
    </div>
  );
}

export function NoirNav({ current }: { current: string }) {
  const cart = useCart("noir");
  return (
    <nav aria-label="NOIR realities" style={{ position: "sticky", top: 0, zIndex: 30, display: "flex", alignItems: "center", gap: 20, background: "#0a0a0a", color: "#eee9e0", borderBottom: "1px solid rgba(255,255,255,0.15)", padding: "12px 20px" }}>
      <Link href="/worlds/noir" style={{ fontFamily: "'Bodoni Moda Variable', serif", fontSize: "1.5rem", letterSpacing: "0.2em" }}>
        NOIR
      </Link>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }} role="group" aria-label="Realities">
        <NoirNavLink id="classic" label="Collection" href="/worlds/noir/collection" current={current} />
        <NoirNavLink id="brutalist" label="Brutalist" href="/worlds/noir/brutalist" current={current} />
        <NoirNavLink id="analog" label="Analog" href="/worlds/noir/analog" current={current} />
        <NoirNavLink id="future" label="Future" href="/worlds/noir/future" current={current} />
        <NoirNavLink id="runway" label="Runway" href="/worlds/noir/runway" current={current} />
        <NoirNavLink id="atelier" label="Atelier" href="/worlds/noir/atelier" current={current} />
        <NoirNavLink id="showroom" label="Showroom" href="/worlds/noir/showroom" current={current} />
        <NoirNavLink id="archive" label="Archive" href="/worlds/noir/archive" current={current} />
        <NoirNavLink id="showroom" label="Showroom" href="/worlds/noir/showroom" current={current} />
        <NoirNavLink id="archive" label="Archive" href="/worlds/noir/archive" current={current} />
      </div>
      <Link href="/worlds/noir/bag" style={{ marginLeft: "auto", border: "1px solid rgba(255,255,255,0.4)", padding: "6px 12px", fontSize: 12 }} aria-label={`Open bag, ${cart.count} items`}>
        Bag ({cart.count})
      </Link>
    </nav>
  );
}

function NoirNavLink({ id, label, href, current }: { id: string; label: string; href: string; current: string }) {
  const on = id === current;
  return (
    <WorldNavLink
      world="noir"
      label={label}
      href={href}
      aria-current={on ? "page" : undefined}
      style={{
        fontSize: 11,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        padding: "6px 10px",
        background: on ? "#eee9e0" : "transparent",
        color: on ? "#0a0a0a" : "#eee9e0",
      }}
    >
      {label}
    </WorldNavLink>
  );
}
