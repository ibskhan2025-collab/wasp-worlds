"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useWasp } from "@/context/wasp-context";
import { FEELS, INTENTS, MOTIONS } from "@/lib/types";
import { INTENT_COPY, WORLDS, recommendWorlds } from "@/lib/worlds";
import { REALITIES } from "@/lib/realities";
import { pexels } from "@/lib/media";

const ROOM_SPAN = ["span8", "span4", "span4", "span5", "span3", "span4", "span4", "span5", "span3", "span7", "span5", "span4", "span4", "span5", "span7"];

const ROOM_IMAGE: Record<string, string> = {
  // Card-sized (800w) variants — the full-res media.* URLs stay on the
  // world pages themselves. Loading 15 × 2000px hero images for cards
  // was the biggest homepage payload.
  casa: pexels(6536617, 800),
  noir: pexels(8858906, 800),
  orbit: pexels(6692607, 800),
  still: pexels(25664673, 800),
  signal: pexels(38799318, 800),
  objects: pexels(15122643, 800),
  archive: pexels(29624744, 800),
  motion: pexels(36690060, 800),
  void: pexels(33586903, 800),
  atlas: pexels(30700949, 800),
  forge: pexels(20208729, 800),
  pulse: pexels(3394250, 800),
  civic: pexels(30222932, 800),
  nest: pexels(30761844, 800),
  vector: pexels(37436278, 800),
};

const HOOK: Record<string, { bg: string; fg: string; accent: string; muted: string }> = {
  casa: { bg: "#140f0c", fg: "#f3e8d8", accent: "#ff5a2e", muted: "#c9a98a" },
  noir: { bg: "#0a0a0a", fg: "#f4f1ea", accent: "#f4f1ea", muted: "#8a8580" },
  orbit: { bg: "#0d1420", fg: "#dfe8f2", accent: "#6fc3ff", muted: "#7f8fb0" },
  still: { bg: "#0c0c0c", fg: "#ececec", accent: "#ff5a5a", muted: "#8a8a8a" },
  signal: { bg: "#04070c", fg: "#9fd8ff", accent: "#6fc3ff", muted: "#5f7f99" },
  objects: { bg: "#1a1a1a", fg: "#e8e4da", accent: "#e2c08d", muted: "#a89a80" },
  archive: { bg: "#241a12", fg: "#e8ddc4", accent: "#c9a86d", muted: "#a89878" },
  motion: { bg: "#000000", fg: "#f4f1ea", accent: "#e8b86d", muted: "#8a8580" },
  void: { bg: "#020610", fg: "#bfe3ff", accent: "#3ddc84", muted: "#5f7f99" },
  atlas: { bg: "#101418", fg: "#e8e4dc", accent: "#c98a3d", muted: "#8a938f" },
  forge: { bg: "#14161a", fg: "#e8eaee", accent: "#ffb020", muted: "#9aa0ac" },
  pulse: { bg: "#0d0716", fg: "#e9defc", accent: "#9d5cff", muted: "#8f7fb8" },
  civic: { bg: "#0d1117", fg: "#e8eef2", accent: "#2e6bd8", muted: "#8a99a5" },
  nest: { bg: "#101210", fg: "#e8e0d2", accent: "#c98a3d", muted: "#8a7f6e" },
  vector: { bg: "#0b0e13", fg: "#dfe8f2", accent: "#6fc3ff", muted: "#7f8fb0" },
};

const SELECTED = [
  {
    id: "casa",
    editorial: "Booking a table feels like the evening starting early. Atmosphere and utility, same gesture.",
    capabilities: ["Reservations", "Editorial menu", "Gallery"],
  },
  {
    id: "noir",
    editorial: "The object desirable before the price appears. Then it still closes: sizes, bag, checkout.",
    capabilities: ["Ecommerce", "Lookbook", "Appointments"],
  },
  {
    id: "orbit",
    editorial: "Software you operate, demonstrated live. Customers, pipeline, reports, exports.",
    capabilities: ["Dashboards", "CRUD", "Reports + CSV"],
  },
  {
    id: "forge",
    editorial: "Parts with numbers you can trust and a quote flow a busy buyer finishes. B2B without the beige.",
    capabilities: ["Catalogues", "Diagrams", "Quote builder"],
  },
] as const;

