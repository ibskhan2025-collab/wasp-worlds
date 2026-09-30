"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { nestMaterials, nestRooms } from "@/data/nest";

/**
 * NEST/VOLUME — the floorplan as real geometry. Raw three.js (no fiber):
 * one scene, four room solids, drag orbit, scroll zoom, click select.
 * Static frame under reduced motion; honest fallback without WebGL.
 */
export function NestVolume() {
  const mount = useRef<HTMLDivElement | null>(null);
  const [slug, setSlug] = useState(nestRooms[0].slug);
  const [mat, setMat] = useState("plaster");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const sel = useRef(slug);
  const matRef = useRef(mat);
  useEffect(() => {
    sel.current = slug;
    matRef.current = mat;
  });

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      queueMicrotask(() => setFailed(true));
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x101210);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x101210, 18, 40);
    const camera = new THREE.PerspectiveCamera(42, 2, 0.1, 100);
    scene.add(new THREE.AmbientLight(0xe8e0d2, 0.9));
    const sun = new THREE.DirectionalLight(0xfff2dd, 1.6);
    sun.position.set(6, 10, 4);
    scene.add(sun);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 12),
      new THREE.MeshStandardMaterial({ color: 0x1c1a16, roughness: 1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const group = new THREE.Group();
    scene.add(group);
    const boxes = new Map<string, THREE.Mesh>();
    for (const r of nestRooms) {
      const w = Math.max(0.8, r.rect.w / 50);
      const d = Math.max(0.8, r.rect.h / 50);
      const h = 0.7 + (r.rect.w * r.rect.h) / 22000;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({ color: 0xefeae2, roughness: 0.9 }),
      );
      mesh.position.set((r.rect.x + r.rect.w / 2) / 50 - 4, h / 2, (r.rect.y + r.rect.h / 2) / 50 - 3);
      mesh.userData.slug = r.slug;
      group.add(mesh);
      boxes.set(r.slug, mesh);
      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry),
        new THREE.LineBasicMaterial({ color: 0xc98a3d }),
      );
      edge.position.copy(mesh.position);
      group.add(edge);
    }

    let theta = 0.7;
    let phi = 1.0;
    let dist = 13;
    let dragging: { x: number; y: number } | null = null;
    const dom = renderer.domElement;
    dom.style.width = "100%";
    dom.style.height = "100%";
    dom.style.display = "block";
    dom.style.touchAction = "none";

    const size = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    size();
    window.addEventListener("resize", size);

    const ray = new THREE.Raycaster();
    const ptr = new THREE.Vector2();
    function pick(e: PointerEvent) {
      const rect = dom.getBoundingClientRect();
      ptr.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ptr.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      ray.setFromCamera(ptr, camera);
      const hit = ray.intersectObjects(group.children.filter((o) => o instanceof THREE.Mesh));
      const found = hit.find((x) => x.object.userData.slug) as unknown as { object: { userData: { slug: string } } } | undefined;
      if (found) setSlug(found.object.userData.slug);
    }
    let downAt = 0;
    dom.addEventListener("pointerdown", (e) => {
      dragging = { x: e.clientX, y: e.clientY };
      downAt = Date.now();
      dom.setPointerCapture(e.pointerId);
    });
    dom.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      theta += (e.clientX - dragging.x) * 0.006;
      phi = Math.max(0.35, Math.min(1.35, phi + (e.clientY - dragging.y) * 0.004));
      dragging = { x: e.clientX, y: e.clientY };
    });
    dom.addEventListener("pointerup", (e) => {
      if (dragging && Date.now() - downAt < 250) pick(e);
      dragging = null;
    });
    dom.addEventListener("wheel", (e) => {
      e.preventDefault();
      dist = Math.max(7, Math.min(22, dist + e.deltaY * 0.01));
    }, { passive: false });

    const matHex = () => {
      const m = nestMaterials.find((x) => x.id === matRef.current);
      return new THREE.Color(m ? m.hex : "#efeae2");
    };
    let raf = 0;
    const frame = () => {
      const c = matHex();
      for (const [id, mesh] of boxes) {
        const m = mesh.material as THREE.MeshStandardMaterial;
        m.color.copy(c);
        const on = id === sel.current;
        m.emissive = new THREE.Color(on ? 0x7a5a1e : 0x000000);
        m.emissiveIntensity = on ? 0.55 : 0;
      }
      camera.position.set(
        Math.sin(theta) * Math.cos(phi) * dist,
        Math.sin(phi) * dist,
        Math.cos(theta) * Math.cos(phi) * dist,
      );
      camera.lookAt(0, 0.4, 0);
      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(frame);
    };
    frame();
    if (!reduced) raf = requestAnimationFrame(frame);
    const readyId = requestAnimationFrame(() => setReady(true));

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(readyId);
      window.removeEventListener("resize", size);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const m = mesh.material as THREE.Material | undefined;
        if (m && "dispose" in m) (m as THREE.Material).dispose();
      });
      renderer.dispose();
      if (dom.parentElement === el) el.removeChild(dom);
    };
  }, []);

  const room = nestRooms.find((r) => r.slug === slug) ?? nestRooms[0];

  return (
    <div style={{ background: "#101210", color: "#e8e0d2", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="nest" label="Room 14 · NEST/VOLUME" />
      <RealityShell world="nest" current="volume" basePath="/worlds/nest" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#c98a3d" }}>VOLUME · DRAG TO ORBIT · SCROLL TO ZOOM · CLICK A ROOM</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.6rem)", margin: "8px 0" }}>The house, solid.</h1>
        {failed ? (
          <div className="panel">
            <p>No WebGL on this device — the house stays flat, through no fault of its own.</p>
            <Link href="/worlds/nest/walk" style={{ textDecoration: "underline" }}>Take the CSS-3D walk instead →</Link>
          </div>
        ) : (
          <div ref={mount} style={{ width: "100%", height: 420, border: "1px solid rgba(232,224,210,0.25)", touchAction: "none" }} role="application" aria-label="3D house model. Drag to orbit, scroll to zoom." />
        )}
        {!ready && !failed ? <p style={{ fontSize: 12 }}>Raising the walls…</p> : null}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          {nestRooms.map((r) => (
            <button key={r.slug} type="button" onClick={() => setSlug(r.slug)} aria-pressed={slug === r.slug} className={slug === r.slug ? "chip-on" : "chip"}>
              {r.name}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {nestMaterials.map((m) => (
            <button key={m.id} type="button" onClick={() => setMat(m.id)} aria-pressed={mat === m.id} className={mat === m.id ? "chip-on" : "chip"} title={m.note}>
              {m.name}
            </button>
          ))}
        </div>
        <div className="panel" style={{ marginTop: 16 }}>
          <strong style={{ fontSize: "1.4rem" }}>{room.name}</strong>
          <p style={{ color: "#8a7f6e", margin: "4px 0 0" }}>{room.size} · {room.light} · {room.desc}</p>
          <p style={{ marginTop: 8 }}><Link href={`/worlds/nest/${room.slug}`} style={{ textDecoration: "underline" }}>Room dossier →</Link></p>
        </div>
      </div>
      <WorldProof
        proves="Four rooms as real geometry: orbit, zoom, select, re-material — WebGL earning its bytes."
        relatedHref="/worlds/forge"
        relatedName="FORGE"
      />
    </div>
  );
}
