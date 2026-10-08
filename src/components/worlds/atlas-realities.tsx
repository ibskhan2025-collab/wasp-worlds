"use client";

import Link from "next/link";
import { WorldNavLink } from "@/components/wasp/world-wipe";
import { useEffect, useRef, useState } from "react";
import type { Mesh as ThreeMesh } from "three";
import { WorldExit } from "@/components/wasp/world-exit";
import { WorldProof } from "@/components/worlds/world-proof";
import { destinations } from "@/data/atlas";
import { money } from "@/lib/use-cart";

export function AtlasExpedition() {
  return (
    <div style={{ background: "#101418", color: "#e8e4dc", minHeight: "100dvh" }}>
      <WorldExit id="atlas" label="Room 10 · ATLAS/EXPEDITION" />
      <AtlasNav current="expedition" />
      <header style={{ padding: "40px 20px 8px", maxWidth: 1000, margin: "0 auto" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c98a3d" }}>NIGHT NAVIGATION · SIX ROUTES</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 10vw, 8rem)", lineHeight: 0.88, margin: "8px 0", letterSpacing: "-0.05em" }}>GO FAR.<br />GO DARK.</h1>
      </header>
      {destinations.map((d) => (
        <section key={d.slug} style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px" }}>
          <Link href={`/worlds/atlas/${d.slug}`} style={{ display: "block", position: "relative" }}>
            <img src={d.image} alt={d.name} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "21/9", objectFit: "cover", filter: "brightness(0.7) saturate(0.9)" }} />
            <div style={{ position: "absolute", inset: "auto 0 0 0", padding: 20, background: "linear-gradient(transparent, rgba(16,20,24,0.9))" }}>
              <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#c98a3d", margin: 0 }}>{d.region.toUpperCase()} · {d.season.toUpperCase()} · ★ {d.rating}</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.6rem)", margin: "4px 0" }}>{d.name}</h2>
              <p style={{ color: "#e8e4dcbb", margin: 0 }}>{d.days} days · {money(d.price)} · {d.stops.length} stops</p>
            </div>
          </Link>
        </section>
      ))}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "8px 20px 80px" }}>
        <Link href="/worlds/atlas/itinerary" style={{ background: "#c98a3d", color: "#101418", padding: "14px 24px", fontWeight: 700, fontSize: 12, letterSpacing: "0.15em" }}>PLAN BY STARLIGHT →</Link>
      </div>
      <WorldProof
        proves="Night navigation: the same six routes, recut for scale and slowness. Desire needs darkness."
        relatedHref="/worlds/nest"
        relatedName="NEST"
      />
    </div>
  );
}

