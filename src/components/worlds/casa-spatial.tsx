"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import { WorldExit } from "@/components/wasp/world-exit";
import { CasaNav } from "@/components/worlds/casa-realities";
import { CasaSubNav } from "@/components/worlds/casa-views";
import { WorldProof } from "@/components/worlds/world-proof";
import { Orbit } from "@/lib/three";

export type CasaTable = { id: string; x: number; z: number; seats: number; zone: string };

export const CASA_TABLES: CasaTable[] = [
  { id: "T1", x: -3.2, z: -2.2, seats: 2, zone: "Window" },
  { id: "T2", x: -3.2, z: 0.4, seats: 2, zone: "Window" },
  { id: "T3", x: -3.2, z: 3.0, seats: 4, zone: "Window" },
  { id: "T4", x: 0, z: -2.2, seats: 4, zone: "Dining room" },
  { id: "T5", x: 0, z: 0.8, seats: 6, zone: "Dining room" },
  { id: "T6", x: 0, z: 3.6, seats: 2, zone: "Dining room" },
  { id: "T7", x: 3.2, z: -1.6, seats: 2, zone: "Counter" },
  { id: "T8", x: 3.2, z: 1.2, seats: 2, zone: "Counter" },
];

function Table({ t, selected, onSelect }: { t: CasaTable; selected: boolean; onSelect: (id: string) => void }) {
  const [hover, setHover] = useState(false);
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const target = selected ? 0.12 : hover ? 0.06 : 0;
    ref.current.position.y += (target - ref.current.position.y) * 0.12;
    if (selected) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
  });
  const r = t.seats > 4 ? 0.95 : t.seats > 2 ? 0.72 : 0.55;
  return (
    <group
      ref={ref}
      position={[t.x, 0, t.z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(t.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "";
      }}
    >
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[r, r, 0.06, 32]} />
        <meshStandardMaterial color={selected ? "#c9803f" : hover ? "#a67a4e" : "#8d6748"} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.07, 0.11, 0.72, 12]} />
        <meshStandardMaterial color="#3a2f26" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.32, 0.34, 0.04, 16]} />
        <meshStandardMaterial color="#3a2f26" roughness={0.9} />
      </mesh>
      {Array.from({ length: t.seats }).map((_, i) => {
        const a = (i / t.seats) * Math.PI * 2;
        return (
          <group key={i} position={[Math.cos(a) * (r + 0.55), 0, Math.sin(a) * (r + 0.55)]} rotation={[0, -a, 0]}>
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[0.42, 0.06, 0.42]} />
              <meshStandardMaterial color="#6b5540" roughness={0.75} />
            </mesh>
            <mesh position={[0.18, 0.72, 0]}>
              <boxGeometry args={[0.06, 0.5, 0.4]} />
              <meshStandardMaterial color="#6b5540" roughness={0.75} />
            </mesh>
          </group>
        );
      })}
      {Array.from({ length: t.seats }).map((_, i) => {
        const a = (i / t.seats) * Math.PI * 2;
        return (
          <mesh key={`p${i}`} position={[Math.cos(a) * r * 0.55, 0.78, Math.sin(a) * r * 0.55]}>
            <cylinderGeometry args={[0.13, 0.12, 0.015, 20]} />
            <meshStandardMaterial color="#efe7db" roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

function Pendant({ x, z, warm }: { x: number; z: number; warm: number }) {
  const ref = useRef<Mesh>(null);
  useFrame((s) => {
    if (ref.current) ref.current.position.y = 2.1 + Math.sin(s.clock.elapsedTime * 0.7 + x) * 0.015;
  });
  return (
    <group position={[x, 0, z]}>
      <mesh ref={ref} position={[0, 2.1, 0]}>
        <coneGeometry args={[0.24, 0.3, 20, 1, true]} />
        <meshStandardMaterial color="#1c1c1c" side={2} />
      </mesh>
      <pointLight position={[0, 1.95, 0]} intensity={warm * 8} distance={6} color="#ffcf91" />
      <mesh position={[0, 1.96, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#ffd9a0" />
      </mesh>
    </group>
  );
}

function Room({ daylight }: { daylight: number }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#8a7458" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.8, -5.2]}>
        <boxGeometry args={[14, 3.6, 0.2]} />
        <meshStandardMaterial color="#e6dcc8" roughness={1} />
      </mesh>
      <mesh position={[-5.4, 1.8, 0]}>
        <boxGeometry args={[0.2, 3.6, 14]} />
        <meshStandardMaterial color="#e6dcc8" roughness={1} />
      </mesh>
      {[-3, 0, 3].map((z) => (
        <mesh key={z} position={[-5.28, 1.7, z]}>
          <boxGeometry args={[0.06, 1.8, 1.6]} />
          <meshBasicMaterial color={`rgb(${150 + daylight * 100}, ${170 + daylight * 80}, ${180 + daylight * 70})`} />
        </mesh>
      ))}
      <mesh position={[4.6, 0.55, 0]}>
        <boxGeometry args={[1.1, 1.1, 8]} />
        <meshStandardMaterial color="#4a3b2c" roughness={0.6} />
      </mesh>
      <mesh position={[4.6, 1.13, 0]}>
        <boxGeometry args={[1.25, 0.06, 8.1]} />
        <meshStandardMaterial color="#20201e" roughness={0.35} metalness={0.2} />
      </mesh>
    </group>
  );
}

export function CasaSpatial() {
  const [selected, setSelected] = useState<string | null>(null);
  const [daylight, setDaylight] = useState(0.2);
  const table = CASA_TABLES.find((t) => t.id === selected) ?? null;
  return (
    <div style={{ background: "#171310", color: "#e8e0d2", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="casa" label="Room 01 · CASA/SPATIAL" />
      <CasaNav current="spatial" />
      <CasaSubNav reality="spatial" current="house" />
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c9803f" }}>THE DINING ROOM, IN REAL GEOMETRY</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.6rem)", margin: "8px 0" }}>Pick your table.</h1>
        <p style={{ color: "#8a7f6e", maxWidth: "56ch" }}>
          Eight tables, three pendants, a west window. Click a table to claim it, drag to orbit, scroll to zoom.
        </p>
        <div style={{ height: 440, border: "1px solid rgba(232,224,210,0.25)", marginTop: 20 }}>
          <Canvas shadows camera={{ position: [7.5, 5.2, 8], fov: 42 }} dpr={[1, 1.8]}>
            <color attach="background" args={[daylight > 0.5 ? "#e3d9c6" : "#171310"]} />
            <hemisphereLight intensity={0.25 + daylight * 0.6} groundColor="#4a3b2c" color="#cfe3ff" />
            <directionalLight
              position={[-8, 6 + daylight * 4, 4]}
              intensity={0.3 + daylight * 1.4}
              color={daylight > 0.5 ? "#fff6e2" : "#7aa6ff"}
            />
            <Room daylight={daylight} />
            {[-2.5, 0.5, 3.2].map((z) => (
              <Pendant key={z} x={0} z={z} warm={1 - daylight * 0.75} />
            ))}
            {CASA_TABLES.map((t) => (
              <Table key={t.id} t={t} selected={selected === t.id} onSelect={setSelected} />
            ))}
            <Orbit target={[0, 0.8, 0]} min={5} max={16} maxPolar={Math.PI / 2.15} />
          </Canvas>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, flex: 1, minWidth: 220 }}>
            Light
            <input type="range" min={0} max={1} step={0.01} value={daylight} onChange={(e) => setDaylight(Number(e.target.value))} aria-label="Daylight" style={{ flex: 1 }} />
          </label>
          <span style={{ fontSize: 12, color: "#c9803f", letterSpacing: "0.2em" }}>
            {daylight < 0.35 ? "EVENING SERVICE" : daylight < 0.7 ? "GOLDEN HOUR" : "LUNCH"}
          </span>
        </div>
        {table ? (
          <div className="panel" style={{ marginTop: 16 }}>
            <strong style={{ fontSize: "1.3rem" }}>
              {table.id} · {table.zone} · seats {table.seats}
            </strong>
            <p style={{ margin: "8px 0 0" }}>
              <Link href="/worlds/casa/spatial/reservations" style={{ background: "#c9803f", color: "#171310", padding: "10px 20px", fontWeight: 700, fontSize: 12, letterSpacing: "0.15em" }}>
                RESERVE {table.id} →
              </Link>
            </p>
          </div>
        ) : (
          <p style={{ color: "#8a7f6e", fontSize: "0.9rem" }}>No table claimed yet. The room doesn&apos;t mind, but the kitchen prefers commitment.</p>
        )}
        <div style={{ marginTop: 24 }}>
          <p className="kicker">All tables</p>
          {CASA_TABLES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelected(t.id)}
              aria-pressed={selected === t.id}
              className={selected === t.id ? "chip-on" : "chip"}
              style={{ margin: "0 8px 8px 0" }}
            >
              {t.id} · {t.zone} · {t.seats}
            </button>
          ))}
        </div>
      </div>
      <WorldProof
        proves="The dining room as geometry: eight claimable tables, real light, straight into a real reservation."
        relatedHref="/worlds/nest"
        relatedName="NEST"
      />
    </div>
  );
}
