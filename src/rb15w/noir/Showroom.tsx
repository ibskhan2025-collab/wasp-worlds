"use client";
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Orbit, RoomEnv, Stage3D } from "@/rb15l/three";
import { PRODUCTS, SIL, BuyBox, type Product } from "./data";

type V3 = [number, number, number];
function useShape(p: Product) {
  return useMemo(() => {
    const pts = SIL[p.sil];
    const s = new THREE.Shape();
    pts.forEach(([x, y], i) => (i ? s.lineTo((x - 50) / 28, (64 - y) / 28) : s.moveTo((x - 50) / 28, (64 - y) / 28)));
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.22, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 3, curveSegments: 4 });
  }, [p]);
}

function Piece({ p, pos, sel, onPick }: { p: Product; pos: V3; sel: boolean; onPick: () => void }) {
  const geo = useShape(p);
  const g = useRef<THREE.Group>(null);
  const [h, setH] = useState(false);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * (sel ? 0.9 : h ? 0.4 : 0.12); });
  return (
    <group position={pos} onClick={(e) => { e.stopPropagation(); onPick(); }} onPointerOver={(e) => { e.stopPropagation(); setH(true); document.body.style.cursor = "pointer"; }} onPointerOut={() => { setH(false); document.body.style.cursor = ""; }}>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.9, 1, 0.6, 40]} /><meshStandardMaterial color="#111" roughness={0.35} metalness={0.4} /></mesh>
      <mesh position={[0, 0.61, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.86, 0.9, 48]} /><meshBasicMaterial color={sel ? "#b89b6a" : "#444"} /></mesh>
      <group ref={g} position={[0, 2.35, 0]}><mesh geometry={geo} position={[0, 0, -0.11]} castShadow><meshStandardMaterial color={p.color === "#1b1b1b" || p.color === "#151515" || p.color === "#0f0f0f" || p.color === "#232323" ? "#2a2a2c" : p.color} roughness={0.5} metalness={0.15} emissive={sel ? "#b89b6a" : "#000"} emissiveIntensity={0.12} /></mesh></group>
      <spotLight position={[0, 6, 2]} angle={0.35} penumbra={0.8} intensity={sel ? 90 : 45} target-position={[0, 2, 0]} color="#fff2dc" />
    </group>
  );
}

export default function Showroom({ onAdd, wished, onWish, btn, ghost }: { onAdd: (p: Product, size: string, qty: number) => void; wished: (id: string) => boolean; onWish: (id: string) => void; btn: string; ghost: string }) {
  const [sel, setSel] = useState<string | null>(null);
  const pos = (i: number): V3 => { const a = (i / (PRODUCTS.length - 1) - 0.5) * 2.4; return [Math.sin(a) * 7, 0, -Math.cos(a) * 7 + 5]; };
  const p = PRODUCTS.find((x) => x.id === sel);
  const i = p ? PRODUCTS.indexOf(p) : -1;
  const focus = p ? { pos: [pos(i)[0] * 0.75, 2.6, pos(i)[2] + 4.2] as V3, target: [pos(i)[0], 2.3, pos(i)[2]] as V3 } : null;
  return (
    <div className="grid min-h-[calc(100vh-88px)] bg-black text-[#eee9e0] lg:grid-cols-[1fr_360px]">
      <div className="relative min-h-[60vh]">
        <Stage3D className="absolute inset-0" bg="#050505" camera={[0, 3.4, 12]} label="3D showroom. Choose pieces from the list if you prefer not to use the pointer.">
          <fog attach="fog" args={["#050505", 10, 26]} />
          <ambientLight intensity={0.15} />
          <RoomEnv intensity={0.25} />
          <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[60, 60]} /><meshStandardMaterial color="#0c0c0d" roughness={0.25} metalness={0.7} /></mesh>
          {PRODUCTS.map((pr, k) => <Piece key={pr.id} p={pr} pos={pos(k)} sel={sel === pr.id} onPick={() => setSel(pr.id)} />)}
          <Orbit target={[0, 2, 0]} min={3} max={18} maxPolar={Math.PI / 2.1} focus={focus} />
        </Stage3D>
        <p className="pointer-events-none absolute left-3 top-3 font-mono text-[11px] uppercase tracking-[0.15em] text-white/70">Drag to orbit · click a piece · pieces are extruded from the same silhouettes as the shop</p>
      </div>
      <aside className="border-t border-white/10 p-5 lg:border-l lg:border-t-0" aria-label="Selected piece">
        <ul className="grid grid-cols-3 gap-1" aria-label="Pieces">{PRODUCTS.map((pr) => <li key={pr.id}><button aria-pressed={sel === pr.id} onClick={() => setSel(pr.id)} className={"w-full border px-2 py-2 text-left text-[11px] " + (sel === pr.id ? "border-[#b89b6a] text-[#b89b6a]" : "border-white/20 hover:bg-white/10")}>{pr.name}</button></li>)}</ul>
        {!p ? <p className="mt-6 text-sm leading-relaxed text-white/60">Nine pieces on nine pedestals. Select one to bring it forward, read what it is made of, choose a size and add it to the same bag the shop uses.</p> : (
          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#b89b6a]">{p.cat}</p>
            <h2 className="mt-1 text-4xl" style={{ fontFamily: "'Bodoni Moda Variable', serif" }}>{p.name}</h2>
            <p className="mt-1 text-xl">£{p.price}</p>
            <p className="mt-3 text-sm text-white/70">{p.desc}</p><p className="mt-2 text-xs text-white/50">{p.fabric}</p>
            <div className="mt-5"><BuyBox key={p.id} p={p} onAdd={(s, q) => onAdd(p, s, q)} btn={btn} ghost={ghost} wished={wished(p.id)} onWish={() => onWish(p.id)} /></div>
          </div>
        )}
      </aside>
    </div>
  );
}