export function AtlasField() {
  return (
    <div style={{ background: "#e4dcc8", color: "#241f16", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <WorldExit id="atlas" label="Room 10 · ATLAS/FIELD" />
      <AtlasNav current="field" />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>FIELD LOG · SURVEYOR&apos;S COPY</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", fontWeight: 400, margin: "8px 0" }}>Notes from the valley</h1>
        {destinations.map((d, i) => (
          <article key={d.slug} style={{ border: "2px dashed #241f1688", padding: 18, marginTop: 20, transform: `rotate(${i % 2 ? 0.5 : -0.5}deg)`, background: "#ece4cf" }}>
            <p style={{ margin: 0, fontSize: 12 }}>ENTRY {String(i + 1).padStart(2, "0")} · {d.season.toUpperCase()} · RATING {d.rating}/5</p>
            <h2 style={{ fontSize: "1.8rem", margin: "6px 0" }}>
              <Link href={`/worlds/atlas/${d.slug}`} style={{ textDecoration: "underline" }}>{d.name}</Link>
            </h2>
            <p style={{ fontStyle: "italic" }}>{d.blurb}</p>
            <p style={{ fontSize: "0.9rem" }}><strong>Pack:</strong> {d.pack}</p>
            <p style={{ fontSize: "0.9rem" }}><strong>Stops:</strong> {d.stops.map((s) => s.name).join(" → ")}</p>
            <span style={{ display: "inline-block", border: "2px solid #5a6e3f", color: "#5a6e3f", padding: "4px 12px", transform: "rotate(-3deg)", fontWeight: 700, fontSize: 11, letterSpacing: "0.2em" }}>SURVEYED ✓</span>
          </article>
        ))}
      </div>
    </div>
  );
}

export function AtlasCinema() {
  return (
    <div style={{ background: "#0b0d10", color: "#e8e4dc", minHeight: "100dvh" }}>
      <WorldExit id="atlas" label="Room 10 · ATLAS/CINEMA" />
      <AtlasNav current="cinematic" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
        <p style={{ fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.3em", color: "#c98a3d", textAlign: "center" }}>SIX ROUTES · SLOW CINEMA · NO ITINERARY, ONLY LONGING</p>
        {destinations.map((d) => (
          <figure key={d.slug} style={{ margin: "56px 0" }}>
            <div style={{ borderTop: "9vh solid #000", borderBottom: "9vh solid #000", background: "#000" }}>
              <img src={d.image} alt={d.name} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "2.39/1", objectFit: "cover", display: "block", filter: "brightness(0.85)" }} />
            </div>
            <figcaption style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "12px 4px" }}>
              <Link href={`/worlds/atlas/${d.slug}`} style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>{d.name}</Link>
              <span style={{ fontFamily: "var(--font-code)", fontSize: 12, color: "#c98a3d" }}>{d.region.toUpperCase()} · {d.season.toUpperCase()} · {d.days} DAYS</span>
            </figcaption>
          </figure>
        ))}
        <div style={{ textAlign: "center", paddingBottom: 80 }}>
          <p style={{ fontFamily: "var(--font-code)", fontSize: 12, letterSpacing: "0.2em" }}>FIN · <Link href="/worlds/atlas/itinerary" style={{ textDecoration: "underline" }}>PLAN FOR REAL →</Link></p>
        </div>
      </div>
    </div>
  );
}

export function AtlasTimetable() {
  return (
    <div style={{ background: "#101418", color: "#e8e4dc", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="atlas" label="Room 10 · ATLAS/TIMETABLE" />
      <AtlasNav current="timetable" />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c98a3d" }}>DEPARTURES · ALL LINES RUNNING · {destinations.length} ROUTES</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", margin: "8px 0" }}>Timetable.</h1>
        <div style={{ borderTop: "3px solid #e8e4dc", marginTop: 24 }}>
          {destinations.map((d) => (
            <div key={d.slug} style={{ display: "grid", gridTemplateColumns: "90px 1fr auto", gap: 12, padding: "14px 4px", borderBottom: "1px solid rgba(232,228,220,0.25)", alignItems: "center" }}>
              <span style={{ color: "#c98a3d", fontWeight: 700 }}>{d.season.slice(0, 3).toUpperCase()} · {d.days}D</span>
              <span>
                <Link href={`/worlds/atlas/${d.slug}`} style={{ fontSize: "1.2rem", textDecoration: "underline" }}>{d.name}</Link>
                <br /><span style={{ fontSize: "0.8rem", color: "#8a938f" }}>{d.region} · ★ {d.rating} · {d.stops.length} stops</span>
              </span>
              <span style={{ textAlign: "right" }}>{money(d.price)}<br /><span style={{ fontSize: 10, color: "#c98a3d", letterSpacing: "0.2em" }}>BOARDING</span></span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 24 }}>On time, every season. <Link href="/worlds/atlas/itinerary" style={{ textDecoration: "underline", color: "#c98a3d" }}>Plan for real →</Link></p>
      </div>
      <WorldProof
        proves="Travel as transit: the valley on a departures board — every route priced, dated, and boarding."
        relatedHref="/worlds/orbit"
        relatedName="ORBIT"
      />
    </div>
  );
}

export function AtlasPostcards() {
  return (
    <div style={{ background: "#e4dcc8", color: "#241f16", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <WorldExit id="atlas" label="Room 10 · ATLAS/POSTCARDS" />
      <AtlasNav current="postcards" />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px 80px", textAlign: "center" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.35em" }}>SPIN THE RACK · POSTAGE PAID · WISH YOU WERE HERE</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", fontWeight: 400, margin: "8px 0" }}>Postcards.</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20, marginTop: 32, textAlign: "left" }}>
          {destinations.map((d, i) => (
            <Link key={d.slug} href={`/worlds/atlas/${d.slug}`} style={{ display: "block", background: "#faf7f0", border: "1px solid #241f16", textDecoration: "none", color: "inherit", transform: `rotate(${i % 2 ? 1 : -1}deg)` }}>
              <img src={d.image} alt={d.name} loading="lazy" decoding="async" style={{ width: "100%", height: 150, objectFit: "cover", display: "block", borderBottom: "1px solid #241f16" }} />
              <div style={{ padding: "12px 14px" }}>
                <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "#5a6e3f", margin: 0 }}>{d.region.toUpperCase()} · {d.season.toUpperCase()}</p>
                <p style={{ fontSize: "1.2rem", margin: "6px 0" }}>{d.name}</p>
                <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "#6f6350" }}>{d.blurb}</p>
                <p style={{ fontSize: "0.9rem", margin: "8px 0 0" }}>{money(d.price)} · {d.days} days ★ {d.rating}</p>
              </div>
            </Link>
          ))}
        </div>
        <p style={{ marginTop: 32 }}>Send one, then come see it. <Link href="/worlds/atlas/itinerary" style={{ textDecoration: "underline" }}>Plan for real →</Link></p>
      </div>
      <WorldProof
        proves="Souvenirs that sell the trip: every postcard is a priced, rated, bookable route."
        relatedHref="/worlds/still"
        relatedName="STILL"
      />
    </div>
  );
}

