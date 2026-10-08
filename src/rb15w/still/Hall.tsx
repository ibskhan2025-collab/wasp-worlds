"use client";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Stage3D, Walker, useKeySet } from "@/rb15l/three";
import { makePlateCanvas, type PlateKind } from "@/rb15l/plate";

export type Photo = { id: string; title: string; col: string; year: number; place: string; seed: number; kind: PlateKind; hue: number; land: boolean };

function Frame({ p, pos, rotY, onOpen }: { p: Photo; pos: [number, number, number]; rotY: number; onOpen: () => void }) {
  const tex = useMemo(() => { const t = new THREE.CanvasTexture(p.land ? makePlateCanvas(p.seed, p.kind, p.hue, 640, 480) : makePlateCanvas(p.seed, p.kind, p.hue, 480, 600)); t.colorSpace = THREE.SRGBColorSpace; return t; }, [p]);
  useEffect(() => () => tex.dispose(), [tex]);
  const w = p.land ? 2.4 : 1.7, h = p.land ? 1.8 : 2.1;
  return (
    <group position={pos} rotation={[0, rotY, 0]} onClick={(e) => { e.stopPropagation(); onOpen(); }} onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "")}>
      <mesh><boxGeometry args={[w + 0.16, h + 0.16, 0.06]} /><meshStandardMaterial color="#141414" /></mesh>
      <mesh position={[0, 0, 0.035]}><planeGeometry args={[w, h]} /><meshBasicMaterial map={tex} /></mesh>
      <mesh position={[0, -h / 2 - 0.35, 0.02]}><planeGeometry args={[0.7, 0.14]} /><meshBasicMaterial color="#d8d3c8" /></mesh>
      <spotLight position={[0, 1.6, 1.6]} angle={0.6} penumbra={0.7} intensity={12} target-position={[0, 0, 0]} />
    </group>
  );
}

export default function Hall({ photos, spot, onOpen }: { photos: Photo[]; spot: number; onOpen: (i: number) => void }) {
  const keys = useKeySet();
  const place = (i: number) => { const south = i % 2 === 1; return { x: -15 + Math.floor(i / 2) * 6, south }; };
  const s = place(Math.min(spot, photos.length - 1));
  return (
    <Stage3D className="h-full min-h-[480px] w-full" bg="#e9e6df" camera={[0, 1.6, 0]} fov={65} label="Virtual gallery hall. Walk with W A S D or arrow keys, drag to look, click a frame to open it.">
      <ambientLight intensity={1.1} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[40, 10]} /><meshStandardMaterial color="#b9a78c" roughness={0.5} /></mesh>
      <mesh position={[0, 2.25, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[40, 10]} /><meshStandardMaterial color="#f4f2ed" /></mesh>
      <mesh position={[0, 1.6, -4.1]}><planeGeometry args={[40, 4.5]} /><meshStandardMaterial color="#f1eee7" /></mesh>
      <mesh position={[0, 1.6, 4.1]} rotation={[0, Math.PI, 0]}><planeGeometry args={[40, 4.5]} /><meshStandardMaterial color="#f1eee7" /></mesh>
      {[-20, 20].map((x) => <mesh key={x} position={[x, 1.6, 0]} rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}><planeGeometry args={[10, 4.5]} /><meshStandardMaterial color="#e6e2d8" /></mesh>)}
      <mesh position={[0, 0.25, 0]}><boxGeometry args={[1.8, 0.5, 0.9]} /><meshStandardMaterial color="#222" /></mesh>
      {photos.map((p, i) => { const { x, south } = place(i); return <Frame key={p.id} p={p} pos={[x, 1.55, south ? 4.0 : -4.0]} rotY={south ? Math.PI : 0} onOpen={() => onOpen(i)} />; })}
      <Walker key={spot} keys={keys} start={[s.x, 1.6, s.south ? 0.8 : -0.8]} yaw0={s.south ? 0 : Math.PI} bounds={[-18, 18, -3.4, 3.4]} speed={3.2} />
    </Stage3D>
  );
}
