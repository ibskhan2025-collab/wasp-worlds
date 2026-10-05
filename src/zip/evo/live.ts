import { buildIndex, CAPS, LAB, score, TECH, WORLDS as ZIP_WORLDS, capName, techName, worldBySlug, type Cap, type Entry, type World } from "./graph";
import { REALITIES } from "@/lib/realities";

/**
 * Live-data adapter. graph.ts is a byte-identical copy of the 8154 data
 * file (stable copy: names, lines, capabilities, covers, moods, fonts,
 * CTAs). Only the realities arrays are re-homed here so counts always
 * match the live site instead of the export date.
 */
export { buildIndex, CAPS, LAB, score, TECH, capName, techName, worldBySlug, type Cap, type Entry, type World };

export const WORLDS: World[] = ZIP_WORLDS.map((w) => ({
  ...w,
  realities: ((REALITIES as unknown as Record<string, { id: string; label: string; note: string }[]>)[w.slug] ?? []).map((r) => ({
    id: r.id,
    name: r.label,
    adds: r.note,
  })),
}));
