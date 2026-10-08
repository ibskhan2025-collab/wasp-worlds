export type Room = { id: string; name: string; x: number; y: number; w: number; h: number; use: string; light: string; text: string; ceil: number };
export const ROOMS: Room[] = [
  { id: "hall", name: "Entry", x: 0, y: 0, w: 2.5, h: 5.5, use: "Arrival, storage", light: "North, borrowed from the door glazing", ceil: 2.7, text: "A narrow, compressed entry that opens out into the living room like an exhale. A full-height oak wall conceals coats, shoes and the boiler." },
  { id: "living", name: "Living & dining", x: 2.5, y: 0, w: 6, h: 5.5, use: "Living, dining", light: "South glazing, floor to ceiling, 6m wide", ceil: 2.7, text: "The heart of the house. One room for eating, reading and doing nothing, with a continuous glazed wall opening to a timber terrace." },
  { id: "kitchen", name: "Kitchen", x: 8.5, y: 0, w: 3.5, h: 5.5, use: "Cooking", light: "East window over the worktop, morning sun", ceil: 2.7, text: "A galley kitchen with a single 4-metre run of oak and stone. Everything has a place; nothing is on show unless it is beautiful." },
  { id: "study", name: "Study", x: 0, y: 5.5, w: 3.5, h: 3.5, use: "Work, guests", light: "West window, afternoon light", ceil: 2.7, text: "A quiet room with a built-in desk, deep shelving and a sofa that converts for guests. The window frames a single birch." },
  { id: "bedroom", name: "Bedroom", x: 3.5, y: 5.5, w: 4.5, h: 3.5, use: "Sleeping", light: "North window, soft and even", ceil: 2.7, text: "Low, calm and dark at night. A recessed bed platform, a deep window seat, and the only ceiling in the house finished in clay." },
  { id: "bath", name: "Bathroom", x: 8, y: 5.5, w: 2.2, h: 3.5, use: "Bathing", light: "Rooflight over the shower", ceil: 2.7, text: "A stone-lined wet room with a rooflight, a deep tub, and a heated floor. Fully tiled in a single stone." },
  { id: "utility", name: "Utility", x: 10.2, y: 5.5, w: 1.8, h: 3.5, use: "Laundry, plant", light: "Borrowed from kitchen door", ceil: 2.5, text: "Washing, drying and the heat pump. Acoustically separated from the bedroom by a double wall." },
];
export const HW = 12, HH = 9;
export const FLOORS = [
  { id: "oak", label: "Smoked oak", color: "#8a6a48", rough: 0.6 }, { id: "concrete", label: "Polished concrete", color: "#9b9a95", rough: 0.35 }, { id: "terrazzo", label: "Terrazzo", color: "#d7cfc0", rough: 0.3 }, { id: "slate", label: "Riven slate", color: "#4a5158", rough: 0.75 },
];
export const WALLS = [
  { id: "lime", label: "Lime plaster", color: "#eee8dc", rough: 0.95 }, { id: "board", label: "Board-marked concrete", color: "#8c8b86", rough: 0.9 }, { id: "charred", label: "Charred timber", color: "#2b2522", rough: 0.85 }, { id: "clay", label: "Clay plaster", color: "#c08a66", rough: 0.95 },
];
export const CLAD = [
  { id: "larch", label: "Larch", color: "#b8875a", rough: 0.8 }, { id: "zinc", label: "Standing-seam zinc", color: "#8c949b", rough: 0.4 }, { id: "brick", label: "Handmade brick", color: "#a4573a", rough: 0.9 },
];
export type Mat = { id: string; label: string; color: string; rough: number };
export type Line = { axis: "x" | "y"; c: number; a0: number; a1: number; ext?: boolean };
export const LINES: Line[] = [
  { axis: "y", c: 0, a0: 0, a1: 12, ext: true }, { axis: "y", c: 9, a0: 0, a1: 12, ext: true }, { axis: "x", c: 0, a0: 0, a1: 9, ext: true }, { axis: "x", c: 12, a0: 0, a1: 9, ext: true },
  { axis: "x", c: 2.5, a0: 0, a1: 5.5 }, { axis: "x", c: 8.5, a0: 0, a1: 5.5 }, { axis: "y", c: 5.5, a0: 0, a1: 12 }, { axis: "x", c: 3.5, a0: 5.5, a1: 9 }, { axis: "x", c: 8, a0: 5.5, a1: 9 }, { axis: "x", c: 10.2, a0: 5.5, a1: 9 },
];
export type Gap = { axis: "x" | "y"; c: number; a0: number; a1: number; kind: "door" | "glass" };
export const GAPS: Gap[] = [
  { axis: "y", c: 0, a0: 0.8, a1: 1.8, kind: "door" }, { axis: "y", c: 0, a0: 3.2, a1: 8, kind: "glass" }, { axis: "x", c: 2.5, a0: 2.2, a1: 3.2, kind: "door" }, { axis: "x", c: 8.5, a0: 2, a1: 3, kind: "door" },
  { axis: "y", c: 5.5, a0: 1, a1: 2, kind: "door" }, { axis: "y", c: 5.5, a0: 5, a1: 6, kind: "door" }, { axis: "y", c: 5.5, a0: 10.6, a1: 11.6, kind: "door" }, { axis: "x", c: 8, a0: 7, a1: 8, kind: "door" },
  { axis: "x", c: 12, a0: 1, a1: 3.2, kind: "glass" }, { axis: "y", c: 9, a0: 4.4, a1: 7.2, kind: "glass" }, { axis: "x", c: 0, a0: 6.4, a1: 8, kind: "glass" },
];
/** Split wall lines around openings. Returns solid segments and opening gaps. */
export function wallSegments() {
  const solid: { axis: "x" | "y"; c: number; a0: number; a1: number; ext?: boolean }[] = [];
  LINES.forEach((l) => {
    const g = GAPS.filter((q) => q.axis === l.axis && q.c === l.c && q.a1 > l.a0 && q.a0 < l.a1).sort((a, b) => a.a0 - b.a0);
    let cur = l.a0;
    g.forEach((q) => { if (q.a0 > cur) solid.push({ ...l, a0: cur, a1: q.a0 }); cur = Math.max(cur, q.a1); });
    if (cur < l.a1) solid.push({ ...l, a0: cur, a1: l.a1 });
  });
  return solid;
}