export function AtlasGlobe() {
  const [sel, setSel] = useState<string | null>(null);
  const d = destinations.find((x) => x.slug === sel) ?? null;
  return (
    <div style={{ background: "#07121f", color: "#e8e4dc", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="atlas" label="Room 10 · ATLAS/GLOBE" />
      <AtlasNav current="globe" />
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 8px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#e8a33d" }}>THE VALLEY AS A PLANET · DRAG TO SPIN · TAP A MARKER</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.6rem)", margin: "8px 0" }}>Globe.</h1>
      </div>
      <div style={{ height: "58vh", minHeight: 380 }}>
        <GlobeView sel={sel} onSel={setSel} />
      </div>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "16px 20px 80px" }}>
        {d ? (
          <div className="panel">
            <strong style={{ fontSize: "1.5rem" }}>{d.name}</strong>
            <p style={{ color: "#8a938f", margin: "4px 0" }}>
              {d.region} · {d.season} · {d.days} days · ★ {d.rating}
            </p>
            <p>{d.blurb}</p>
            <p style={{ marginTop: 8 }}>
              <Link href={`/worlds/atlas/${d.slug}`} style={{ textDecoration: "underline" }}>Open the route →</Link>
              {" · "}
              <Link href="/worlds/atlas/itinerary" style={{ textDecoration: "underline" }}>{money(d.price)} — plan it →</Link>
            </p>
          </div>
        ) : (
          <p style={{ color: "#8a938f" }}>Six routes on one small planet. Tap a marker — schematically placed, honestly labelled as such.</p>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          {destinations.map((x) => (
            <button
              key={x.slug}
              type="button"
              aria-pressed={sel === x.slug}
              onClick={() => setSel(x.slug)}
              className={sel === x.slug ? "chip-on" : "chip"}
            >
              {x.name}
            </button>
          ))}
        </div>
      </div>
      <WorldProof
        proves="Place as an object: the valley you can spin before you walk it."
        relatedHref="/worlds/nest"
        relatedName="NEST"
      />
    </div>
  );
}

function GlobeView({ sel, onSel }: { sel: string | null; onSel: (slug: string) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const selRef = useRef(sel);
  const onSelRef = useRef(onSel);
  useEffect(() => {
    selRef.current = sel;
    onSelRef.current = onSel;
  }, [sel, onSel]);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.done) return;
    el.dataset.done = "1";
    let dead = false;
    void import("three").then((T) => {
      if (dead) return;
      const W = el.clientWidth || 1;
      const H = el.clientHeight || 1;
      const renderer = new T.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(W, H);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.display = "block";
      renderer.domElement.style.touchAction = "none";
      el.appendChild(renderer.domElement);
      const scene = new T.Scene();
      scene.background = new T.Color(0x07121f);
      const camera = new T.PerspectiveCamera(40, W / H, 0.1, 100);
      camera.position.set(0, 0.6, 3.2);
      scene.add(new T.AmbientLight(0xffffff, 1.1));
      const sun = new T.DirectionalLight(0xffffff, 1.6);
      sun.position.set(3, 2, 4);
      scene.add(sun);
      const globe = new T.Group();
      scene.add(globe);
      const R = 1;
      const earth = new T.Mesh(
        new T.SphereGeometry(R, 64, 48),
        new T.MeshStandardMaterial({ color: 0x0f2a44, roughness: 0.9 }),
      );
      globe.add(earth);
      const grid = new T.LineSegments(
        new T.WireframeGeometry(new T.SphereGeometry(R * 1.001, 24, 16)),
        new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 }),
      );
      globe.add(grid);
      const markers: ThreeMesh[] = [];
      destinations.forEach((dst, i) => {
        const a = (i / destinations.length) * Math.PI * 2;
        const lat = 0.5 - (i % 3) * 0.45;
        const p = new T.Vector3(
          -R * 1.01 * Math.sin(Math.acos(Math.max(-1, Math.min(1, lat)))) * Math.cos(a),
          R * 1.01 * lat,
          R * 1.01 * Math.sin(Math.acos(Math.max(-1, Math.min(1, lat)))) * Math.sin(a),
        );
        const mk = new T.Mesh(
          new T.SphereGeometry(selRef.current === dst.slug ? 0.035 : 0.02, 12, 12),
          new T.MeshBasicMaterial({ color: selRef.current === dst.slug ? 0xffffff : 0xe8a33d }),
        );
        mk.position.copy(p);
        mk.userData.slug = dst.slug;
        globe.add(mk);
        markers.push(mk);
      });
      const ray = new T.Raycaster();
      const ptr = new T.Vector2();
      const dom = renderer.domElement;
      const pick = (e: PointerEvent) => {
        const rect = dom.getBoundingClientRect();
        ptr.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        ptr.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        ray.setFromCamera(ptr, camera);
        const hit = ray.intersectObjects(markers);
        const found = hit[0]?.object.userData.slug as string | undefined;
        if (found) onSelRef.current(found);
      };
      let downAt = 0;
      let dragging: { x: number; y: number } | null = null;
      let theta = 0;
      dom.addEventListener("pointerdown", (e) => {
        dragging = { x: e.clientX, y: e.clientY };
        downAt = Date.now();
        dom.setPointerCapture(e.pointerId);
      });
      dom.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        theta += (e.clientX - dragging.x) * 0.008;
        dragging = { x: e.clientX, y: e.clientY };
      });
      dom.addEventListener("pointerup", (e) => {
        if (dragging && Date.now() - downAt < 250) pick(e);
        dragging = null;
      });
      let raf = 0;
      const size = () => {
        const w = el.clientWidth || 1;
        const h = el.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", size);
      const loop = () => {
        globe.rotation.y += 0.0015;
        if (dragging) globe.rotation.y = theta * 0.2 + globe.rotation.y * 0;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", size);
        renderer.dispose();
        if (dom.parentElement === el) el.removeChild(dom);
        delete el.dataset.done;
      };
    });
    return () => {
      dead = true;
    };
  }, []);
  return <div ref={ref} style={{ width: "100%", height: "100%" }} role="application" aria-label="Schematic valley globe. Drag to spin, tap a marker." />;
}

export function AtlasNav({ current }: { current: string }) {
  return (
    <nav aria-label="ATLAS realities" style={{ display: "flex", gap: 2, alignItems: "center", background: "#101418", color: "#e8e4dc", borderBottom: "1px solid rgba(232,228,220,0.2)", padding: "0 12px", overflowX: "auto" }}>
      <Link href="/worlds/atlas" style={{ padding: "12px 8px", letterSpacing: "0.25em", fontSize: 12, fontWeight: 800, fontFamily: "var(--font-code)" }}>
        ATLAS◌
      </Link>
      {[
        ["classic", "Survey", "/worlds/atlas"],
      ].map(([id, label, href]) => (
        <WorldNavLink
          world="atlas"
          label={label}
          key={id}
          href={href}
          aria-current={current === id ? "page" : undefined}
          style={{
            padding: "12px 12px",
            fontSize: 12,
            letterSpacing: "0.1em",
            fontFamily: "var(--font-code)",
            color: current === id ? "#101418" : "#e8e4dc",
            background: current === id ? "#c98a3d" : "transparent",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </WorldNavLink>
      ))}
    </nav>
  );
}
