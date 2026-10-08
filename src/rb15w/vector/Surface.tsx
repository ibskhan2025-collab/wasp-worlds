"use client";
import { useState } from "react";
import { Orbit, RoomEnv, Stage3D } from "@/rb15l/three";

export type Ser = { id: string; name: string; color: string; vals: number[] };
export default function Surface({ series, labels, on }: { series: Ser[]; labels: string[]; on: Record<string, boolean> }) {
  const [hov, setHov] = useState<{ s: string; q: number } | null>(null);
  const vis = series.filter((s) => on[s.id]);
  const max = Math.max(...series.flatMap((s) => s.vals));
  return (
    <div className="relative h-full w-full">
      <Stage3D className="h-full w-full" bg="#04100c" camera={[9, 7, 11]} fov={40} label="3D surface of index value by quarter and strategy. Drag to rotate. A data table is available below.">
        <ambientLight intensity={0.5} /><directionalLight position={[6, 10, 6]} intensity={1.8} /><RoomEnv intensity={0.3} />
        <gridHelper args={[16, 16, "#1f5e46", "#0f2f24"]} />
        {vis.map((s, si) => s.vals.map((v, q) => { const h = Math.max(0.05, ((v - 80) / (max - 80)) * 5); const x = (q - 6.5) * 0.9, z = (si - (vis.length - 1) / 2) * 1.6; return (
          <mesh key={s.id + q} position={[x, h / 2, z]} onPointerOver={(e) => { e.stopPropagation(); setHov({ s: s.id, q }); }} onPointerOut={() => setHov(null)}>
            <boxGeometry args={[0.7, h, 1.1]} /><meshStandardMaterial color={s.color} emissive={hov?.s === s.id && hov.q === q ? "#ffffff" : s.color} emissiveIntensity={hov?.s === s.id && hov.q === q ? 0.6 : 0.12} roughness={0.35} metalness={0.3} /></mesh>); }))}
        <Orbit min={5} max={26} target={[0, 1.5, 0]} auto={0.3} maxPolar={Math.PI / 2.05} />
      </Stage3D>
      <div className="pointer-events-none absolute left-3 top-3 border border-[#2cff9a]/40 bg-black/70 px-3 py-2 font-mono text-xs" aria-live="polite">{hov ? (() => { const s = series.find((x) => x.id === hov.s)!; return `${s.name} · ${labels[hov.q]} · ${s.vals[hov.q].toFixed(1)}`; })() : "Hover a bar · bars are index value (start = 100)"}</div>
    </div>
  );
}
