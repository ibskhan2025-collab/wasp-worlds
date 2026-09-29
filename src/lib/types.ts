export type Intent =
  | "business"
  | "brand"
  | "store"
  | "app"
  | "portfolio"
  | "weird";

export type Feel =
  | "quiet"
  | "luxury"
  | "raw"
  | "playful"
  | "dark"
  | "futuristic";

export type MotionPref = "subtle" | "cinematic" | "chaotic" | "still";

export type WorldId =
  | "casa"
  | "noir"
  | "orbit"
  | "still"
  | "signal"
  | "objects"
  | "archive"
  | "motion"
  | "void"
  | "atlas"
  | "forge"
  | "pulse"
  | "civic"
  | "nest"
  | "vector";

export type WorldMeta = {
  id: WorldId;
  room: string;
  name: string;
  kind: string;
  line: string;
  href: string;
  palette: string;
  tags: string[];
  intents: Intent[];
  atmosphere: string;
};

export type WorldAbout = {
  concept: string;
  client: string;
  stack: string[];
  interactions: string[];
  challenges: string[];
};

export type WaspState = {
  entered: boolean;
  visited: WorldId[];
  discoveries: string[];
  intent: Intent | null;
  feel: Feel;
  motion: MotionPref;
  holyShitSeen: boolean;
  interest: Record<string, number>;
  builder: BuilderState;
};

export type BuilderState = {
  type: string;
  goal: string;
  audience: string;
  existing: string;
  ambition: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
  step: number;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
  option?: string;
  image: string;
};

export const INTENTS: { id: Intent; label: string; hint: string }[] = [
  { id: "business", label: "A BUSINESS", hint: "A site that has to work as hard as you do." },
  { id: "brand", label: "A BRAND", hint: "Identity, atmosphere, editorial control." },
  { id: "store", label: "A STORE", hint: "Browse, desire, cart, convert." },
  { id: "app", label: "AN APP", hint: "Product thinking. Interface as the work." },
  { id: "portfolio", label: "A PORTFOLIO", hint: "Quiet confidence. Images that speak." },
  { id: "weird", label: "SOMETHING WEIRD", hint: "Good." },
];

export const FEELS: { id: Feel; label: string }[] = [
  { id: "quiet", label: "QUIET" },
  { id: "luxury", label: "LUXURY" },
  { id: "raw", label: "RAW" },
  { id: "playful", label: "PLAYFUL" },
  { id: "dark", label: "DARK" },
  { id: "futuristic", label: "FUTURISTIC" },
];

export const MOTIONS: { id: MotionPref; label: string }[] = [
  { id: "subtle", label: "SUBTLE" },
  { id: "cinematic", label: "CINEMATIC" },
  { id: "chaotic", label: "CHAOTIC" },
  { id: "still", label: "STILL" },
];

export const defaultBuilder: BuilderState = {
  type: "",
  goal: "",
  audience: "",
  existing: "",
  ambition: "",
  budget: "",
  timeline: "",
  name: "",
  email: "",
  company: "",
  step: 0,
};

export const defaultState: WaspState = {
  entered: false,
  visited: [],
  discoveries: [],
  intent: "portfolio",
  feel: "luxury",
  motion: "cinematic",
  holyShitSeen: false,
  interest: {},
  builder: defaultBuilder,
};
