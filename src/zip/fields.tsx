"use client";

import { Suspense } from "react";
import Opening from "./rb3/Opening";
import Universe from "./rb3/Universe";
import { Hero as EvoHero } from "./evo/Home";
import { WorldMap } from "./evo/WorldMap";
import { useWasp } from "@/context/wasp-context";
import { FEELS, INTENTS, MOTIONS } from "@/lib/types";

/**
 * Landing slots for the techno/paper feels. The 8151/8154 components are
 * verbatim copies of their sources (import paths only); this file is just
 * the frame they hang in.
 */
export function ZipOpening() {
  return (
    <div className="zip-rb3">
      <Opening />
    </div>
  );
}

export function ZipTechnoField() {
  return (
    <div className="zip-rb3">
      <Universe />
    </div>
  );
}

/** Techno-only landing: Opening + Universe with our intent/feel blocks slotted in. */
export function ZipTechnoLanding() {
  return (
    <div className="zip-rb3">
      <Opening afterCtas={<TechnoIntents />} beforeCounts={<TechnoSwitches />} />
      <Universe />
    </div>
  );
}

function TechnoIntents() {
  const wasp = useWasp();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }} role="list">
      {INTENTS.map((item) => (
        <button
          key={item.id}
          role="listitem"
          className={wasp.intent === item.id ? "chip-on" : "chip"}
          type="button"
          title={item.hint}
          onClick={() => wasp.setIntent(wasp.intent === item.id ? null : item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function TechnoSwitches() {
  const wasp = useWasp();
  return (
    <div style={{ maxWidth: 640 }}>
      <p style={{ fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", margin: "0 0 18px" }}>
        This is not a grid of case studies. Each world is an argument for what the web can be — a place, a product, a store, a publication, a machine, an experiment.
      </p>
      <p style={{ fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", margin: "0 0 8px" }}>
        Feel
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
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
      <p style={{ fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", margin: "14px 0 8px" }}>
        Motion
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
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
  );
}

export function ZipHero() {
  return (
    <div className="zip-evo">
      <EvoHero />
    </div>
  );
}

export function ZipPaperMap() {
  return (
    <div className="zip-evo">
      <Suspense fallback={<p style={{ padding: 96 }}>Plotting worlds…</p>}>
        <WorldMap />
      </Suspense>
    </div>
  );
}
