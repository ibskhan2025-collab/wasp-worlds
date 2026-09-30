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

      <Identity />

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
 * Identity: who, what, and the manifesto — the human before the museum.
 * Capability map links each discipline to the world that proves it.
 */
const CAPS: [string, [string, string][]][] = [
  ["DESIGN", [["Branding", "/worlds/noir"], ["Art Direction", "/worlds/still"], ["Typography", "/worlds/archive"], ["Editorial", "/worlds/archive/reading"], ["Identity", "/worlds/motion"]]],
  ["DIGITAL", [["Websites", "/worlds/casa"], ["UX/UI", "/worlds/orbit"], ["SaaS", "/worlds/orbit/forecast"], ["E-commerce", "/worlds/objects"], ["Product", "/worlds/forge/compare"]]],
  ["CODE", [["Creative Coding", "/worlds/void"], ["Generative Systems", "/worlds/void/orbit"], ["Games", "/worlds/signal"], ["Data Visualization", "/worlds/vector/chart"], ["Interaction", "/worlds/void/field"]]],
  ["MOTION / 3D", [["Motion", "/worlds/motion"], ["WebGL", "/worlds/nest/volume"], ["3D Environments", "/worlds/nest/walk"], ["Camera Systems", "/worlds/objects/turntable"]]],
  ["EXPERIMENTAL", [["Prototypes", "/lab"], ["Interactive Art", "/worlds/void/abyss"], ["New Interfaces", "/worlds/civic/desk"]]],
];

function Identity() {
  return (
    <section aria-label="The studio" style={{ borderBottom: "1px solid var(--line)", padding: "56px var(--pad) 48px" }}>
      <p className="kicker">THE STUDIO · ONE HUMAN · EST. 2026</p>
      <h2 className="display" style={{ maxWidth: "22ch" }}>
        WASP is the working portfolio of Ibrahim&nbsp;F.&nbsp;Khan — designer and builder of websites that behave like places.
      </h2>
      <div className="grid-2" style={{ marginTop: 28 }}>
        <div>
          <p className="kicker">Manifesto</p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", lineHeight: 1.6 }}>
            Most portfolios show pictures of work. This one shows work. Every room below operates — carts add,
            bookings store, games keep score. If it doesn&apos;t run, it isn&apos;t here.
          </p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", lineHeight: 1.6 }}>
            Range is the point and the risk. Fifteen worlds in fifteen visual languages, because a studio should
            create a style for the problem — not drag one style across every problem.
          </p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", lineHeight: 1.6 }}>
            And restraint where it counts: no invented clients, no invented numbers, no screenshots posing as
            product. The frames stay reserved until reality fills them. <Link href="/studio/proof" style={{ textDecoration: "underline" }}>The policy →</Link>
          </p>
        </div>
        <div>
          <p className="kicker">Capability map — every claim links to proof</p>
          {CAPS.map(([group, items]) => (
            <div key={group} style={{ padding: "12px 0", borderTop: "1px solid var(--line)" }}>
              <p className="kicker" style={{ margin: "0 0 6px" }}>{group}</p>
              <p style={{ margin: 0 }}>
                {items.map(([label, href], i) => (
                  <span key={label}>
                    <Link href={href} style={{ textDecoration: "underline" }}>{label}</Link>
                    {i < items.length - 1 ? <span style={{ color: "var(--muted)" }}> · </span> : null}
                  </span>
                ))}
              </p>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
            <Link className="btn" href="/start">Start a project</Link>
            <Link className="btn ghost" href="/studio">The studio</Link>
          </div>
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
