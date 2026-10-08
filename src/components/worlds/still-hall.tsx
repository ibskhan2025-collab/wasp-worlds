"use client";

import Link from "next/link";
import { WorldNavLink } from "@/components/wasp/world-wipe";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { WorldExit } from "@/components/wasp/world-exit";
import { WorldProof } from "@/components/worlds/world-proof";
import { Lightbox } from "@/components/worlds/lightbox";
import { stillCollections } from "@/data/still";
import { Orbit, RoomEnv, Stage3D, useKeySet, Walker } from "@/lib/three";

type Photo = { src: string; alt: string; title: string; from: string };

function Frame({ p, pos, rotY, onOpen }: { p: Photo; pos: [number, number, number]; rotY: number; onOpen: () => void }) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let live = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      p.src,
      (t) => {
        if (!live) return;
        t.colorSpace = THREE.SRGBColorSpace;
        setTex(t);
      },
      undefined,
      () => {},
    );
    return () => {
      live = false;
      if (tex) tex.dispose();
    };
  }, [p.src]);
  const w = 2.2;
  const h = 1.7;
  return (
    <group position={pos} rotation={[0, rotY, 0]} onClick={(e) => { e.stopPropagation(); onOpen(); }} onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = ""; }}>
      <mesh>
        <boxGeometry args={[w + 0.16, h + 0.16, 0.06]} />
        <meshStandardMaterial color="#141414" />
      </mesh>
      {tex ? (
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={tex} />
        </mesh>
      ) : (
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial color="#3a3730" roughness={0.9} />
        </mesh>
      )}
      <mesh position={[0, -h / 2 - 0.35, 0.02]}>
        <planeGeometry args={[0.7, 0.14]} />
        <meshBasicMaterial color="#d8d3c8" />
      </mesh>
      <spotLight position={[0, 1.6, 1.6]} angle={0.6} penumbra={0.7} intensity={12} color="#fff2dc" />
    </group>
  );
}

export function StillHall() {
  const keys = useKeySet();
  const [open, setOpen] = useState<number | null>(null);
  const photos: Photo[] = useMemo(
    () =>
      stillCollections.flatMap((c) =>
        c.images.map((img) => ({ src: img.src, alt: img.alt, title: c.title, from: c.title })),
      ),
    [],
  );
  const place = (i: number) => {
    const south = i % 2 === 1;
    return { x: -15 + Math.floor(i / 2) * 6, south };
  };
  const s = place(Math.min(2, photos.length - 1));
  return (
    <div style={{ background: "#e9e6df", color: "#201a12", minHeight: "100dvh", fontFamily: "var(--font-serif)" }}>
      <WorldExit id="still" label="Room 04 · STILL/HALL" />
      <StillNav current="hall" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 8px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>WALK THE HANG · WASD / ARROWS + DRAG · CLICK A FRAME</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.6rem)", fontWeight: 400, margin: "8px 0" }}>The hall.</h1>
        <p style={{ fontStyle: "italic", color: "#6b6254" }}>The photographs hung in a real room. Walk it; the prints are the same ones everywhere else on this site.</p>
      </div>
      <div style={{ height: "62vh", minHeight: 440 }}>
        <Stage3D bg="#e9e6df" camera={[0, 1.6, 0]} fov={65} label="Virtual gallery hall. Walk with W A S D or arrow keys, drag to look, click a frame to open it.">
          <ambientLight intensity={1.1} />
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[40, 10]} />
            <meshStandardMaterial color="#b9a78c" roughness={0.5} />
          </mesh>
          <mesh position={[0, 2.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[40, 10]} />
            <meshStandardMaterial color="#f4f2ed" />
          </mesh>
          <mesh position={[0, 1.6, -4.1]}>
            <planeGeometry args={[40, 4.5]} />
            <meshStandardMaterial color="#f1eee7" />
          </mesh>
          <mesh position={[0, 1.6, 4.1]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[40, 4.5]} />
            <meshStandardMaterial color="#f1eee7" />
          </mesh>
          {[-20, 20].map((x) => (
            <mesh key={x} position={[x, 1.6, 0]} rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
              <planeGeometry args={[10, 4.5]} />
              <meshStandardMaterial color="#e6e2d8" />
            </mesh>
          ))}
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[1.8, 0.5, 0.9]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          {photos.map((p, i) => {
            const { x, south } = place(i);
            return <Frame key={p.src + i} p={p} pos={[x, 1.55, south ? 4.0 : -4.0]} rotY={south ? Math.PI : 0} onOpen={() => setOpen(i)} />;
          })}
          <RoomEnv intensity={0.4} />
          <Walker keys={keys} start={[s.x, 1.6, s.south ? 0.8 : -0.8]} yaw0={s.south ? 0 : Math.PI} bounds={[-18, 18, -3.4, 3.4]} speed={3.2} />
        </Stage3D>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 20px 80px" }}>
        <p>Prefer walls that don&apos;t move? <Link href="/worlds/still/gallery" style={{ textDecoration: "underline" }}>The hung gallery →</Link></p>
      </div>
      {open !== null && photos[open] ? (
        <Lightbox images={photos.map((g) => ({ src: g.src, alt: g.alt }))} index={open} onClose={() => setOpen(null)} onMove={setOpen} />
      ) : null}
      <WorldProof
        proves="Photography you can walk through: the same prints, hung in geometry, openable mid-stride."
        relatedHref="/worlds/nest"
        relatedName="NEST"
      />
    </div>
  );
}

export function StillNav({ current }: { current: string }) {
  return (
    <nav aria-label="STILL realities" style={{ display: "flex", gap: 2, alignItems: "center", background: "#0c0c0c", color: "#ececec", borderBottom: "1px solid #ececec", padding: "0 12px", overflowX: "auto" }}>
      <Link href="/worlds/still" style={{ padding: "12px 8px", letterSpacing: "0.2em", fontSize: 12, fontFamily: "var(--font-code)" }}>
        STILL◌
      </Link>
      {[
        ["classic", "Paper", "/worlds/still"],
      ].map(([id, label, href]) => (
        <WorldNavLink
          world="still"
          label={label}
          key={id}
          href={href}
          aria-current={current === id ? "page" : undefined}
          style={{
            padding: "12px 12px",
            fontSize: 12,
            letterSpacing: "0.1em",
            fontFamily: "var(--font-code)",
            color: current === id ? "#0c0c0c" : "#ececec",
            background: current === id ? "#ececec" : "transparent",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </WorldNavLink>
      ))}
    </nav>
  );
}
