"use client";

import { Suspense, useState } from "react";
import { CapFilter, WorldField } from "./rb3/WorldField";
import { WorldMap } from "./evo/WorldMap";

/**
 * Landing slots for the techno/paper feels. The field components are
 * verbatim copies of the 8151/8154 sources (import paths only); this file
 * is just the frame they hang in.
 */
export function ZipTechnoField() {
  const [sel, setSel] = useState<string[]>([]);
  return (
    <div className="zip-rb3">
      <section id="space" aria-label="Space: all fifteen worlds" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", background: "#09090a" }}>
        <div style={{ padding: "40px var(--pad) 0" }}>
          <CapFilter sel={sel} setSel={setSel} />
        </div>
        <WorldField sel={sel} tall />
      </section>
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
