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
    oceanic: dynamic(() => import("@/components/worlds/casa-realities").then((m) => m.CasaOceanic), { loading: loading("OCEANIC") }),
    analog: dynamic(() => import("@/components/worlds/casa-realities").then((m) => m.CasaAnalog), { loading: loading("ANALOG") }),
    zen: dynamic(() => import("@/components/worlds/casa-realities").then((m) => m.CasaZen), { loading: loading("ZEN") }),
  },
  noir: {
    brutalist: dynamic(() => import("@/components/worlds/noir-brutalist").then((m) => m.NoirBrutalist), { loading: loading("BRUTALIST") }),
    analog: dynamic(() => import("@/components/worlds/noir-realities").then((m) => m.NoirAnalog), { loading: loading("ANALOG") }),
    future: dynamic(() => import("@/components/worlds/noir-realities").then((m) => m.NoirFuture), { loading: loading("FUTURE") }),
  },
  orbit: {
    console: dynamic(() => import("@/components/worlds/orbit-realities").then((m) => m.OrbitConsole), { loading: loading("CONSOLE") }),
    compact: dynamic(() => import("@/components/worlds/orbit-realities").then((m) => m.OrbitCompact), { loading: loading("COMPACT") }),
    brutalist: dynamic(() => import("@/components/worlds/orbit-realities").then((m) => m.OrbitRaw), { loading: loading("RAW") }),
  },
  still: {
    negative: dynamic(() => import("@/components/worlds/still-realities").then((m) => m.StillNegative), { loading: loading("NEGATIVE") }),
    contact: dynamic(() => import("@/components/worlds/still-realities").then((m) => m.StillContact), { loading: loading("CONTACT") }),
    gallery: dynamic(() => import("@/components/worlds/still-realities").then((m) => m.StillGallery), { loading: loading("GALLERY") }),
  },
  signal: {
    mono: dynamic(() => import("@/components/worlds/signal-realities").then((m) => m.SignalMono), { loading: loading("MONO") }),
    paper: dynamic(() => import("@/components/worlds/signal-realities").then((m) => m.SignalPaper), { loading: loading("PAPER") }),
    future: dynamic(() => import("@/components/worlds/signal-realities").then((m) => m.SignalFuture), { loading: loading("QUANTUM") }),
  },
  objects: {
    tidal: dynamic(() => import("@/components/worlds/objects-realities").then((m) => m.ObjectsTidal), { loading: loading("TIDAL") }),
    catalogue: dynamic(() => import("@/components/worlds/objects-realities").then((m) => m.ObjectsCatalogue), { loading: loading("CATALOGUE") }),
    playful: dynamic(() => import("@/components/worlds/objects-realities").then((m) => m.ObjectsPlayful), { loading: loading("PLAY") }),
    turntable: dynamic(() => import("@/components/worlds/objects-turntable").then((m) => m.ObjectsTurntable), { loading: loading("TURNTABLE") }),
  },
  archive: {
    typer: dynamic(() => import("@/components/worlds/archive-realities").then((m) => m.ArchiveTyper), { loading: loading("TYPER") }),
    terminal: dynamic(() => import("@/components/worlds/archive-realities").then((m) => m.ArchiveTerminal), { loading: loading("TERMINAL") }),
    poster: dynamic(() => import("@/components/worlds/archive-realities").then((m) => m.ArchivePoster), { loading: loading("POSTER") }),
  },
  motion: {
    timing: dynamic(() => import("@/components/worlds/motion-realities").then((m) => m.MotionTiming), { loading: loading("TIMING") }),
    cinema: dynamic(() => import("@/components/worlds/motion-realities").then((m) => m.MotionCinema), { loading: loading("CINEMA") }),
    oceanic: dynamic(() => import("@/components/worlds/motion-realities").then((m) => m.MotionOceanic), { loading: loading("FLUID") }),
  },
  void: {
    abyss: dynamic(() => import("@/components/worlds/void-realities").then((m) => m.VoidAbyss), { loading: loading("ABYSS") }),
    ink: dynamic(() => import("@/components/worlds/void-realities").then((m) => m.VoidInk), { loading: loading("INK") }),
    reactor: dynamic(() => import("@/components/worlds/void-realities").then((m) => m.VoidReactor), { loading: loading("REACTOR") }),
  },
  atlas: {
    expedition: dynamic(() => import("@/components/worlds/atlas-realities").then((m) => m.AtlasExpedition), { loading: loading("EXPEDITION") }),
    field: dynamic(() => import("@/components/worlds/atlas-realities").then((m) => m.AtlasField), { loading: loading("FIELD") }),
    cinematic: dynamic(() => import("@/components/worlds/atlas-realities").then((m) => m.AtlasCinema), { loading: loading("CINEMA") }),
    miniature: dynamic(() => import("@/components/worlds/atlas-miniature").then((m) => m.AtlasMiniature), { loading: loading("MINIATURE") }),
  },
  forge: {
    blueprint: dynamic(() => import("@/components/worlds/forge-realities").then((m) => m.ForgeBlueprint), { loading: loading("BLUEPRINT") }),
    datasheet: dynamic(() => import("@/components/worlds/forge-realities").then((m) => m.ForgeDatasheet), { loading: loading("DATASHEET") }),
    analog: dynamic(() => import("@/components/worlds/forge-realities").then((m) => m.ForgeAnalog), { loading: loading("MICROFICHE") }),
    viewer: dynamic(() => import("@/components/worlds/forge-viewer").then((m) => m.ForgeViewer), { loading: loading("VIEWER") }),
  },
  pulse: {
    flyer: dynamic(() => import("@/components/worlds/pulse-realities").then((m) => m.PulseFlyer), { loading: loading("FLYER") }),
    vinyl: dynamic(() => import("@/components/worlds/pulse-realities").then((m) => m.PulseVinyl), { loading: loading("VINYL") }),
    oceanic: dynamic(() => import("@/components/worlds/pulse-realities").then((m) => m.PulseOceanic), { loading: loading("SUBMERGED") }),
  },
  civic: {
    noticeboard: dynamic(() => import("@/components/worlds/civic-realities").then((m) => m.CivicNoticeboard), { loading: loading("NOTICEBOARD") }),
    paperform: dynamic(() => import("@/components/worlds/civic-realities").then((m) => m.CivicPaperform), { loading: loading("PAPERFORM") }),
    kiosk: dynamic(() => import("@/components/worlds/civic-realities").then((m) => m.CivicKiosk), { loading: loading("KIOSK") }),
  },
  nest: {
    drawing: dynamic(() => import("@/components/worlds/nest-realities").then((m) => m.NestDrawing), { loading: loading("DRAWING") }),
    simulated: dynamic(() => import("@/components/worlds/nest-realities").then((m) => m.NestSimulated), { loading: loading("SIMULATED") }),
    mockup: dynamic(() => import("@/components/worlds/nest-realities").then((m) => m.NestMockup), { loading: loading("MOCKUP") }),
    walk: dynamic(() => import("@/components/worlds/nest-walk").then((m) => m.NestWalk), { loading: loading("WALK") }),
    volume: dynamic(() => import("@/components/worlds/nest-volume").then((m) => m.NestVolume), { loading: loading("VOLUME") }),
  },
  vector: {
    ledger: dynamic(() => import("@/components/worlds/vector-realities").then((m) => m.VectorLedger), { loading: loading("LEDGER") }),
    filing: dynamic(() => import("@/components/worlds/vector-realities").then((m) => m.VectorFiling), { loading: loading("FILING") }),
    surface: dynamic(() => import("@/components/worlds/vector-realities").then((m) => m.VectorSurface), { loading: loading("SURFACE") }),
  },
};

export function getRenderer(world: string, reality: string): ComponentType | null {
  return R[world]?.[reality] ?? null;
}
