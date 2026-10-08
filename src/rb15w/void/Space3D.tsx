"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Stage3D } from "@/rb15l/three";

function Field({ n, mode }: { n: number; mode: "repel" | "attract" }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { camera, pointer } = useThree();
  const d = useMemo(() => Array.from({ length: n }, () => ({ p: new THREE.Vector3((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 6), v: new THREE.Vector3(), s: 0.05 + Math.random() * 0.08 })), [n]);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  useFrame((_, dt) => {
    const m = mesh.current; if (!m) return;
    const ray = new THREE.Vector3(pointer.x, pointer.y, 0.5).unproject(camera).sub(camera.position).normalize();
    const tt = -camera.position.z / ray.z; const target = camera.position.clone().add(ray.multiplyScalar(tt));
    const k = mode === "repel" ? -1 : 1;
    d.forEach((q, i) => {
      const df = target.clone().sub(q.p); const dist = Math.max(0.3, df.length());
      q.v.addScaledVector(df.normalize(), (k * 6) / (dist * dist) * dt);
      q.v.addScaledVector(q.p.clone().multiplyScalar(-1), 0.12 * dt);
      q.v.multiplyScalar(1 - 1.2 * dt); q.p.addScaledVector(q.v, dt * 2);
      tmp.position.copy(q.p); tmp.scale.setScalar(q.s * (1 + Math.min(2, q.v.length()))); tmp.updateMatrix(); m.setMatrixAt(i, tmp.matrix);
      color.setHSL(0.68 + Math.min(0.2, q.v.length() * 0.3), 0.9, 0.6); m.setColorAt(i, color);
    });
    m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true;
    camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.03; camera.position.y += (pointer.y * 0.8 - camera.position.y) * 0.03; camera.lookAt(0, 0, 0);
  });
  return <instancedMesh ref={mesh} args={[undefined, undefined, n]}><sphereGeometry args={[1, 12, 12]} /><meshStandardMaterial emissive="#7a5cff" emissiveIntensity={0.7} roughness={0.3} /></instancedMesh>;
}

export default function Space3D({ n, mode }: { n: number; mode: "repel" | "attract" }) {
  return (
    <Stage3D className="h-full w-full" bg="#000" camera={[0, 0, 9]} label="3D particle volume. Move the pointer to push or pull the particles.">
      <ambientLight intensity={0.4} /><pointLight position={[0, 0, 6]} intensity={30} color="#b6a4ff" />
      <Field n={n} mode={mode} />
    </Stage3D>
  );
}
