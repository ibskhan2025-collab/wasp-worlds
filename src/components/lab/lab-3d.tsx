"use client";

import { useMemo } from "react";
import { Orbit, RoomEnv, Stage3D } from "@/lib/three";
import { rng } from "@/lib/plate";

export default function Lab3D({ w, d, h, items, seed, wall }: { w: number; d: number; h: number; items: number; seed: number; wall: string }) {
  const furn = useMemo(() => { const R = rng(seed * 991 + 3); return Array.from({ length: items }, () => ({ x: (R() - 0.5) * (w - 1.2), z: (R() - 0.5) * (d - 1.2), s: [0.4 + R() * 0.9, 0.3 + R() * 1.1, 0.4 + R() * 0.9] as [number, number, number], c: `hsl(${Math.floor(R() * 360)},35%,${45 + Math.floor(R() * 25)}%)` })); }, [w, d, items, seed]);
  return (
    <Stage3D className="h-full w-full" bg="#15151a" camera={[w * 0.9, h * 1.6, d * 1.2]} fov={45} label="Procedurally generated 3D room. Drag to orbit.">
      <ambientLight intensity={0.6} /><directionalLight position={[5, 8, 4]} intensity={1.6} /><RoomEnv intensity={0.4} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w, d]} /><meshStandardMaterial color="#8a6a48" roughness={0.7} /></mesh>
      {[[0, h / 2, -d / 2, w, h, 0.1], [-w / 2, h / 2, 0, 0.1, h, d]].map(([x, y, z, a, b, c], i) => <mesh key={i} position={[x, y, z]}><boxGeometry args={[a, b, c]} /><meshStandardMaterial color={wall} roughness={0.9} /></mesh>)}
      {furn.map((f, i) => <mesh key={i} position={[f.x, f.s[1] / 2, f.z]}><boxGeometry args={f.s} /><meshStandardMaterial color={f.c} roughness={0.6} /></mesh>)}
      <Orbit min={2} max={30} maxPolar={Math.PI / 2.05} target={[0, h / 3, 0]} auto={0.5} />
    </Stage3D>
  );
}
