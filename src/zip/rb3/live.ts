import { DISCIPLINES, WORLDS as ZIP_WORLDS, type World } from "./worlds";
import { REALITIES } from "@/lib/realities";

/**
 * Live-data adapter. worlds.ts is a byte-identical copy of the 8151 data
 * file (stable copy: names, lines, disciplines, capabilities, palettes).
 * Only the realities arrays are re-homed here so counts and labels always
 * match the live site instead of the export date.
 */
export { DISCIPLINES, type World };

export const WORLDS: World[] = ZIP_WORLDS.map((w) => ({
  ...w,
  realities: ((REALITIES as Record<string, { id: string; label: string; note: string }[]>)[w.slug] ?? []).map((r) => ({
    id: r.id,
    label: r.label,
    blurb: r.note,
  })),
}));
