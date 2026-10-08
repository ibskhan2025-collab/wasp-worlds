"use client";
import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Orbit, RoomEnv, Stage3D } from "@/rb15l/three";
import { FINISH_COLOR, type Part, type V } from "./parts";

function Mat({ finish, plane }: { finish: string; plane: THREE.Plane | null }) {
  const [c, r] = FINISH_COLOR[finish] ?? ["#aaa", 0.3];
  return <meshStandardMaterial color={c} metalness={1} roughness={r} side={THREE.DoubleSide} clippingPlanes={plane ? [plane] : []} clipShadows />;
}

function Body({ part, v, finish, plane, scale }: { part: Part; v: V; finish: string; plane: THREE.Plane | null; scale: number }) {
  const m = <Mat finish={finish} plane={plane} />;
  const lathe = (pts: [number, number][]) => <mesh rotation={[Math.PI / 2, 0, 0]}><latheGeometry args={[pts.map(([r, y]) => new THREE.Vector2(r, y)), 64]} />{m}</mesh>;
  const gear = useMemo(() => {
    if (part.kind !== "gear") return null;
    const z = v.teeth, mod = 2, rp = (z * mod) / 2, r0 = rp - 1.25 * mod, r1 = rp + mod, s = new THREE.Shape();
    for (let i = 0; i < z; i++) { const a = (i / z) * Math.PI * 2, da = (Math.PI * 2) / z; [[0.05, r0], [0.22, r1], [0.5, r1], [0.68, r0], [0.95, r0]].forEach(([f, r], k) => { const x = Math.cos(a + f * da) * r, y = Math.sin(a + f * da) * r; i === 0 && k === 0 ? s.moveTo(x, y) : s.lineTo(x, y); }); }
    s.closePath(); const h = new THREE.Path(); h.absarc(0, 0, 5, 0, Math.PI * 2, true); s.holes.push(h);
    return new THREE.ExtrudeGeometry(s, { depth: v.w, bevelEnabled: false });
  }, [part.kind, v.teeth, v.w]);
  const bracket = useMemo(() => {
    if (part.kind !== "bracket") return null;
    const { leg, t, w } = v; const s = new THREE.Shape(); [[0, 0], [leg, 0], [leg, t], [t, t], [t, leg], [0, leg]].forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
    return new THREE.ExtrudeGeometry(s, { depth: w, bevelEnabled: false });
  }, [part.kind, v]);
  const k = part.kind;
  return (
    <group scale={scale}>
      {k === "bolt" && <><mesh position={[0, v.d * 0.325, 0]}><cylinderGeometry args={[v.d * 0.8, v.d * 0.8, v.d * 0.65, 6]} />{m}</mesh><mesh position={[0, -v.len / 2, 0]}><cylinderGeometry args={[v.d / 2, v.d / 2, v.len, 40]} />{m}</mesh>{Array.from({ length: Math.floor(v.len / 2.5) }, (_, i) => <mesh key={i} position={[0, -i * 2.5 - 1, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[v.d / 2, 0.22, 4, 24]} /><meshStandardMaterial color="#444" metalness={1} roughness={0.6} /></mesh>)}</>}
      {k === "shaft" && <group rotation={[0, 0, Math.PI / 2]}><mesh><cylinderGeometry args={[v.d / 2, v.d / 2, v.len * 0.8, 48]} />{m}</mesh><mesh position={[0, v.len * 0.4 + v.len * 0.1, 0]}><cylinderGeometry args={[v.d * 0.4, v.d * 0.4, v.len * 0.2, 48]} />{m}</mesh><mesh position={[0, -v.len * 0.4 - v.len * 0.05, 0]}><cylinderGeometry args={[v.d * 0.45, v.d * 0.45, v.len * 0.1, 48]} />{m}</mesh></group>}
      {k === "flange" && <>{lathe((() => { const b = v.bore / 2, o = v.od / 2, hub = b + (o - b) * 0.4; return [[b, 0], [o, 0], [o, v.thk], [hub, v.thk], [hub, v.thk * 2.2], [b, v.thk * 2.2], [b, 0]] as [number, number][]; })())}{Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * 6.28, r = (v.od / 2 + v.bore / 2 + (v.od / 2 - v.bore / 2) * 0.4) / 2 + 2; return <mesh key={i} position={[Math.cos(a) * r, -0.01, Math.sin(a) * r]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[v.od * 0.035, v.od * 0.035, v.thk * 1.02, 16]} /><meshStandardMaterial color="#111" /></mesh>; })}</>}
      {k === "gear" && gear && <mesh geometry={gear} position={[0, 0, -v.w / 2]}>{m}</mesh>}
      {k === "bracket" && bracket && <mesh geometry={bracket} position={[-v.leg / 2, -v.leg / 2, -v.w / 2]}>{m}</mesh>}
      {k === "bush" && lathe((() => { const i = v.bore / 2, o = v.od / 2, L = v.len; return [[i, 0], [o * 1.3, 0], [o * 1.3, L * 0.2], [o, L * 0.2], [o, L], [i, L], [i, 0]] as [number, number][]; })())}
      {k === "coupling" && lathe((() => { const i = v.bore / 2, o = v.od / 2, L = v.len; return [[i, 0], [o, 0], [o, L * 0.45], [o * 0.78, L * 0.5], [o, L * 0.55], [o, L], [i, L], [i, 0]] as [number, number][]; })())}
      {k === "pulley" && lathe((() => { const o = v.dia / 2, i = v.dia * 0.075, w = v.w; return [[i, 0], [o, 0], [o, w * 0.25], [o * 0.9, w * 0.5], [o, w * 0.75], [o, w], [i, w], [i, 0]] as [number, number][]; })())}
      {(k === "spacer" || k === "collar") && lathe((() => { const i = (k === "spacer" ? v.id : v.bore) / 2, o = Math.max(v.od, i * 2 + 2) / 2, L = k === "spacer" ? v.t : v.w; return [[i, 0], [o, 0], [o, L], [i, L], [i, 0]] as [number, number][]; })())}
    </group>
  );
}

function Clip({ on }: { on: boolean }) { const gl = useThree((s) => s.gl); useEffect(() => { gl.localClippingEnabled = on; }, [gl, on]); return null; }

export default function Forge3D({ part, v, finish, section, offset }: { part: Part; v: V; finish: string; section: boolean; offset: number }) {
  const g = part.geom(v); const dim = Math.max(g.od, g.len, 1); const scale = 3 / dim;
  const plane = useMemo(() => (section ? new THREE.Plane(new THREE.Vector3(1, 0, 0), offset * 1.5) : null), [section, offset]);
  return (
    <Stage3D className="h-full min-h-[360px] w-full" bg="#1a1d21" camera={[3.6, 2.4, 4.2]} fov={38} label={`3D model of ${part.name}. Drag to rotate, scroll to zoom.`}>
      <ambientLight intensity={0.3} /><directionalLight position={[4, 6, 3]} intensity={1.6} />
      <RoomEnv intensity={1.1} /><Clip on={section} />
      <gridHelper args={[10, 20, "#555", "#2a2d31"]} position={[0, -2, 0]} />
      <Body part={part} v={v} finish={finish} plane={plane} scale={scale} />
      <Orbit min={2} max={12} auto={section ? 0 : 0.6} />
    </Stage3D>
  );
}
