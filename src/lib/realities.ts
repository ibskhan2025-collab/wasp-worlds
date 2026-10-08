import type { WorldId } from "./types";
import { loadJson, saveJson } from "./storage";

export type RealityTokens = {
  "--bg": string;
  "--fg": string;
  "--muted": string;
  "--line": string;
  "--accent": string;
};

export type Reality = {
  id: string;
  label: string;
  note: string;
  /** Color foundation. A reality is never ONLY this — see layout. */
  tokens: Partial<RealityTokens>;
  /**
   * Which renderer serves this reality. "classic" = the world's authored
   * pages. Named layouts map to alternate components in the reality
   * renderer registry.
   */
  layout: string;
};

const CLASSIC = (label: string, note: string): Reality => ({ id: "classic", label, note, tokens: {}, layout: "classic" });
const ALT = (id: string, label: string, note: string, layout: string, tokens: RealityTokens): Reality =>
  ({ id, label, note, tokens, layout });

export const REALITIES: Record<WorldId, Reality[]> = {
  casa: [
    CLASSIC("Classic", "Bone on near-black, serif, slow"),
    ALT("spatial", "Spatial", "The dining room in 3D", "spatial",
      { "--bg": "#171310", "--fg": "#e8e0d2", "--muted": "#8a7f6e", "--line": "rgba(232,224,210,0.25)", "--accent": "#c9803f" }),
    ALT("oceanic", "Oceanic", "The room floods. Depth replaces pages; the menu floats.", "rb15",
      { "--bg": "#2a1810", "--fg": "#f4e6d0", "--muted": "#f4e6d0", "--line": "rgba(128,128,128,0.35)", "--accent": "#d9763a" }),
    ALT("3d", "3D", "Walk the dining room, inspect a table, book it.", "rb15",
      { "--bg": "#2a1810", "--fg": "#f4e6d0", "--muted": "#f4e6d0", "--line": "rgba(128,128,128,0.35)", "--accent": "#d9763a" }),
    ALT("brutalist", "Brutalist", "Typography is the building. The menu is a ledger.", "rb15",
      { "--bg": "#2a1810", "--fg": "#f4e6d0", "--muted": "#f4e6d0", "--line": "rgba(128,128,128,0.35)", "--accent": "#d9763a" }),
    ALT("japanese", "Japanese", "Quiet, vertical, and mostly silence.", "rb15",
      { "--bg": "#2a1810", "--fg": "#f4e6d0", "--muted": "#f4e6d0", "--line": "rgba(128,128,128,0.35)", "--accent": "#d9763a" }),
  ],
  noir: [
    ALT("editorial", "Editorial", "A magazine that sells. Big serif, asymmetric layout.", "rb15",
      { "--bg": "#0d0d0d", "--fg": "#eee9e0", "--muted": "#eee9e0", "--line": "rgba(128,128,128,0.35)", "--accent": "#b89b6a" }),
    ALT("archive", "Archive", "The collection as a catalogue raisonne: index, lot numbers, specs.", "rb15",
      { "--bg": "#0d0d0d", "--fg": "#eee9e0", "--muted": "#eee9e0", "--line": "rgba(128,128,128,0.35)", "--accent": "#b89b6a" }),
    ALT("showroom", "3D Showroom", "Pieces on pedestals in a dark room. Orbit, select, buy.", "rb15",
      { "--bg": "#0d0d0d", "--fg": "#eee9e0", "--muted": "#eee9e0", "--line": "rgba(128,128,128,0.35)", "--accent": "#b89b6a" }),
  ],
  orbit: [
    ALT("console", "Console", "Dense, dark, sidebar-driven operator view.", "rb15",
      { "--bg": "#0a0f1c", "--fg": "#dbe4ff", "--muted": "#dbe4ff", "--line": "rgba(128,128,128,0.35)", "--accent": "#5b8cff" }),
    ALT("paper", "Paper", "The same data as a calm, light, top-tabbed executive workspace.", "rb15",
      { "--bg": "#0a0f1c", "--fg": "#dbe4ff", "--muted": "#dbe4ff", "--line": "rgba(128,128,128,0.35)", "--accent": "#5b8cff" }),
  ],
  still: [
    ALT("gallery", "Gallery", "Collections, filters, fullscreen viewer, favourites.", "rb15",
      { "--bg": "#111110", "--fg": "#e7e2d8", "--muted": "#e7e2d8", "--line": "rgba(128,128,128,0.35)", "--accent": "#c8b88a" }),
    ALT("contact", "Contact sheet", "Every frame on one sheet, marked with a grease pencil.", "rb15",
      { "--bg": "#111110", "--fg": "#e7e2d8", "--muted": "#e7e2d8", "--line": "rgba(128,128,128,0.35)", "--accent": "#c8b88a" }),
    ALT("hall", "Virtual hall", "A white-walled gallery in 3D. Walk, approach, look closer.", "rb15",
      { "--bg": "#111110", "--fg": "#e7e2d8", "--muted": "#e7e2d8", "--line": "rgba(128,128,128,0.35)", "--accent": "#c8b88a" }),
  ],
  signal: [
    ALT("arcade", "Arcade", "Phosphor, scanlines and pixel type.", "rb15",
      { "--bg": "#05070d", "--fg": "#9cf7ff", "--muted": "#9cf7ff", "--line": "rgba(128,128,128,0.35)", "--accent": "#ff2e7e" }),
    ALT("ink", "Ink", "The same rules drawn like a quiet notebook. Lower contrast, slower feel.", "rb15",
      { "--bg": "#05070d", "--fg": "#9cf7ff", "--muted": "#9cf7ff", "--line": "rgba(128,128,128,0.35)", "--accent": "#ff2e7e" }),
  ],
  objects: [
    ALT("workshop", "Workshop", "Maker-first: the people before the products.", "rb15",
      { "--bg": "#e8e0d2", "--fg": "#2b2620", "--muted": "#2b2620", "--line": "rgba(128,128,128,0.35)", "--accent": "#a4573a" }),
    ALT("inspect", "3D Shelf", "Pieces turned on a lathe, inspectable from any side.", "rb15",
      { "--bg": "#e8e0d2", "--fg": "#2b2620", "--muted": "#2b2620", "--line": "rgba(128,128,128,0.35)", "--accent": "#a4573a" }),
  ],
  archive: [
    ALT("journal", "Journal", "Single-column reading. Progress, bookmarks, calm.", "rb15",
      { "--bg": "#f3efe6", "--fg": "#1c1a17", "--muted": "#1c1a17", "--line": "rgba(128,128,128,0.35)", "--accent": "#8c2f1b" }),
    ALT("broadsheet", "Broadsheet", "Columns, rules, dense front page.", "rb15",
      { "--bg": "#f3efe6", "--fg": "#1c1a17", "--muted": "#1c1a17", "--line": "rgba(128,128,128,0.35)", "--accent": "#8c2f1b" }),
    ALT("index", "Index", "Plain monospaced catalogue for searching and scanning.", "rb15",
      { "--bg": "#f3efe6", "--fg": "#1c1a17", "--muted": "#1c1a17", "--line": "rgba(128,128,128,0.35)", "--accent": "#8c2f1b" }),
  ],
  motion: [
    ALT("stage", "Stage", "Scroll-driven chapters and a live easing playground.", "rb15",
      { "--bg": "#0c0c0c", "--fg": "#f2f2ee", "--muted": "#f2f2ee", "--line": "rgba(128,128,128,0.35)", "--accent": "#c6ff3d" }),
    ALT("dopesheet", "Dopesheet", "The same animations as a timeline you can scrub.", "rb15",
      { "--bg": "#0c0c0c", "--fg": "#f2f2ee", "--muted": "#f2f2ee", "--line": "rgba(128,128,128,0.35)", "--accent": "#c6ff3d" }),
  ],
  void: [
    ALT("particles", "Particles", "Attraction, repulsion and pointer physics on canvas.", "rb15",
      { "--bg": "#000000", "--fg": "#d8d8ff", "--muted": "#d8d8ff", "--line": "rgba(128,128,128,0.35)", "--accent": "#7a5cff" }),
    ALT("liquid", "Liquid", "The same bodies, rendered as merging metaballs.", "rb15",
      { "--bg": "#000000", "--fg": "#d8d8ff", "--muted": "#d8d8ff", "--line": "rgba(128,128,128,0.35)", "--accent": "#7a5cff" }),
    ALT("gravity", "Gravity", "Orbits. Hold to add mass, release to slingshot.", "rb15",
      { "--bg": "#000000", "--fg": "#d8d8ff", "--muted": "#d8d8ff", "--line": "rgba(128,128,128,0.35)", "--accent": "#7a5cff" }),
    ALT("shader", "Shader", "A fragment shader in raw GLSL, driven by the pointer.", "rb15",
      { "--bg": "#000000", "--fg": "#d8d8ff", "--muted": "#d8d8ff", "--line": "rgba(128,128,128,0.35)", "--accent": "#7a5cff" }),
    ALT("space", "3D", "A volume of points with real depth, steered by the pointer.", "rb15",
      { "--bg": "#000000", "--fg": "#d8d8ff", "--muted": "#d8d8ff", "--line": "rgba(128,128,128,0.35)", "--accent": "#7a5cff" }),
  ],
  atlas: [
    ALT("map", "Map", "Pan, zoom and plot routes on a flat SVG atlas.", "rb15",
      { "--bg": "#13263a", "--fg": "#f1e9d6", "--muted": "#f1e9d6", "--line": "rgba(128,128,128,0.35)", "--accent": "#e8a33d" }),
    ALT("globe", "Globe", "The trip on a rotating globe with arcs between stops.", "rb15",
      { "--bg": "#13263a", "--fg": "#f1e9d6", "--muted": "#f1e9d6", "--line": "rgba(128,128,128,0.35)", "--accent": "#e8a33d" }),
  ],
  forge: [
    ALT("catalogue", "Datasheet", "Specs, parametric diagrams and the quote builder.", "rb15",
      { "--bg": "#15171a", "--fg": "#e6e8ea", "--muted": "#e6e8ea", "--line": "rgba(128,128,128,0.35)", "--accent": "#ffb400" }),
    ALT("inspect", "3D Inspect", "Rotate, section and measure the actual part.", "rb15",
      { "--bg": "#15171a", "--fg": "#e6e8ea", "--muted": "#e6e8ea", "--line": "rgba(128,128,128,0.35)", "--accent": "#ffb400" }),
    ALT("blueprint", "Blueprint", "Drafting-table view of the same parametric drawings.", "rb15",
      { "--bg": "#15171a", "--fg": "#e6e8ea", "--muted": "#e6e8ea", "--line": "rgba(128,128,128,0.35)", "--accent": "#ffb400" }),
  ],
  pulse: [
    ALT("label", "Label", "Giant type, generative covers, tracklists.", "rb15",
      { "--bg": "#e5ff3a", "--fg": "#0a0a0a", "--muted": "#0a0a0a", "--line": "rgba(128,128,128,0.35)", "--accent": "#ff3b1f" }),
    ALT("board", "Departures", "Tour dates as a split-flap board.", "rb15",
      { "--bg": "#e5ff3a", "--fg": "#0a0a0a", "--muted": "#0a0a0a", "--line": "rgba(128,128,128,0.35)", "--accent": "#ff3b1f" }),
    ALT("sound", "Sound", "Generative audio per release, with a live analyser.", "rb15",
      { "--bg": "#e5ff3a", "--fg": "#0a0a0a", "--muted": "#0a0a0a", "--line": "rgba(128,128,128,0.35)", "--accent": "#ff3b1f" }),
  ],
  civic: [
    ALT("standard", "Standard", "Clear, plain-language service.", "rb15",
      { "--bg": "#ffffff", "--fg": "#0b0c0c", "--muted": "#0b0c0c", "--line": "rgba(128,128,128,0.35)", "--accent": "#1d70b8" }),
    ALT("contrast", "High contrast", "Large type, strong contrast, reduced layout.", "rb15",
      { "--bg": "#ffffff", "--fg": "#0b0c0c", "--muted": "#0b0c0c", "--line": "rgba(128,128,128,0.35)", "--accent": "#1d70b8" }),
    ALT("plain", "Plain text", "Text-only, no decoration, lightest possible.", "rb15",
      { "--bg": "#ffffff", "--fg": "#0b0c0c", "--muted": "#0b0c0c", "--line": "rgba(128,128,128,0.35)", "--accent": "#1d70b8" }),
  ],
  nest: [
    ALT("blueprint", "Blueprint", "Drafting-style SVG plan with dimensions.", "rb15",
      { "--bg": "#e9e5dc", "--fg": "#23211d", "--muted": "#23211d", "--line": "rgba(128,128,128,0.35)", "--accent": "#3d6b5a" }),
    ALT("material", "Material", "Swatch-led view: choose floors, walls, cladding.", "rb15",
      { "--bg": "#e9e5dc", "--fg": "#23211d", "--muted": "#23211d", "--line": "rgba(128,128,128,0.35)", "--accent": "#3d6b5a" }),
    ALT("3d", "3D", "Explore the house: cutaway, walk mode, time of day.", "rb15",
      { "--bg": "#e9e5dc", "--fg": "#23211d", "--muted": "#23211d", "--line": "rgba(128,128,128,0.35)", "--accent": "#3d6b5a" }),
  ],
  vector: [
    ALT("terminal", "Terminal", "Dark, dense, monospaced.", "rb15",
      { "--bg": "#06120f", "--fg": "#d4ffe9", "--muted": "#d4ffe9", "--line": "rgba(128,128,128,0.35)", "--accent": "#2cff9a" }),
    ALT("report", "Report", "Light, typographic, print-quality.", "rb15",
      { "--bg": "#06120f", "--fg": "#d4ffe9", "--muted": "#d4ffe9", "--line": "rgba(128,128,128,0.35)", "--accent": "#2cff9a" }),
    ALT("surface", "3D Surface", "Quarter-by-strategy returns as a navigable terrain.", "rb15",
      { "--bg": "#06120f", "--fg": "#d4ffe9", "--muted": "#d4ffe9", "--line": "rgba(128,128,128,0.35)", "--accent": "#2cff9a" }),
  ],
};


export function loadReality(world: WorldId): string {
  const saved = loadJson<string>(`wx:${world}`, "classic");
  const list = REALITIES[world] ?? [];
  return list.some((r) => r.id === saved) ? saved : "classic";
}

export function saveReality(world: WorldId, id: string) {
  saveJson(`wx:${world}`, id);
}

export function getReality(world: WorldId, id: string) {
  return (REALITIES[world] ?? []).find((r) => r.id === id) ?? null;
}
