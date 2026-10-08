"use client";
import { useMemo, useRef, useState } from "react";
import { Orbit, RoomEnv, Stage3D, Walker, useKeySet } from "@/rb15l/three";
import { GAPS, HH, HW, ROOMS, wallSegments, type Mat } from "./plan";

type V3 = [number, number, number];
const T = 0.14;
export default function House3D({ floors, wall, clad, sel, onSel, walk, cut, tod }: { floors: Record<string, Mat>; wall: Mat; clad: Mat; sel: string; onSel: (id: string) => void; walk: boolean; cut: boolean; tod: number }) {
  const keys = useKeySet();
  const segs = useMemo(wallSegments, []);
  const H = cut ? 0.35 : 2.7;
  const boxes = useMemo(() => segs.map((s) => { const len = s.a1 - s.a0, mid = (s.a0 + s.a1) / 2; return s.axis === "y" ? { p: [mid - HW / 2, 0, s.c - HH / 2] as V3, d: [len, T] as [number, number], ext: !!s.ext, x0: s.a0, x1: s.a1, z0: s.c - T, z1: s.c + T, ax: "y" as const } : { p: [s.c - HW / 2, 0, mid - HH / 2] as V3, d: [T, len] as [number, number], ext: !!s.ext, x0: s.c - T, x1: s.c + T, z0: s.a0, z1: s.a1, ax: "x" as const }; }), [segs]);
  const blocked = (x: number, z: number) => { const px = x + HW / 2, pz = z + HH / 2, r = 0.28; return boxes.some((b) => (b.ax === "y" ? px > b.x0 - r && px < b.x1 + r && Math.abs(pz - (b.z0 + T)) < T / 2 + r : Math.abs(px - (b.x0 + T)) < T / 2 + r && pz > b.z0 - r && pz < b.z1 + r)); };
  const r = ROOMS.find((q) => q.id === sel)!;
  const cx = r.x + r.w / 2 - HW / 2, cz = r.y + r.h / 2 - HH / 2;
  const focus = useMemo(() => ({ pos: [cx + 2, walk ? 1.6 : 5.5, cz + 5] as V3, target: [cx, 0.5, cz] as V3 }), [cx, cz, walk]);
  const sunAng = tod * Math.PI, sun = Math.max(0.05, Math.sin(sunAng));
  const bg = tod < 0.12 || tod > 0.88 ? "#f0a070" : tod < 0.5 ? "#a9cde6" : "#a9cde6";
  const light = useRef(null);
  void light;
  const gl = GAPS;
  return (
    <Stage3D className="h-full w-full" shadows bg={bg} camera={[12, 10, 14]} fov={45} label="3D house. Orbit with the pointer, or use walk mode with W A S D. Room buttons move the camera.">
      <ambientLight intensity={0.35 + sun * 0.4} /><RoomEnv intensity={0.3} />
      <directionalLight castShadow position={[Math.cos(sunAng) * 14, 12 * sun + 2, 6]} intensity={1.2 + sun * 2} color={tod < 0.15 || tod > 0.85 ? "#ffb070" : "#fff6e6"} shadow-mapSize={[2048, 2048]} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-14} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow><planeGeometry args={[80, 80]} /><meshStandardMaterial color="#8da07c" roughness={1} /></mesh>
      {ROOMS.map((q) => (
        <mesh key={q.id} rotation={[-Math.PI / 2, 0, 0]} position={[q.x + q.w / 2 - HW / 2, 0.01, q.y + q.h / 2 - HH / 2]} receiveShadow onClick={(e) => { e.stopPropagation(); onSel(q.id); }}>
          <planeGeometry args={[q.w, q.h]} /><meshStandardMaterial color={floors[q.id].color} roughness={floors[q.id].rough} emissive={sel === q.id ? "#3d6b5a" : "#000"} emissiveIntensity={0.35} /></mesh>))}
      {boxes.map((b, i) => <mesh key={i} position={[b.p[0], H / 2, b.p[2]]} castShadow receiveShadow><boxGeometry args={[b.d[0], H, b.d[1]]} /><meshStandardMaterial color={b.ext ? clad.color : wall.color} roughness={b.ext ? clad.rough : wall.rough} /></mesh>)}
      {gl.map((g, i) => { const len = g.a1 - g.a0, mid = (g.a0 + g.a1) / 2; const p: V3 = g.axis === "y" ? [mid - HW / 2, 0, g.c - HH / 2] : [g.c - HW / 2, 0, mid - HH / 2]; const d: [number, number] = g.axis === "y" ? [len, 0.04] : [0.04, len]; return g.kind === "glass" ? <mesh key={i} position={[p[0], H / 2, p[2]]}><boxGeometry args={[d[0], H, d[1]]} /><meshPhysicalMaterial color="#bfe0f0" transparent opacity={0.28} roughness={0.05} /></mesh> : <mesh key={i} position={[p[0], Math.min(H, 2.7) - 0.3, p[2]]} castShadow><boxGeometry args={[g.axis === "y" ? len : T, 0.6 * (cut ? 0 : 1) + 0.001, g.axis === "y" ? T : len]} /><meshStandardMaterial color={wall.color} /></mesh>; })}
      {!cut && <mesh position={[0, 2.78, 0]} castShadow><boxGeometry args={[HW + 0.6, 0.16, HH + 0.6]} /><meshStandardMaterial color={clad.id === "zinc" ? "#6f767c" : "#555"} roughness={0.6} /></mesh>}
      {walk ? <Walker key={sel} keys={keys} start={[cx, 1.6, cz]} yaw0={0} bounds={[-5.7, 5.7, -4.2, 4.2]} speed={2.6} blocked={blocked} /> : <Orbit target={[0, 0.5, 0]} min={3} max={30} maxPolar={Math.PI / 2.05} focus={focus} />}
    </Stage3D>
  );
}
export function useSel() { return useState("living"); }
