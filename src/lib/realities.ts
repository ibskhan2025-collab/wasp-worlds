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
  ],
  noir: [
    CLASSIC("Classic", "Absolute black, grayscale"),
    ALT("brutalist", "Brutalist", "Grid, border, no mercy", "brutalist",
      { "--bg": "#f4f1ea", "--fg": "#111111", "--muted": "#555555", "--line": "#111111", "--accent": "#c41e3a" }),
    ALT("analog", "Analog", "Photocopied lookbook", "analog",
      { "--bg": "#cfcfcf", "--fg": "#111111", "--muted": "#555555", "--line": "#111111", "--accent": "#111111" }),
  ],
  orbit: [
    CLASSIC("Product", "Light, dense, boring on purpose"),
    ALT("console", "Console", "Dark operations HUD", "console",
      { "--bg": "#101311", "--fg": "#e6efe8", "--muted": "#7d8a80", "--line": "#2a332c", "--accent": "#3ddc84" }),
    ALT("compact", "Compact", "Maximum rows, minimum air", "compact",
      { "--bg": "#e4e6e0", "--fg": "#161615", "--muted": "#6d6f69", "--line": "#c9ccc2", "--accent": "#b24a2e" }),
  ],
  still: [
    CLASSIC("Paper", "Warm paper, black serif"),
    ALT("negative", "Negative", "Inverted, for night editing", "negative",
      { "--bg": "#0c0c0c", "--fg": "#ececec", "--muted": "#8a8a8a", "--line": "#2c2c2c", "--accent": "#ececec" }),
    ALT("contact", "Contact", "Edge numbers, grease pencil", "contact",
      { "--bg": "#e2d5b8", "--fg": "#241f16", "--muted": "#7a6a54", "--line": "#bfa87c", "--accent": "#8a3b1f" }),
  ],
  signal: [
    CLASSIC("Amber CRT", "Monochrome phosphor"),
    ALT("mono", "Mono", "Pure contrast", "mono",
      { "--bg": "#000000", "--fg": "#ffffff", "--muted": "#999999", "--line": "#333333", "--accent": "#ffffff" }),
    ALT("paper", "Paper drill", "Ink on graph paper", "paper",
      { "--bg": "#efe9dc", "--fg": "#1a1712", "--muted": "#6b6254", "--line": "#c9bfa8", "--accent": "#b24a2e" }),
  ],
  objects: [
    CLASSIC("Bone", "Editorial neutral"),
    ALT("tidal", "Tidal", "Coastal glaze palette", "tidal",
      { "--bg": "#dfe9e4", "--fg": "#14302a", "--muted": "#5f7a70", "--line": "#bccfc6", "--accent": "#0f6f5c" }),
    ALT("catalogue", "Catalogue", "1974 mail-order print", "catalogue",
      { "--bg": "#e8ddc4", "--fg": "#2a2118", "--muted": "#7a6a54", "--line": "#c0ab7e", "--accent": "#8a3b1f" }),
  ],
  archive: [
    CLASSIC("Parchment", "Newsprint, dense columns"),
    ALT("typer", "Typer", "Monospace manuscript", "typer",
      { "--bg": "#ece7db", "--fg": "#1a1712", "--muted": "#6b6254", "--line": "#cfc4ab", "--accent": "#1a1712" }),
    ALT("terminal", "Terminal", "Reading at night, green", "terminal",
      { "--bg": "#0c120c", "--fg": "#cfe3c8", "--muted": "#7a8f72", "--line": "rgba(207,227,200,0.16)", "--accent": "#3ddc84" }),
  ],
  motion: [
    CLASSIC("Campaign", "Full-bleed black chapters"),
    ALT("timing", "Timing", "Frames and numbers", "timing",
      { "--bg": "#f4f1ea", "--fg": "#111111", "--muted": "#6a655e", "--line": "#111111", "--accent": "#b24a2e" }),
    ALT("cinema", "Cinema", "Letterboxed, 2.39:1", "cinema",
      { "--bg": "#000000", "--fg": "#f4f1ea", "--muted": "#8a8580", "--line": "rgba(244,241,234,0.2)", "--accent": "#e8b86d" }),
  ],
  void: [
    CLASSIC("Void", "Monochrome particles"),
    ALT("abyss", "Abyss", "Bioluminescent drift", "abyss",
      { "--bg": "#020610", "--fg": "#bfe3ff", "--muted": "#5f7f99", "--line": "rgba(191,227,255,0.16)", "--accent": "#3ddc84" }),
    ALT("ink", "Ink", "Bristle, no glow", "ink",
      { "--bg": "#e8e4dc", "--fg": "#111111", "--muted": "#6a655e", "--line": "#cfc8ba", "--accent": "#111111" }),
  ],
  atlas: [
    CLASSIC("Survey", "Parchment survey sheet"),
    ALT("expedition", "Expedition", "Night navigation", "expedition",
      { "--bg": "#101418", "--fg": "#e8e4dc", "--muted": "#8a938f", "--line": "rgba(232,228,220,0.16)", "--accent": "#c98a3d" }),
    ALT("field", "Field", "Pencil, stamps, tape", "field",
      { "--bg": "#e4dcc8", "--fg": "#241f16", "--muted": "#6f6350", "--line": "#c6b891", "--accent": "#5a6e3f" }),
  ],
  forge: [
    CLASSIC("Ops", "Light, utilitarian, dense"),
    ALT("blueprint", "Blueprint", "Reversed cyan drawing", "blueprint",
      { "--bg": "#12305a", "--fg": "#e8f1ff", "--muted": "#8ba6c9", "--line": "rgba(232,241,255,0.2)", "--accent": "#6fc3ff" }),
    ALT("datasheet", "Datasheet", "Print spec sheet", "datasheet",
      { "--bg": "#f4f4f0", "--fg": "#111111", "--muted": "#555555", "--line": "#111111", "--accent": "#111111" }),
    ALT("viewer", "Viewer", "Rotate, zoom, measure", "viewer",
      { "--bg": "#0a1c33", "--fg": "#e8f1ff", "--muted": "#8ba6c9", "--line": "rgba(232,241,255,0.25)", "--accent": "#6fc3ff" }),
  ],
  pulse: [
    CLASSIC("Signal", "Stage black, signal red"),
    ALT("flyer", "Flyer", "Photocopied gig poster", "flyer",
      { "--bg": "#ece8df", "--fg": "#111111", "--muted": "#6a655e", "--line": "#111111", "--accent": "#111111" }),
    ALT("vinyl", "Vinyl", "Sleeve and label typography", "vinyl",
      { "--bg": "#0d0716", "--fg": "#e9defc", "--muted": "#8f7fb8", "--line": "rgba(233,222,252,0.16)", "--accent": "#9d5cff" }),
  ],
  civic: [
    CLASSIC("Service", "High contrast, calm"),
    ALT("noticeboard", "Notice", "Statutory notice", "noticeboard",
      { "--bg": "#faf7f0", "--fg": "#141210", "--muted": "#6a6254", "--line": "#141210", "--accent": "#8a1f2d" }),
    ALT("paperform", "Counter", "The physical counter", "paperform",
      { "--bg": "#e9e2d0", "--fg": "#2a241c", "--muted": "#7a6f5c", "--line": "#c2b48f", "--accent": "#2e6bd8" }),
  ],
  nest: [
    CLASSIC("Plaster", "Daylight, bone, oak"),
    ALT("drawing", "Drawing", "Ink on tracing paper", "drawing",
      { "--bg": "#e8e4da", "--fg": "#1c1a16", "--muted": "#6f6a5e", "--line": "#1c1a16", "--accent": "#1c1a16" }),
    ALT("simulated", "Simulated", "Environmental readouts", "simulated",
      { "--bg": "#0e1418", "--fg": "#cfe0da", "--muted": "#6f8a80", "--line": "rgba(207,224,218,0.16)", "--accent": "#3ddc84" }),
    ALT("walk", "Walk", "In the room, drag to orbit", "walk",
      { "--bg": "#101210", "--fg": "#e8e0d2", "--muted": "#8a7f6e", "--line": "rgba(232,224,210,0.2)", "--accent": "#c98a3d" }),
  ],
  vector: [
    CLASSIC("Terminal", "Dark, sharp, annotated"),
    ALT("ledger", "Ledger", "Graph paper and pencil", "ledger",
      { "--bg": "#f3efe8", "--fg": "#1a1712", "--muted": "#6b6254", "--line": "#c6b89e", "--accent": "#1d7a35" }),
    ALT("filing", "Filing", "Regulatory document", "filing",
      { "--bg": "#e8e8e4", "--fg": "#141414", "--muted": "#555555", "--line": "#141414", "--accent": "#8a1f2d" }),
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
