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
    ALT("oceanic", "Oceanic", "The dining room floods", "oceanic",
      { "--bg": "#06222b", "--fg": "#e8f4f0", "--muted": "#6fa3a5", "--line": "rgba(232,244,240,0.16)", "--accent": "#2ea8a0" }),
    ALT("analog", "Analog", "Letterpress menu card", "analog",
      { "--bg": "#e5d5b8", "--fg": "#2a2018", "--muted": "#7a6a54", "--line": "#c3ab7f", "--accent": "#8a3b1f" }),
    ALT("zen", "Zen", "Japanese service, vertical rhythm", "zen",
      { "--bg": "#f2efe6", "--fg": "#2a2723", "--muted": "#7a7268", "--line": "rgba(42,39,35,0.14)", "--accent": "#5a6e3f" }),
    ALT("counter", "Counter", "Eight seats at the pass", "counter",
      { "--bg": "#140f0c", "--fg": "#f3e8d8", "--muted": "#c9a98a", "--line": "rgba(243,232,216,0.25)", "--accent": "#ff5a2e" }),
    ALT("cellar", "Cellar", "The wine book, by the glass", "cellar",
      { "--bg": "#171008", "--fg": "#e9dcc0", "--muted": "#a08a60", "--line": "rgba(185,138,61,0.4)", "--accent": "#b98a3d" }),
  ],
  noir: [
    CLASSIC("Classic", "Absolute black, grayscale"),
    ALT("brutalist", "Brutalist", "Grid, border, no mercy", "brutalist",
      { "--bg": "#f4f1ea", "--fg": "#111111", "--muted": "#555555", "--line": "#111111", "--accent": "#c41e3a" }),
    ALT("analog", "Analog", "Photocopied lookbook", "analog",
      { "--bg": "#cfcfcf", "--fg": "#111111", "--muted": "#555555", "--line": "#111111", "--accent": "#111111" }),
    ALT("future", "Future", "Atelier 2049", "future",
      { "--bg": "#05070d", "--fg": "#dfe8ff", "--muted": "#7f8fb0", "--line": "rgba(223,232,255,0.18)", "--accent": "#6fc3ff" }),
    ALT("runway", "Runway", "The collection in show order", "runway",
      { "--bg": "#0a0a0a", "--fg": "#f4f1ea", "--muted": "#8a8580", "--line": "rgba(244,241,234,0.15)", "--accent": "#f4f1ea" }),
    ALT("atelier", "Atelier", "Toiles, cloth, cutting notes", "atelier",
      { "--bg": "#efe9dc", "--fg": "#1a1712", "--muted": "#6b6254", "--line": "#1a1712", "--accent": "#8a3b1f" }),
  ],
  orbit: [
    CLASSIC("Product", "Light, dense, boring on purpose"),
    ALT("console", "Console", "Dark operations HUD", "console",
      { "--bg": "#101311", "--fg": "#e6efe8", "--muted": "#7d8a80", "--line": "#2a332c", "--accent": "#3ddc84" }),
    ALT("compact", "Compact", "Maximum rows, minimum air", "compact",
      { "--bg": "#e4e6e0", "--fg": "#161615", "--muted": "#6d6f69", "--line": "#c9ccc2", "--accent": "#b24a2e" }),
    ALT("brutalist", "Raw", "Everything is a table", "brutalist",
      { "--bg": "#f4f4f0", "--fg": "#111111", "--muted": "#555555", "--line": "#111111", "--accent": "#b24a2e" }),
    ALT("standup", "Standup", "The board, read aloud", "standup",
      { "--bg": "#f6f1e6", "--fg": "#23201a", "--muted": "#6b6254", "--line": "rgba(35,32,26,0.2)", "--accent": "#8a3b1f" }),
    ALT("forecast", "Forecast", "Pipeline and revenue bars", "forecast",
      { "--bg": "#0d1420", "--fg": "#dfe8f2", "--muted": "#7f8fb0", "--line": "rgba(223,232,242,0.25)", "--accent": "#6fc3ff" }),
  ],
  still: [
    CLASSIC("Paper", "Warm paper, black serif"),
    ALT("negative", "Negative", "Inverted, for night editing", "negative",
      { "--bg": "#0c0c0c", "--fg": "#ececec", "--muted": "#8a8a8a", "--line": "#2c2c2c", "--accent": "#ececec" }),
    ALT("contact", "Contact", "Edge numbers, grease pencil", "contact",
      { "--bg": "#e2d5b8", "--fg": "#241f16", "--muted": "#7a6a54", "--line": "#bfa87c", "--accent": "#8a3b1f" }),
    ALT("gallery", "Gallery", "One wall, hung straight", "gallery",
      { "--bg": "#e6ddc8", "--fg": "#201a12", "--muted": "#7a6a54", "--line": "#c0ab7f", "--accent": "#8a3b1f" }),
    ALT("darkroom", "Darkroom", "Trays, times, safelight", "darkroom",
      { "--bg": "#120d0d", "--fg": "#e8d8c8", "--muted": "#a89880", "--line": "rgba(232,216,200,0.3)", "--accent": "#ff5a5a" }),
    ALT("folio", "Folio", "One plate at a time", "folio",
      { "--bg": "#f4f1ea", "--fg": "#111111", "--muted": "#6a655e", "--line": "#111111", "--accent": "#111111" }),
  ],
  signal: [
    CLASSIC("Amber CRT", "Monochrome phosphor"),
    ALT("mono", "Mono", "Pure contrast", "mono",
      { "--bg": "#000000", "--fg": "#ffffff", "--muted": "#999999", "--line": "#333333", "--accent": "#ffffff" }),
    ALT("paper", "Paper drill", "Ink on graph paper", "paper",
      { "--bg": "#efe9dc", "--fg": "#1a1712", "--muted": "#6b6254", "--line": "#c9bfa8", "--accent": "#b24a2e" }),
    ALT("future", "Quantum", "Cold vector sweep", "signal-future",
      { "--bg": "#04070c", "--fg": "#9fd8ff", "--muted": "#5f7f99", "--line": "rgba(159,216,255,0.18)", "--accent": "#6fc3ff" }),
    ALT("arcade", "Arcade", "One coin, one play", "arcade",
      { "--bg": "#0b0d12", "--fg": "#ffd23f", "--muted": "#8a93a5", "--line": "#2a2f3a", "--accent": "#ff5a5a" }),
    ALT("pocket", "Pocket", "The game, handheld", "pocket",
      { "--bg": "#9aa27e", "--fg": "#23281c", "--muted": "#5a6e3f", "--line": "#3a4034", "--accent": "#23281c" }),
  ],
  objects: [
    CLASSIC("Bone", "Editorial neutral"),
    ALT("tidal", "Tidal", "Coastal glaze palette", "tidal",
      { "--bg": "#dfe9e4", "--fg": "#14302a", "--muted": "#5f7a70", "--line": "#bccfc6", "--accent": "#0f6f5c" }),
    ALT("catalogue", "Catalogue", "1974 mail-order print", "catalogue",
      { "--bg": "#e8ddc4", "--fg": "#2a2118", "--muted": "#7a6a54", "--line": "#c0ab7e", "--accent": "#8a3b1f" }),
    ALT("turntable", "Turntable", "The catalogue as an object", "turntable",
      { "--bg": "#141210", "--fg": "#efeae2", "--muted": "#a89a80", "--line": "rgba(239,234,226,0.2)", "--accent": "#e2c08d" }),
    ALT("playful", "Play", "Elastic, warm, loud type", "playful",
      { "--bg": "#fff3d6", "--fg": "#241a12", "--muted": "#8a6f52", "--line": "rgba(36,26,18,0.16)", "--accent": "#e2542e" }),
    ALT("storeroom", "Storeroom", "Bins, variants, no hiding", "storeroom",
      { "--bg": "#1a1a1a", "--fg": "#e8e4da", "--muted": "#a89a80", "--line": "rgba(232,228,218,0.3)", "--accent": "#e2c08d" }),
    ALT("gift", "Gift", "The stock, ready to give", "gift",
      { "--bg": "#fbf3e4", "--fg": "#3a2a1a", "--muted": "#8a6f52", "--line": "#3a2a1a", "--accent": "#8a3b1f" }),
  ],
  archive: [
    CLASSIC("Parchment", "Newsprint, dense columns"),
    ALT("typer", "Typer", "Monospace manuscript", "typer",
      { "--bg": "#ece7db", "--fg": "#1a1712", "--muted": "#6b6254", "--line": "#cfc4ab", "--accent": "#1a1712" }),
    ALT("terminal", "Terminal", "Reading at night, green", "terminal",
      { "--bg": "#0c120c", "--fg": "#cfe3c8", "--muted": "#7a8f72", "--line": "rgba(207,227,200,0.16)", "--accent": "#3ddc84" }),
    ALT("poster", "Poster", "Headline as object", "poster",
      { "--bg": "#14100c", "--fg": "#f3ead8", "--muted": "#a08a70", "--line": "rgba(243,234,216,0.16)", "--accent": "#e23a3a" }),
    ALT("stacks", "Stacks", "Shelves you pull from", "stacks",
      { "--bg": "#241a12", "--fg": "#e8ddc4", "--muted": "#a89878", "--line": "#3a2c1c", "--accent": "#c9a86d" }),
    ALT("reading", "Reading", "One essay, full stamina", "reading",
      { "--bg": "#faf7f0", "--fg": "#141210", "--muted": "#6a6254", "--line": "rgba(20,18,16,0.2)", "--accent": "#8a3b1f" }),
  ],
  motion: [
    CLASSIC("Campaign", "Full-bleed black chapters"),
    ALT("timing", "Timing", "Frames and numbers", "timing",
      { "--bg": "#f4f1ea", "--fg": "#111111", "--muted": "#6a655e", "--line": "#111111", "--accent": "#b24a2e" }),
    ALT("cinema", "Cinema", "Letterboxed, 2.39:1", "cinema",
      { "--bg": "#000000", "--fg": "#f4f1ea", "--muted": "#8a8580", "--line": "rgba(244,241,234,0.2)", "--accent": "#e8b86d" }),
    ALT("oceanic", "Fluid", "Everything moves like water", "motion-oceanic",
      { "--bg": "#06222b", "--fg": "#e8f4f0", "--muted": "#6fa3a5", "--line": "rgba(232,244,240,0.16)", "--accent": "#2ea8a0" }),
    ALT("storyboard", "Boards", "Before it moves", "storyboard",
      { "--bg": "#efe9dc", "--fg": "#1a1712", "--muted": "#6b6254", "--line": "#1a1712", "--accent": "#b24a2e" }),
    ALT("credits", "Credits", "After the loop", "credits",
      { "--bg": "#000000", "--fg": "#f4f1ea", "--muted": "#8a8580", "--line": "rgba(244,241,234,0.2)", "--accent": "#f4f1ea" }),
  ],
  void: [
    CLASSIC("Void", "Monochrome particles"),
    ALT("abyss", "Abyss", "Bioluminescent drift", "abyss",
      { "--bg": "#020610", "--fg": "#bfe3ff", "--muted": "#5f7f99", "--line": "rgba(191,227,255,0.16)", "--accent": "#3ddc84" }),
    ALT("ink", "Ink", "Bristle, no glow", "ink",
      { "--bg": "#e8e4dc", "--fg": "#111111", "--muted": "#6a655e", "--line": "#cfc8ba", "--accent": "#111111" }),
    ALT("reactor", "Reactor", "Charged angular HUD", "reactor",
      { "--bg": "#0a0d12", "--fg": "#9fd8ff", "--muted": "#5f7f99", "--line": "rgba(159,216,255,0.2)", "--accent": "#ff5a5a" }),
    ALT("orbit", "Orbit", "Clockwork rings", "void-orbit",
      { "--bg": "#04060c", "--fg": "#9fd8ff", "--muted": "#5f7f99", "--line": "rgba(159,216,255,0.3)", "--accent": "#e8f4ff" }),
    ALT("field", "Field", "It leans toward you", "field",
      { "--bg": "#06080e", "--fg": "#bfe3ff", "--muted": "#5f7f99", "--line": "rgba(191,227,255,0.3)", "--accent": "#a0dcff" }),
  ],
  atlas: [
    CLASSIC("Survey", "Parchment survey sheet"),
    ALT("expedition", "Expedition", "Night navigation", "expedition",
      { "--bg": "#101418", "--fg": "#e8e4dc", "--muted": "#8a938f", "--line": "rgba(232,228,220,0.16)", "--accent": "#c98a3d" }),
    ALT("field", "Field", "Pencil, stamps, tape", "field",
      { "--bg": "#e4dcc8", "--fg": "#241f16", "--muted": "#6f6350", "--line": "#c6b891", "--accent": "#5a6e3f" }),
    ALT("miniature", "Miniature", "A small world to explore", "miniature",
      { "--bg": "#101418", "--fg": "#e8e4dc", "--muted": "#8a938f", "--line": "rgba(232,228,220,0.16)", "--accent": "#c98a3d" }),
    ALT("cinematic", "Cinema", "Large photography, slow", "atlas-cinema",
      { "--bg": "#0b0d10", "--fg": "#e8e4dc", "--muted": "#8a938f", "--line": "rgba(232,228,220,0.16)", "--accent": "#c98a3d" }),
    ALT("timetable", "Timetable", "Departures, all lines", "timetable",
      { "--bg": "#101418", "--fg": "#e8e4dc", "--muted": "#8a938f", "--line": "rgba(232,228,220,0.25)", "--accent": "#c98a3d" }),
    ALT("postcards", "Postcards", "Wish you were here", "postcards",
      { "--bg": "#e4dcc8", "--fg": "#241f16", "--muted": "#6f6350", "--line": "#241f16", "--accent": "#5a6e3f" }),
  ],
  forge: [
    CLASSIC("Ops", "Light, utilitarian, dense"),
    ALT("blueprint", "Blueprint", "Reversed cyan drawing", "blueprint",
      { "--bg": "#12305a", "--fg": "#e8f1ff", "--muted": "#8ba6c9", "--line": "rgba(232,241,255,0.2)", "--accent": "#6fc3ff" }),
    ALT("datasheet", "Datasheet", "Print spec sheet", "datasheet",
      { "--bg": "#f4f4f0", "--fg": "#111111", "--muted": "#555555", "--line": "#111111", "--accent": "#111111" }),
    ALT("viewer", "Viewer", "Rotate, zoom, measure", "viewer",
      { "--bg": "#0a1c33", "--fg": "#e8f1ff", "--muted": "#8ba6c9", "--line": "rgba(232,241,255,0.25)", "--accent": "#6fc3ff" }),
    ALT("analog", "Microfiche", "Archive scan", "forge-analog",
      { "--bg": "#d8cfb8", "--fg": "#2a241c", "--muted": "#7a6a54", "--line": "#b3a37f", "--accent": "#5a4a2e" }),
    ALT("floor", "Floor", "Work orders, mid-shift", "floor",
      { "--bg": "#14161a", "--fg": "#e8eaee", "--muted": "#9aa0ac", "--line": "rgba(232,234,238,0.3)", "--accent": "#ffb020" }),
    ALT("compare", "Compare", "Head to head, no rep", "compare",
      { "--bg": "#f4f4f0", "--fg": "#111111", "--muted": "#555555", "--line": "#111111", "--accent": "#b24a2e" }),
  ],
  pulse: [
    CLASSIC("Signal", "Stage black, signal red"),
    ALT("flyer", "Flyer", "Photocopied gig poster", "flyer",
      { "--bg": "#ece8df", "--fg": "#111111", "--muted": "#6a655e", "--line": "#111111", "--accent": "#111111" }),
    ALT("vinyl", "Vinyl", "Sleeve and label typography", "vinyl",
      { "--bg": "#0d0716", "--fg": "#e9defc", "--muted": "#8f7fb8", "--line": "rgba(233,222,252,0.16)", "--accent": "#9d5cff" }),
    ALT("oceanic", "Submerged", "Deep blue reverb", "pulse-oceanic",
      { "--bg": "#04121e", "--fg": "#bfe0ff", "--muted": "#5f8fb0", "--line": "rgba(191,224,255,0.18)", "--accent": "#2e98c9" }),
    ALT("setlist", "Setlist", "Taped to the stage", "setlist",
      { "--bg": "#ece8df", "--fg": "#111111", "--muted": "#555555", "--line": "#111111", "--accent": "#b24a2e" }),
    ALT("booth", "Booth", "Two decks, crates below", "booth",
      { "--bg": "#0d0716", "--fg": "#e9defc", "--muted": "#8f7fb8", "--line": "rgba(233,222,252,0.3)", "--accent": "#9d5cff" }),
  ],
  civic: [
    CLASSIC("Service", "High contrast, calm"),
    ALT("noticeboard", "Notice", "Statutory notice", "noticeboard",
      { "--bg": "#faf7f0", "--fg": "#141210", "--muted": "#6a6254", "--line": "#141210", "--accent": "#8a1f2d" }),
    ALT("paperform", "Counter", "The physical counter", "paperform",
      { "--bg": "#e9e2d0", "--fg": "#2a241c", "--muted": "#7a6f5c", "--line": "#c2b48f", "--accent": "#2e6bd8" }),
    ALT("kiosk", "Kiosk", "Public terminal", "kiosk",
      { "--bg": "#0d1117", "--fg": "#e8eef2", "--muted": "#8a99a5", "--line": "rgba(232,238,242,0.2)", "--accent": "#2e6bd8" }),
    ALT("chamber", "Chamber", "Motions, minutes attached", "chamber",
      { "--bg": "#1c1611", "--fg": "#ece4d2", "--muted": "#a89878", "--line": "rgba(236,228,210,0.3)", "--accent": "#c9a86d" }),
    ALT("desk", "Desk", "Plain words, steps out", "desk",
      { "--bg": "#e9e2d0", "--fg": "#2a241c", "--muted": "#6a6254", "--line": "#2a241c", "--accent": "#2e6bd8" }),
  ],
  nest: [
    CLASSIC("Plaster", "Daylight, bone, oak"),
    ALT("drawing", "Drawing", "Ink on tracing paper", "drawing",
      { "--bg": "#e8e4da", "--fg": "#1c1a16", "--muted": "#6f6a5e", "--line": "#1c1a16", "--accent": "#1c1a16" }),
    ALT("simulated", "Simulated", "Environmental readouts", "simulated",
      { "--bg": "#0e1418", "--fg": "#cfe0da", "--muted": "#6f8a80", "--line": "rgba(207,224,218,0.16)", "--accent": "#3ddc84" }),
    ALT("walk", "Walk", "In the room, drag to orbit", "walk",
      { "--bg": "#101210", "--fg": "#e8e0d2", "--muted": "#8a7f6e", "--line": "rgba(232,224,210,0.2)", "--accent": "#c98a3d" }),
    ALT("mockup", "Mockup", "Cardboard and tape", "mockup",
      { "--bg": "#d9c39a", "--fg": "#3a2f22", "--muted": "#7a6a54", "--line": "#3a2f22", "--accent": "#8a5a2e" }),
    ALT("volume", "Volume", "Real geometry, WebGL", "volume",
      { "--bg": "#101210", "--fg": "#e8e0d2", "--muted": "#8a7f6e", "--line": "rgba(232,224,210,0.2)", "--accent": "#c98a3d" }),
  ],
  vector: [
    CLASSIC("Terminal", "Dark, sharp, annotated"),
    ALT("ledger", "Ledger", "Graph paper and pencil", "ledger",
      { "--bg": "#f3efe8", "--fg": "#1a1712", "--muted": "#6b6254", "--line": "#c6b89e", "--accent": "#1d7a35" }),
    ALT("filing", "Filing", "Regulatory document", "filing",
      { "--bg": "#e8e8e4", "--fg": "#141414", "--muted": "#555555", "--line": "#141414", "--accent": "#8a1f2d" }),
    ALT("surface", "Surface", "Light, quiet, precise", "surface",
      { "--bg": "#e8eef2", "--fg": "#101418", "--muted": "#5f7280", "--line": "#c3d2da", "--accent": "#0f6fbf" }),
    ALT("chart", "Chart", "Every quarter plotted", "chart",
      { "--bg": "#0b0e13", "--fg": "#dfe8f2", "--muted": "#7f8fb0", "--line": "rgba(223,232,242,0.2)", "--accent": "#6fc3ff" }),
    ALT("letter", "Letter", "The quarterly letter", "letter",
      { "--bg": "#faf8f2", "--fg": "#141414", "--muted": "#555555", "--line": "rgba(20,20,20,0.2)", "--accent": "#8a1f2d" }),
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
