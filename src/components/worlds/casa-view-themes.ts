import type { Dish } from "@/data/casa";
import { media } from "@/lib/media";

export type CasaViewId = "oceanic" | "counter" | "cellar" | "brutalist" | "japanese" | "spatial" | "garden";
export type CasaSubView = "house" | "menu" | "story" | "gallery" | "contact" | "reservations";

export type Theme = {
  bg: string;
  fg: string;
  muted: string;
  line: string;
  accent: string;
  font: string;
  base: string;
  roomLabel: string;
  tagline: string;
  hero: string;
  heroAlt: string;
  menuLead: string;
  first: Dish["category"][];
  story: [string, string];
  proof: string;
  proofHref: string;
  proofName: string;
};

const SERIF = "var(--font-serif)";
const CODE = "var(--font-code)";

export { SERIF, CODE };

export const CASA_VIEW_THEMES: Record<CasaViewId, Theme> = {
  oceanic: {
    bg: "#06222b", fg: "#e8f4f0", muted: "#6fa3a5", line: "rgba(232,244,240,0.2)",     accent: "#2ea8a0", font: SERIF,
    base: "/worlds/casa/oceanic",
    roomLabel: "Room 01 · OCEANIC", tagline: "Twelve fathoms down, same kitchen.",
    hero: media.casa.dish1, heroAlt: "Seafood plated with herbs on black ceramic.",
    menuLead: "The sea dishes lead. Everything else holds its breath.",
    first: ["Sea", "Garden", "Fire", "Sweet", "Wine"],
    story: [
      "The flood started as a joke in a dry July: what if the dining room sank twelve fathoms and kept serving? The menu answered before we did — the sea dishes rose to the top and everything else learned to hold its breath.",
      "So this room runs tide-first. Shallows to dark water, boats to plates. The bookings, the kitchen, the fire are the same as upstairs; only the order of things changed.",
    ],
    proof: "Atmosphere you can swim in, utility that still floats: tide-first menu, same validated bookings.",
    proofHref: "/worlds/objects", proofName: "OBJECTS",
  },
  counter: {
    bg: "#140f0c", fg: "#f3e8d8", muted: "#c9a98a", line: "rgba(243,232,216,0.25)",     accent: "#ff5a2e", font: CODE,
    base: "/worlds/casa/counter",
    roomLabel: "Room 01 · COUNTER", tagline: "Eight seats at the pass.",
    hero: media.casa.fire, heroAlt: "Kitchen fire catching as meat hits the grill.",
    menuLead: "Fire order. Tickets go up, food comes down.",
    first: ["Fire", "Sea", "Garden", "Sweet", "Wine"],
    story: [
      "There are eight stools at the pass and they are the best seats in the valley. You watch the tickets go up and the food come down, and the kitchen forgets to perform because it is too busy cooking.",
      "The counter menu is the whole menu in fire order: oak first, cold side holding, garden cut that morning. Same dishes as the dining room, eaten closer to the heat.",
    ],
    proof: "The kitchen as interface: fire order, stations, tickets — ordering without leaving the heat.",
    proofHref: "/worlds/forge", proofName: "FORGE",
  },
  cellar: {
    bg: "#171008", fg: "#e9dcc0", muted: "#a08a60", line: "rgba(185,138,61,0.4)",     accent: "#b98a3d", font: "Georgia, serif",
    base: "/worlds/casa/cellar",
    roomLabel: "Room 01 · CELLAR", tagline: "Short list. Everything pours.",
    hero: media.casa.wine, heroAlt: "Two wine glasses at a set table.",
    menuLead: "Bins, pours, and what each drinks with.",
    first: ["Wine", "Fire", "Sea", "Garden", "Sweet"],
    story: [
      "The cellar book is short on purpose. A dozen bins, everything by the glass, bottles only if you ask twice. The list was built backwards from the menu: every pour has to earn its plate.",
      "Down here the pairings do the talking. Pick a glass and the kitchen leans in — fire dishes first, then whatever the boats brought.",
    ],
    proof: "A wine list that behaves like one: bins, pours, and pairings that point at real plates.",
    proofHref: "/worlds/objects", proofName: "OBJECTS",
  },
  brutalist: {
    bg: "#f2f0e8", fg: "#111111", muted: "#555555", line: "#111111",     accent: "#111111", font: CODE,
    base: "/worlds/casa/brutalist",
    roomLabel: "Room 01 · BRUTALIST", tagline: "Ledger, no mercy.",
    hero: media.casa.grill, heroAlt: "Grill over open fire, shot straight.",
    menuLead: "Twelve dishes. One grill. Read it like a ledger.",
    first: ["Fire", "Sea", "Garden", "Sweet", "Wine"],
    story: [
      "No tasting menu. No adjectives on the wall. The brutalist room is the menu as a ledger: dishes, prices, heat. If a sentence doesn't help you order, it doesn't get printed.",
      "Same kitchen, fewer words. The grill is the concept and the concept is the grill.",
    ],
    proof: "Ordering without decoration: the ledger is the menu and the menu is honest.",
    proofHref: "/worlds/vector", proofName: "VECTOR",
  },
  japanese: {
    bg: "#f3eee3", fg: "#1d1b18", muted: "#7a6a5c", line: "rgba(29,27,24,0.2)",     accent: "#b2332a", font: "Georgia, serif",
    base: "/worlds/casa/japanese",
    roomLabel: "Room 01 · JAPANESE", tagline: "Courses in silence.",
    hero: media.casa.hero, heroAlt: "The CASA dining room in soft light.",
    menuLead: "品書き — numbered courses, quiet room.",
    first: ["Sea", "Garden", "Fire", "Sweet", "Wine"],
    story: [
      "A table, a fire, and silence between courses. The Japanese room slows the whole operation to half tempo: five courses arrive when they arrive, and nobody explains them twice.",
      "The menu is numbered in kanji and means it. Same dishes as the loud room, eaten at the speed of attention.",
    ],
    proof: "Stillness as service: the same kitchen at half tempo — courses, quiet, stamp.",
    proofHref: "/worlds/still", proofName: "STILL",
  },
  spatial: {
    bg: "#171310", fg: "#e8e0d2", muted: "#8a7f6e", line: "rgba(232,224,210,0.25)", accent: "#c9803f", font: SERIF,
    base: "/worlds/casa/spatial",
    roomLabel: "Room 01 · SPATIAL", tagline: "Walk in before you book.",
    hero: media.casa.room, heroAlt: "Dining room set for service, wide view.",
    menuLead: "Eight tables. Click one in the 3D room and it pre-fills the booking.",
    first: ["Fire", "Sea", "Garden", "Sweet", "Wine"],
    story: [
      "The dining room, to scale, in your browser. Eight tables with chairs and plates, pendants swaying, daylight on a slider — walk it, click a table, and the booking form already knows where you want to sit.",
      "Geometry with a purpose: every table in the 3D room is the same table the reservations ledger holds.",
    ],
    proof: "The plan is the booking flow: geometry that pre-fills the form.",
    proofHref: "/worlds/nest", proofName: "NEST",
  },
  garden: {
    bg: "#eef3e4", fg: "#1d2a16", muted: "#5c7050", line: "rgba(29,42,22,0.3)",     accent: "#4a7c2e", font: SERIF,
    base: "/worlds/casa/garden",
    roomLabel: "Room 01 · GARDEN", tagline: "Picked at 16:00, plated at 17:30.",
    hero: media.casa.dish7, heroAlt: "Garden plate with charred allium and herbs.",
    menuLead: "The garden dishes lead. The beds are the menu plan.",
    first: ["Garden", "Sea", "Fire", "Sweet", "Wine"],
    story: [
      "Six beds behind the kitchen decide the menu. Whatever is ready at four in the afternoon is on the plate by half past five — the garden dishes lead and the rest follows the season.",
      "Eaten where it grows. The planting plan hangs by the pass so the cooks can't pretend August is May.",
    ],
    proof: "Provenance as menu: the planting plan is the menu plan.",
    proofHref: "/worlds/casa/counter", proofName: "COUNTER",
  },
};
