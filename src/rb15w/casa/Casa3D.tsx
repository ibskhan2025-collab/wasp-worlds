"use client";
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Orbit, RoomEnv, Stage3D, Walker, useKeySet } from "@/rb15l/three";
import { DISHES, TABLES, DishArt } from "./data";
import Reserve from "./Reserve";

type V3 = [number, number, number];
const MOODS = {
  golden: { name: "Golden hour", bg: "#e8b98a", amb: 0.85, sun: 1.6, lamp: 0.4, floor: "#8a5a34", wall: "#c9734a" },
  dusk: { name: "Dusk", bg: "#2a2240", amb: 0.35, sun: 0.25, lamp: 1.3, floor: "#5a3a24", wall: "#7a3a2e" },
  candle: { name: "Candlelight", bg: "#0e0705", amb: 0.1, sun: 0, lamp: 2.4, floor: "#3d2616", wall: "#4a2418" },
};
type Mood = keyof typeof MOODS;

function Plate({ color, accent, spin }: { color: string; accent: string; spin: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (spin && g.current) g.current.rotation.y += dt * 0.8; });
  return (
    <group ref={g} position={[0, 0.82, 0]}>
      <mesh><cylinderGeometry args={[0.42, 0.34, 0.05, 32]} /><meshStandardMaterial color="#f4efe4" roughness={0.3} /></mesh>
      <mesh position={[0, 0.05, 0]}><sphereGeometry args={[0.2, 20, 12, 0, 6.3, 0, 1.5]} /><meshStandardMaterial color={color} roughness={0.7} /></mesh>
      <mesh position={[0.14, 0.05, 0.08]}><sphereGeometry args={[0.1, 16, 10]} /><meshStandardMaterial color={accent} roughness={0.6} /></mesh>
      <mesh position={[-0.13, 0.04, -0.1]}><sphereGeometry args={[0.07, 14, 10]} /><meshStandardMaterial color="#5f7d2c" roughness={0.8} /></mesh>
    </group>
  );
}

function Table({ t, sel, hover, setHover, onPick, dishIdx, mood }: { t: (typeof TABLES)[number]; sel: boolean; hover: boolean; setHover: (b: boolean) => void; onPick: () => void; dishIdx: number; mood: (typeof MOODS)[Mood] }) {
  const d = DISHES[dishIdx];
  const chairs = useMemo(() => Array.from({ length: t.seats }, (_, i) => { const a = (i / t.seats) * Math.PI * 2; return { a, x: Math.cos(a) * 0.95, z: Math.sin(a) * 0.95 }; }), [t.seats]);
  const r = t.seats > 4 ? 0.95 : 0.75;
  return (
    <group position={t.pos} onClick={(e) => { e.stopPropagation(); onPick(); }} onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }} onPointerOut={() => { setHover(false); document.body.style.cursor = ""; }}>
      <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.08, 0.14, 0.78, 12]} /><meshStandardMaterial color="#2a1a10" /></mesh>
      <mesh position={[0, 0.78, 0]}><cylinderGeometry args={[r, r, 0.05, 40]} /><meshStandardMaterial color={sel || hover ? "#f2dcc0" : "#e7d4b8"} roughness={0.55} emissive={sel ? "#ff9a4a" : hover ? "#6a3a1a" : "#000"} emissiveIntensity={sel ? 0.35 : 0.3} /></mesh>
      <Plate color={d.color} accent={d.accent} spin={sel} />
      {chairs.map((c, i) => (
        <group key={i} position={[c.x * (r / 0.75 + 0.15), 0, c.z * (r / 0.75 + 0.15)]} rotation={[0, -c.a - Math.PI / 2, 0]}>
          <mesh position={[0, 0.45, 0]}><boxGeometry args={[0.4, 0.05, 0.4]} /><meshStandardMaterial color="#3a2414" /></mesh>
          <mesh position={[0, 0.72, -0.19]}><boxGeometry args={[0.4, 0.5, 0.04]} /><meshStandardMaterial color="#3a2414" /></mesh>
          {[[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].map(([x, z], k) => <mesh key={k} position={[x, 0.22, z]}><boxGeometry args={[0.04, 0.44, 0.04]} /><meshStandardMaterial color="#2a1a10" /></mesh>)}
        </group>
      ))}
      <mesh position={[0, 2.6, 0]}><cylinderGeometry args={[0.04, 0.04, 1.6, 6]} /><meshBasicMaterial color="#222" /></mesh>
      <mesh position={[0, 1.78, 0]}><coneGeometry args={[0.32, 0.3, 24, 1, true]} /><meshStandardMaterial color="#d9a24a" emissive="#ffb35a" emissiveIntensity={mood.lamp * 0.6} side={THREE.DoubleSide} /></mesh>
      <pointLight position={[0, 1.6, 0]} intensity={mood.lamp * 2.4} distance={5} color="#ffb870" />
    </group>
  );
}