export function Experience() {
  const wasp = useWasp();
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [holy, setHoly] = useState(false);
  const [holyStep, setHolyStep] = useState(0);
  const holyTimers = useRef<number[]>([]);

  useEffect(() => {
    if (!wasp.ready) return;
    if (wasp.entered) {
      const id = window.setTimeout(() => setStage(5), 0);
      return () => window.clearTimeout(id);
    }
    // Compressed intro: the full show is under 1.5s so the 5-second
    // test passes — headline + ENTER are up almost immediately.
    // STILL motion skips the theater entirely.
    if (wasp.motion === "still") {
      const id = window.setTimeout(() => setStage(4), 0);
      return () => window.clearTimeout(id);
    }
    const timers = [120, 450, 800, 1200].map((t, i) =>
      window.setTimeout(() => setStage(i + 1), wasp.motion === "subtle" ? t / 2 : t),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [wasp.ready, wasp.entered, wasp.motion]);

  const ranked = useMemo(
    () => recommendWorlds(wasp.intent, wasp.interest),
    [wasp.intent, wasp.interest],
  );
  const recIds = ranked.slice(0, 3).map((w) => w.id);
  const copy = wasp.intent ? INTENT_COPY[wasp.intent] : null;

  function startHoly() {
    setHoly(true);
    setHolyStep(0);
    holyTimers.current.forEach((id) => window.clearTimeout(id));
    const beats = [0, 1400, 2800, 4200, 5600, 7000, 8400];
    holyTimers.current = beats.map((t, i) => window.setTimeout(() => setHolyStep(i), t));
  }

  function closeHoly() {
    holyTimers.current.forEach((id) => window.clearTimeout(id));
    holyTimers.current = [];
    setHoly(false);
  }

  useEffect(() => {
    return () => holyTimers.current.forEach((id) => window.clearTimeout(id));
  }, []);

  useEffect(() => {
    if (!holy) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeHoly();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [holy]);

  if (!wasp.ready) {
    return <div className="opening" aria-hidden />;
  }

  if (!wasp.entered) {
    return (
      <section className="opening" aria-label="Opening">
        {stage >= 1 ? <h1>WELCOME TO THE INTERNET.</h1> : null}
        {stage >= 2 ? <p style={{ marginTop: 18 }}>THIS IS A PORTFOLIO.</p> : null}
        {stage >= 3 ? (
          <p style={{ marginTop: 8 }}>
            PROBABLY
            <button
              type="button"
              onClick={() => wasp.discover("period")}
              style={{ background: "none", border: 0, padding: 0, font: "inherit" }}
              aria-label="A small discovery"
            >
              .
            </button>
          </p>
        ) : null}
        {stage >= 4 ? (
          <>
            <p className="sub">DON&apos;T LOOK. GO IN.</p>
            <button className="enter" type="button" onClick={wasp.enter}>
              ENTER
            </button>
          </>
        ) : (
          <button className="enter" type="button" onClick={wasp.enter} style={{ opacity: 0.4 }} aria-label="Skip intro">
            SKIP INTRO
          </button>
        )}
      </section>
    );
  }

  return (
    <div className="exhibition">
      <header className="ex-hero">
        <div>
          <p className="ex-kicker">Exhibition · 15 worlds · WASP</p>
          <h1 className="ex-title">
            {copy ? copy.headline : "WHAT DO YOU WANT TO MAKE?"}
          </h1>
          {!copy ? (
            <p className="ex-sub">
              WASP designs and builds digital experiences for people, products, places and ideas —
              treating the website not as a page to fill, but as a place to enter.
            </p>
          ) : null}
          <div className="world-actions" style={{ marginTop: 22 }}>
            <Link className="btn" href="#selected">View selected work</Link>
            <Link className="btn ghost" href="/start">Start a project</Link>
          </div>
          <div className="intent-row" role="list">
            {INTENTS.map((item) => (
              <button
                key={item.id}
                className={wasp.intent === item.id ? "chip-on" : "chip"}
                type="button"
                onClick={() => wasp.setIntent(wasp.intent === item.id ? null : item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="ex-aside">
            {copy
              ? copy.body
              : "This is not a grid of case studies. Each world is an argument for what the web can be — a place, a product, a store, a publication, a machine, an experiment."}
          </p>
          <p className="kicker" style={{ marginTop: 18 }}>
            Feel
          </p>
          <div className="feel-row">
            {FEELS.map((f) => (
              <button
                key={f.id}
                className={wasp.feel === f.id ? "chip-on" : "chip"}
                type="button"
                onClick={() => wasp.setFeel(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="kicker" style={{ marginTop: 14 }}>
            Motion
          </p>
          <div className="feel-row">
            {MOTIONS.map((m) => (
              <button
                key={m.id}
                className={wasp.motion === m.id ? "chip-on" : "chip"}
                type="button"
                onClick={() => wasp.setMotion(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {wasp.discoveries.includes("period") ? (
        <p className="kicker" style={{ padding: "12px var(--pad)" }}>
          You found a period that wanted attention. There are more. Try VOID. Try holding still.
        </p>
      ) : null}

      <HookRoom />

      <section id="selected" aria-label="Selected work" style={{ borderBottom: "1px solid var(--line)" }}>
        <div style={{ padding: "16px var(--pad) 8px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="grid-2">
          <div>
            <p className="ex-kicker">Selected work · 4 rooms that carry the argument</p>
          </div>
          <div>
            <p className="kicker">What&apos;s actually here</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              <Link className="ghost" href="#selected">15 worlds ↓</Link>
              <Link className="ghost" href="/tools">10 tools</Link>
              <Link className="ghost" href="/process">16 stages</Link>
              <Link className="ghost" href="/os">The OS</Link>
              <Link className="ghost" href="/lab">Lab</Link>
              <Link className="ghost" href="/start">Builder →</Link>
            </div>
            <p className="kicker" style={{ marginTop: 14, border: "1px solid var(--line)", padding: "10px 12px" }}>
              A note on proof: nothing here invents clients, quotes, or numbers. Where measurement doesn&apos;t exist yet, it says so.
            </p>
          </div>
        </div>
        {SELECTED.map((s) => {
          const world = WORLDS.find((w) => w.id === s.id)!;
          return (
            <SelReveal key={s.id}>
            <article className="selected-row">
              <Link
                href={world.href}
                className="selected-img"
                style={{ ["--room-image" as string]: `url(${ROOM_IMAGE[world.id]})` }}
                aria-label={`Enter ${world.name}`}
              />
              <div className="selected-body">
                <p className="kicker">ROOM {world.room} · {world.kind} · WASP STUDY</p>
                <h2>{world.name}</h2>
                <p className="kicker" style={{ marginTop: 6 }}>Palette — {world.palette}</p>
                <p className="selected-line">{world.line}</p>
                <p>{s.editorial}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "14px 0 20px" }}>
                  {s.capabilities.map((c) => <span key={c} className="chip">{c}</span>)}
                </div>
                <div className="world-actions">
                  <Link className="btn" href={world.href}>Enter world</Link>
                  <Link className="btn ghost" href={`/studio/case/${world.id}`}>View case study</Link>
                </div>
              </div>
            </article>
            </SelReveal>
          );
        })}
      </section>

      <div style={{ padding: "16px var(--pad) 8px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
        <p className="ex-kicker" style={{ margin: 0 }}>The exhibition · all 15 rooms</p>
        <Link className="kicker" href="/matrix" style={{ borderBottom: "1px solid currentColor" }}>Matrix view →</Link>
      </div>
      <div className="rooms">
        {WORLDS.map((world, i) => {
          const rec = recIds.includes(world.id);
          return (
            <Link
              key={world.id}
              href={world.href}
              className={`room ${ROOM_SPAN[i]} ${rec ? "rec" : ""} ${wasp.visited.includes(world.id) ? "visited" : ""}`}
              style={{ ["--room-image" as string]: `url(${ROOM_IMAGE[world.id]})` }}
            >
              <div>
                <div className="room-id">ROOM {world.room} · WASP STUDY · {(REALITIES[world.id] ?? []).length} REALITIES{rec ? " · FOR YOU" : ""}</div>
                <h2>{world.name}</h2>
                <div className="kind">{world.kind}</div>
                <div className="room-palette">{world.palette}</div>
              </div>
              <p className="line">{world.line}</p>
            </Link>
          );
        })}
      </div>

      <section className="world-meta-grid">
        <div><span className="kicker">THE WORLDS</span><h2>15 arguments for what the web can be.</h2><p>Industry is the surface. The real category is the feeling, behavior and problem underneath.</p></div>
        <div><span className="kicker">THE OTHER ROOMS</span><div className="meta-links"><Link href="/lab">LAB — experiments</Link><Link href="/os">MACHINE — systems & AI</Link><Link href="/work">THE ARCHIVE — proof</Link><Link href="/start">START — make something</Link></div></div>
      </section>

      <footer className="ex-footer">
        <span>
          YOU&apos;VE SEEN {wasp.visited.length} / 15
        </span>
        <button
          className="ghost"
          type="button"
          onClick={() => {
            const unseen = WORLDS.filter((w) => !wasp.visited.includes(w.id));
            const list = unseen.length ? unseen : WORLDS;
            router.push(list[Math.floor(Math.random() * list.length)].href);
          }}
        >
          Surprise room
        </button>
        <button className="ghost" type="button" onClick={startHoly}>
          Look at the website
        </button>
        {wasp.visited.length >= 3 && !wasp.holyShitSeen ? (
          <button className="ghost" type="button" onClick={startHoly}>
            Notice something?
          </button>
        ) : null}
        <Link className="ghost" href="/studio">
          The studio
        </Link>
        <Link className="ghost" href="/night">
          Night →
        </Link>
      </footer>

      {holy ? (
        <div className="holy break" role="dialog" aria-modal="true" aria-label="The website looking back">
          {holyStep === 0 ? <h2>YOU&apos;VE BEEN LOOKING AT WEBSITES.</h2> : null}
          {holyStep === 1 ? <h2>NOW LOOK AT THE WEBSITE.</h2> : null}
          {holyStep >= 2 && holyStep < 4 ? (
            <div>
              <h2>HERE&apos;S WHAT YOU&apos;RE STANDING IN.</h2>
              <div className="sys">
                <div>WORLDS — fifteen working rooms, not screenshots</div>
                <div>STUDIO — process, services, proof</div>
                <div>TOOLS — free instruments, no invoice</div>
                <div>BUILDER — a brief in six questions</div>
                <div>OS — the studio run as software</div>
              </div>
            </div>
          ) : null}
          {holyStep === 4 ? <h2>NOTHING HERE IS A MOCKUP.</h2> : null}
          {holyStep === 5 ? <h2>THAT&apos;S THE WHOLE PITCH.</h2> : null}
          {holyStep >= 6 ? (
            <div>
              <h2>IMAGINE WHAT WE COULD DO WITH YOURS.</h2>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
                <Link className="btn" href="/start" onClick={() => wasp.markHolyShit()}>
                  Start a project
                </Link>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => {
                    wasp.markHolyShit();
                    closeHoly();
                  }}
                >
                  Keep looking
                </button>
                <button className="btn ghost" type="button" onClick={closeHoly} aria-label="Close overlay">
                  Close (Esc)
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The hook: one room, alive, in the first viewport. Touch it and the room
 * changes — bg, fg, accent, name, verb. Move across it and the motes lean
 * in. Still frame under reduced motion. This is the site's thesis in 300px:
 * don't look at examples. Touch one.
 */
function HookRoom() {
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLCanvasElement | null>(null);
  const pal = useRef(HOOK[WORLDS[0].id]!);
  const world = WORLDS[idx]!;
  const p = HOOK[world.id]!;
  pal.current = p;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = 300);
    const ptr = { x: 0.5, y: 0.5, inside: false };
    const dots: { x: number; y: number; r: number; s: number }[] = Array.from({ length: 70 }, () => ({
      x: Math.random(), y: Math.random(), r: 0.8 + Math.random() * 2.2, s: 0.0004 + Math.random() * 0.001,
    }));
    const move = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      ptr.x = (e.clientX - rect.left) / rect.width;
      ptr.y = (e.clientY - rect.top) / rect.height;
      ptr.inside = true;
    };
    const leave = () => { ptr.inside = false; };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    const paint = () => {
      const c = pal.current;
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, W, H);
      for (const d of dots) {
        if (ptr.inside) {
          d.x += (ptr.x - d.x) * 0.01;
          d.y += (ptr.y - d.y) * 0.01;
        } else {
          d.y -= d.s;
          if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); }
        }
        ctx.fillStyle = c.accent + "cc";
        ctx.beginPath();
        ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    if (reduced) {
      paint();
      return () => {
        canvas.removeEventListener("pointermove", move);
        canvas.removeEventListener("pointerleave", leave);
      };
    }
    let raf = 0;
    const loop = () => { paint(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, [idx]);

  return (
    <section aria-label="Touch a room" style={{ position: "relative", borderBottom: "1px solid var(--line)", overflow: "hidden" }}>
      <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} aria-hidden />
      <div style={{ position: "relative", padding: "56px var(--pad) 48px", background: "transparent" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: p.muted, margin: 0 }}>TOUCH IT — ROOM {world.room} OF 15 · {(REALITIES[world.id] ?? []).length} REALITIES INSIDE</p>
        <h2 style={{ color: p.fg, fontSize: "clamp(3rem, 11vw, 8rem)", lineHeight: 0.9, margin: "8px 0", fontWeight: 800, letterSpacing: "-0.04em" }}>{world.name}</h2>
        <p style={{ color: p.muted, maxWidth: "52ch", fontSize: "1.05rem" }}>{world.line}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
          <button
            type="button"
            onClick={() => setIdx((idx + 1) % WORLDS.length)}
            style={{ background: p.accent, color: p.bg, border: 0, padding: "14px 24px", fontWeight: 800, fontSize: 12, letterSpacing: "0.15em" }}
          >
            CHANGE THE ROOM ↻
          </button>
          <Link href={world.href} style={{ border: `1px solid ${p.accent}`, color: p.fg, padding: "14px 24px", fontSize: 12, letterSpacing: "0.15em" }}>
            ENTER {world.name} →
          </Link>
        </div>
      </div>
    </section>
  );
}

function SelReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.disconnect();
          }
        }
      },
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="sel-reveal">
      {children}
    </div>
  );
}
