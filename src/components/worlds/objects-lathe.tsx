"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Orbit, RoomEnv, Stage3D } from "@/lib/three";
import type { WorkshopObj } from "@/data/objects-workshop";

export function Lathe({ o, scale = 1, spin = 0.3, pos = [0, 0, 0] as [number, number, number], onClick, hl }: { o: WorkshopObj; scale?: number; spin?: number; pos?: [number, number, number]; onClick?: () => void; hl?: boolean }) {
  const pts = useMemo(() => o.profile.map(([r, y]) => new THREE.Vector2(r, y)), [o]);
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * spin;
  });
  return (
    <group
      position={pos}
      scale={scale}
      ref={g}
      onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}
      onPointerOver={onClick ? () => { document.body.style.cursor = "pointer"; } : undefined}
      onPointerOut={onClick ? () => { document.body.style.cursor = ""; } : undefined}
    >
      <mesh castShadow>
        <latheGeometry args={[pts, 56]} />
        <meshPhysicalMaterial color={o.color} metalness={o.metal} roughness={o.rough} transparent={!!o.glass} opacity={o.glass ? 0.6 : 1} side={THREE.DoubleSide} clearcoat={o.glass ? 1 : 0} emissive={hl ? "#ffffff" : "#000"} emissiveIntensity={hl ? 0.08 : 0} />
      </mesh>
    </group>
  );
}

export function Viewer({ o }: { o: WorkshopObj }) {
  return (
    <Stage3D bg="#e8e0d2" camera={[2.4, 1.8, 3.2]} fov={35} label={`3D view of ${o.name}. Drag to rotate.`}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 3]} intensity={1.6} />
      <RoomEnv intensity={0.9} />
      <Lathe o={o} scale={1.4} spin={0.25} pos={[0, -o.h * 0.7, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -o.h * 0.7, 0]}>
        <circleGeometry args={[3, 40]} />
        <meshStandardMaterial color="#d9cfbd" roughness={1} />
      </mesh>
      <Orbit min={2} max={8} maxPolar={Math.PI / 2.05} />
    </Stage3D>
  );
}

export default function Shelf({ items, sel, onSel }: { items: WorkshopObj[]; sel: string | null; onSel: (id: string) => void }) {
  const pos = (i: number): [number, number, number] => [(i - (items.length - 1) / 2) * 1.6, 0.0, 0];
  const p = items.find((x) => x.id === sel);
  const focus = p
    ? { pos: [pos(items.indexOf(p))[0], 1.2, 3.2] as [number, number, number], target: [pos(items.indexOf(p))[0], 0.5, 0] as [number, number, number] }
    : { pos: [0, 2.4, 9.5] as [number, number, number], target: [0, 0.7, 0] as [number, number, number] };
  return (
    <Stage3D bg="#dcd2c0" camera={[0, 2.4, 9.5]} fov={40} label="3D shelf of objects. Tap an object to inspect it.">
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} />
      <RoomEnv intensity={0.8} />
      {items.map((o, i) => (
        <Lathe key={o.id} o={o} pos={pos(i)} spin={sel === o.id ? 0.8 : 0.1} hl={sel === o.id} onClick={() => onSel(o.id)} />
      ))}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[items.length * 1.6 + 1, 0.1, 1.8]} />
        <meshStandardMaterial color="#8a6a48" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.5, -1.1]}>
        <planeGeometry args={[40, 10]} />
        <meshStandardMaterial color="#e9e1d1" />
      </mesh>
      <Orbit focus={focus} min={2} max={16} maxPolar={Math.PI / 2.05} target={[0, 0.7, 0]} />
    </Stage3D>
  );
}