function Room({ mood }: { mood: (typeof MOODS)[Mood] }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[16, 12]} /><meshStandardMaterial color={mood.floor} roughness={0.75} /></mesh>
      {[[0, 2, -6, 16, 4, 0.2], [-8, 2, 0, 0.2, 4, 12], [8, 2, 0, 0.2, 4, 12]].map(([x, y, z, w, h, d], i) => <mesh key={i} position={[x, y, z]}><boxGeometry args={[w, h, d]} /><meshStandardMaterial color={mood.wall} roughness={0.95} /></mesh>)}
      {[-6, -3, 0].map((z) => <mesh key={z} position={[-7.88, 2, z - 0.5]}><boxGeometry args={[0.1, 2.4, 1.6]} /><meshStandardMaterial color="#ffdca8" emissive="#ffcf8a" emissiveIntensity={mood.sun * 0.5} /></mesh>)}
      <mesh position={[0, 0.9, 5.4]}><boxGeometry args={[8, 1.1, 0.7]} /><meshStandardMaterial color="#2a1a10" roughness={0.5} /></mesh>
      <mesh position={[0, 2.6, 5.9]}><boxGeometry args={[7, 0.06, 0.4]} /><meshStandardMaterial color="#6a4020" /></mesh>
      <directionalLight position={[-6, 6, 2]} intensity={mood.sun} color="#ffd9a0" />
    </group>
  );
}

