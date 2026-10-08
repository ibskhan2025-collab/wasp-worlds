"use client";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Orbit, Stage3D } from "@/rb15l/three";
import { DESTS, LAND, type Dest } from "./geo";

const ll = (lat: number, lon: number, r = 1): THREE.Vector3 => { const p = ((90 - lat) * Math.PI) / 180, t = ((lon + 180) * Math.PI) / 180; return new THREE.Vector3(-r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t)); };

function Earth() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 2048; c.height = 1024; const x = c.getContext("2d")!;
    x.fillStyle = "#0f2a44"; x.fillRect(0, 0, 2048, 1024);
    x.strokeStyle = "rgba(255,255,255,.08)"; for (let i = 0; i <= 36; i++) { x.beginPath(); x.moveTo((i / 36) * 2048, 0); x.lineTo((i / 36) * 2048, 1024); x.stroke(); } for (let i = 0; i <= 18; i++) { x.beginPath(); x.moveTo(0, (i / 18) * 1024); x.lineTo(2048, (i / 18) * 1024); x.stroke(); }
    x.fillStyle = "#d8c79a"; x.strokeStyle = "#f3e6bd"; x.lineWidth = 2;
    LAND.forEach((poly) => { x.beginPath(); poly.forEach(([lo, la], i) => { const px = ((lo + 180) / 360) * 2048, py = ((90 - la) / 180) * 1024; i ? x.lineTo(px, py) : x.moveTo(px, py); }); x.closePath(); x.fill(); x.stroke(); });
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return <mesh><sphereGeometry args={[1, 64, 48]} /><meshStandardMaterial map={tex} roughness={0.9} /></mesh>;
}

function Arc({ a, b }: { a: Dest; b: Dest }) {
  const geo = useMemo(() => {
    const p1 = ll(a.lat, a.lon), p2 = ll(b.lat, b.lon), mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(1 + p1.distanceTo(p2) * 0.35);
    return new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(p1, mid, p2), 40, 0.006, 6);
  }, [a, b]);
  return <mesh geometry={geo}><meshBasicMaterial color="#e8a33d" /></mesh>;
}

export default function Globe({ stops, sel, onSel }: { stops: Dest[]; sel: string | null; onSel: (id: string) => void }) {
  return (
    <Stage3D className="h-full min-h-[420px] w-full" bg="#07121f" camera={[0, 0.6, 3.2]} fov={40} label="3D globe. Drag to rotate, tap a marker to select a destination.">
      <ambientLight intensity={1.1} /><directionalLight position={[3, 2, 4]} intensity={1.6} />
      <Earth />
      {DESTS.map((d) => { const p = ll(d.lat, d.lon, 1.01); const inTrip = stops.some((s) => s.id === d.id); return (
        <mesh key={d.id} position={p} onClick={(e) => { e.stopPropagation(); onSel(d.id); }} onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "")}>
          <sphereGeometry args={[sel === d.id ? 0.035 : inTrip ? 0.028 : 0.02, 12, 12]} /><meshBasicMaterial color={sel === d.id ? "#ffffff" : inTrip ? "#e8a33d" : "#ff6a4d"} /></mesh>); })}
      {stops.slice(1).map((s, i) => <Arc key={s.id + i} a={stops[i]} b={s} />)}
      <Orbit min={1.6} max={6} auto={0.4} />
    </Stage3D>
  );
}
