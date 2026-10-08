import dynamic from "next/dynamic";
import type { ComponentType } from "react";

function loading(label: string) {
  return function Loading() {
    return (
      <div style={{ minHeight: "60dvh", display: "grid", placeItems: "center", background: "#000", color: "#fff" }}>
        <p style={{ fontFamily: "monospace", letterSpacing: "0.2em", fontSize: 12 }}>ENTERING {label}…</p>
      </div>
    );
  };
}

/**
 * Alternate-reality renderers, code-split per reality so no visitor
 * downloads realities they never enter (performance requirement).
 * Export names must match: {World}{Reality} in each world's file.
 */
const R: Record<string, Record<string, ComponentType>> = {
  casa: {
    spatial: dynamic(() => import("@/components/worlds/casa-spatial").then((m) => m.CasaSpatial), { loading: loading("SPATIAL") }),
  },
  noir: {

  },
  orbit: {

  },
  still: {

  },
  signal: {

  },
  objects: {

  },
  archive: {

  },
  motion: {

  },
  void: {

  },
  atlas: {

  },
  forge: {

  },
  pulse: {

  },
  civic: {

  },
  nest: {

  },
  vector: {

  },
};

export function getRenderer(world: string, reality: string): ComponentType | null {
  return R[world]?.[reality] ?? null;
}