export default function Casa3D() {
  const [mood, setMood] = useState<Mood>("dusk");
  const [sel, setSel] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [walk, setWalk] = useState(false);
  const [idx, setIdx] = useState<Record<string, number>>(() => Object.fromEntries(TABLES.map((t) => [t.id, DISHES.findIndex((d) => d.id === t.dish)])));
  const [book, setBook] = useState(false);
  const keys = useKeySet();
  const m = MOODS[mood];
  const t = TABLES.find((x) => x.id === sel);
  const dish = t ? DISHES[idx[t.id]] : null;
  const focus = useMemo(() => (t ? { pos: [t.pos[0] + 1.8, 2.1, t.pos[2] + 2.4] as V3, target: [t.pos[0], 0.8, t.pos[2]] as V3 } : null), [t]);
  const pick = (id: string) => { setSel(id); setWalk(false); setBook(false); };

  return (
    <div className="grid min-h-[calc(100vh-88px)] bg-[#120a06] text-[#f4e6d0] lg:grid-cols-[1fr_380px]" style={{ fontFamily: "'Inter Variable', sans-serif" }}>
      <div className="relative min-h-[60vh] lg:min-h-0">
        <Stage3D className="absolute inset-0" bg={m.bg} camera={[9, 7, 10]} label="Explorable 3D restaurant. Use the table list to navigate without the mouse.">
          <fog attach="fog" args={[m.bg, 14, 34]} />
          <ambientLight intensity={m.amb} />
          <RoomEnv intensity={mood === "golden" ? 0.35 : 0.08} />
          <Room mood={m} />
          {TABLES.map((tb) => <Table key={tb.id} t={tb} sel={sel === tb.id} hover={hover === tb.id} setHover={(b) => setHover(b ? tb.id : null)} onPick={() => pick(tb.id)} dishIdx={idx[tb.id]} mood={m} />)}
          {walk ? <Walker keys={keys} start={[0, 1.6, 8]} bounds={[-7, 7, -5, 9]} /> : <Orbit target={[0, 0.5, 0]} min={3} max={22} maxPolar={Math.PI / 2.05} focus={focus} />}
        </Stage3D>
        <div className="pointer-events-none absolute left-3 top-3 max-w-[70%] font-mono text-[11px] uppercase tracking-[0.15em] text-white/80 [text-shadow:0_1px_6px_#000]">
          {walk ? "Walk: WASD / arrows · drag to look" : "Orbit: drag · scroll · tap a table"}
        </div>
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
          {(Object.keys(MOODS) as Mood[]).map((k) => (
            <button key={k} aria-pressed={mood === k} onClick={() => setMood(k)} className={"rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur " + (mood === k ? "border-[#d9763a] bg-[#d9763a] text-black" : "border-white/30 bg-black/50")}>{MOODS[k].name}</button>
          ))}
          <button aria-pressed={walk} onClick={() => setWalk(!walk)} className={"rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur " + (walk ? "border-white bg-white text-black" : "border-white/30 bg-black/50")}>{walk ? "Exit walk" : "Walk the room"}</button>
        </div>
      </div>
      <aside className="border-t border-white/10 p-5 lg:overflow-auto lg:border-l lg:border-t-0" aria-label="Table details">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#d9763a]">CASA · 3D dining room</p>
        <ul className="mt-3 grid grid-cols-3 gap-1.5" aria-label="Tables">
          {TABLES.map((tb) => <li key={tb.id}><button onClick={() => pick(tb.id)} aria-pressed={sel === tb.id} className={"w-full border px-2 py-2 text-left text-xs " + (sel === tb.id ? "border-[#d9763a] bg-[#d9763a]/20" : "border-white/20 hover:bg-white/10")}><b>{tb.id}</b><br /><span className="opacity-60">{tb.seats} seats</span></button></li>)}
        </ul>
        {!t || !dish ? (
          <p className="mt-6 text-sm leading-relaxed text-white/70">Nobody is seated yet. Click a table in the room — or pick one above — to fly the camera to it, inspect what&apos;s on the plate, change the dish and choose the table for your reservation.</p>
        ) : (
          <div className="mt-5">
            <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Fraunces Variable', serif" }}>{t.label}</h2>
            <p className="mt-1 text-sm text-white/70">{t.seats} seats. {t.note}</p>
            <div className="mt-4 flex items-center gap-4 border border-white/15 p-3">
              <DishArt d={dish} className="h-24 w-24 shrink-0" />
              <div><p className="font-semibold">{dish.name}</p><p className="text-sm text-white/60">£{dish.price} · {dish.course}</p><p className="mt-1 text-xs text-white/60">{dish.desc}</p></div>
            </div>
            <div className="mt-2 flex gap-2">
              <button className="flex-1 border border-white/25 py-2 text-sm hover:bg-white/10" onClick={() => setIdx({ ...idx, [t.id]: (idx[t.id] + DISHES.length - 1) % DISHES.length })}>← Previous dish</button>
              <button className="flex-1 border border-white/25 py-2 text-sm hover:bg-white/10" onClick={() => setIdx({ ...idx, [t.id]: (idx[t.id] + 1) % DISHES.length })}>Next dish →</button>
            </div>
            <p className="mt-3 text-sm italic text-white/60">{dish.story}</p>
            {!book ? <button onClick={() => setBook(true)} className="mt-5 w-full bg-[#d9763a] py-3 font-semibold text-black">Choose {t.id} and reserve</button> : (
              <div className="mt-5">
                <Reserve table={t.label} onClearTable={() => setBook(false)} skin={{ input: "border-white/30", btn: "bg-[#d9763a] text-black border-[#d9763a]", card: "border border-white/20", muted: "text-white/60" }} />
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
