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
  ],
  noir: [
  
  ],
  orbit: [
  
  ],
  still: [
  
  ],
  signal: [
  
  ],
  objects: [
  
  ],
  archive: [
  
  ],
  motion: [
  
  ],
  void: [
  
  ],
  atlas: [
  
  ],
  forge: [
  
  ],
  pulse: [
  
  ],
  civic: [
  
  ],
  nest: [
  
  ],
  vector: [
  
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
