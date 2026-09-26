"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWasp } from "@/context/wasp-context";
import { FEELS, INTENTS, MOTIONS } from "@/lib/types";
import { INTENT_COPY, WORLDS, recommendWorlds } from "@/lib/worlds";
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
                <div className="room-id">ROOM {world.room}{rec ? " · FOR YOU" : ""}</div>
                <h2>{world.name}</h2>
                <div className="kind">{world.kind}</div>
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
