"use client";
import { Component, useEffect, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type V3 = [number, number, number];

class Boundary extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() {
    return { err: true };
  }
  render() {
    if (this.state.err)
      return (
        <div role="alert" className="flex h-full min-h-[320px] items-center justify-center p-8 text-center text-sm opacity-80">
          WebGL is not available on this device. Switch to another reality — the content is the same.
        </div>
      );
    return this.props.children;
  }
}

/** Shared R3F stage: capped DPR, error fallback, keyboard-accessible label. */
export function Stage3D({ children, camera = [6, 5, 8], fov = 45, className = "", bg, shadows = false, label }: { children: ReactNode; camera?: V3; fov?: number; className?: string; bg?: string; shadows?: boolean; label: string }) {
  return (
    <div className={"relative " + className} role="group" aria-label={label}>
      <Boundary>
        <Canvas dpr={[1, 1.6]} shadows={shadows} camera={{ position: camera, fov }} gl={{ antialias: true, powerPreference: "high-performance" }}>
          {bg && <color attach="background" args={[bg]} />}
          {children}
        </Canvas>
      </Boundary>
    </div>
  );
}

export function Orbit({ target = [0, 0, 0], min = 1, max = 40, maxPolar = Math.PI * 0.92, auto = 0, focus, damping = true }: { target?: V3; min?: number; max?: number; maxPolar?: number; auto?: number; focus?: { pos: V3; target: V3 } | null; damping?: boolean }) {
  const { camera, gl } = useThree();
  const ctl = useRef<OrbitControls | null>(null);
  const goal = useRef<{ p: THREE.Vector3; t: THREE.Vector3 } | null>(null);
  useEffect(() => {
    const c = new OrbitControls(camera, gl.domElement);
    c.enableDamping = damping;
    c.minDistance = min;
    c.maxDistance = max;
    c.maxPolarAngle = maxPolar;
    c.target.set(...target);
    c.autoRotate = auto !== 0;
    c.autoRotateSpeed = auto;
    c.addEventListener("start", () => (goal.current = null));
    ctl.current = c;
    return () => c.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, gl]);
  useEffect(() => {
    if (focus) goal.current = { p: new THREE.Vector3(...focus.pos), t: new THREE.Vector3(...focus.target) };
  }, [focus]);
  useFrame(() => {
    const c = ctl.current;
    if (!c) return;
    if (goal.current) {
      camera.position.lerp(goal.current.p, 0.07);
      c.target.lerp(goal.current.t, 0.07);
      if (camera.position.distanceTo(goal.current.p) < 0.03) goal.current = null;
    }
    c.update();
  });
  return null;
}

/** Image-based lighting so metals and glazes read correctly without loading an HDR. */
export function RoomEnv({ intensity = 1 }: { intensity?: number }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    scene.environmentIntensity = intensity;
    return () => {
      scene.environment = null;
      tex.dispose();
      pm.dispose();
    };
  }, [gl, scene, intensity]);
  return null;
}

/** First-person walk: WASD / arrows move, drag looks. Keeps y fixed. */
export function Walker({ start = [0, 1.6, 6] as V3, yaw0 = 0, speed = 3, bounds = [-9, 9, -9, 9] as [number, number, number, number], active = true, keys, blocked }: { start?: V3; yaw0?: number; speed?: number; bounds?: [number, number, number, number]; active?: boolean; keys: React.MutableRefObject<Set<string>>; blocked?: (x: number, z: number) => boolean }) {
  const { camera, gl } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  useEffect(() => {
    camera.position.set(...start);
    yaw.current = yaw0;
    pitch.current = 0;
    const el = gl.domElement;
    let down = false, lx = 0, ly = 0;
    const d = (e: PointerEvent) => { down = true; lx = e.clientX; ly = e.clientY; };
    const u = () => (down = false);
    const m = (e: PointerEvent) => {
      if (!down) return;
      yaw.current -= (e.clientX - lx) * 0.005;
      pitch.current = Math.max(-1, Math.min(1, pitch.current - (e.clientY - ly) * 0.004));
      lx = e.clientX; ly = e.clientY;
    };
    el.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    el.addEventListener("pointermove", m);
    return () => { el.removeEventListener("pointerdown", d); window.removeEventListener("pointerup", u); el.removeEventListener("pointermove", m); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, gl]);
  useFrame((_, dt) => {
    if (!active) return;
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;
    const k = keys.current;
    const f = (k.has("w") || k.has("arrowup") ? 1 : 0) - (k.has("s") || k.has("arrowdown") ? 1 : 0);
    const s = (k.has("d") ? 1 : 0) - (k.has("a") ? 1 : 0);
    const turn = (k.has("arrowleft") ? 1 : 0) - (k.has("arrowright") ? 1 : 0);
    yaw.current += turn * dt * 1.6;
    const sin = Math.sin(yaw.current), cos = Math.cos(yaw.current);
    const p = camera.position;
    const nx = p.x + (-sin * f + cos * s) * speed * dt;
    const nz = p.z + (-cos * f - sin * s) * speed * dt;
    if (!blocked || !blocked(nx, p.z)) p.x = nx;
    if (!blocked || !blocked(p.x, nz)) p.z = nz;
    p.x = Math.max(bounds[0], Math.min(bounds[1], p.x));
    p.z = Math.max(bounds[2], Math.min(bounds[3], p.z));
  });
  return null;
}

export function useKeySet() {
  const keys = useRef<Set<string>>(new Set());
  useEffect(() => {
    const d = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT") return;
      keys.current.add(e.key.toLowerCase());
    };
    const u = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const b = () => keys.current.clear();
    window.addEventListener("keydown", d);
    window.addEventListener("keyup", u);
    window.addEventListener("blur", b);
    return () => { window.removeEventListener("keydown", d); window.removeEventListener("keyup", u); window.removeEventListener("blur", b); };
  }, []);
  return keys;
}
