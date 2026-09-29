import { defaultState, type BuilderState, type CartItem, type WaspState } from "./types";

const VALID_FEELS = new Set(["quiet", "luxury", "raw", "playful", "dark", "futuristic"]);
const VALID_MOTIONS = new Set(["subtle", "cinematic", "chaotic", "still"]);
const VALID_INTENTS = new Set(["business", "brand", "store", "app", "portfolio", "weird"]);

const KEY = "wasp-v10-state";
const NOIR_BAG = "wasp-v10-noir-bag";
const OBJECTS_CART = "wasp-v10-objects-cart";
const OS_KEY = "wasp-v10-os";
const WORKSHOP_KEY = "wasp-v10-workshop";

function canUse() {
  return typeof window !== "undefined";
}

export function loadState(): WaspState {
  if (!canUse()) return defaultState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<WaspState>;
    const visited = Array.isArray(parsed.visited)
      ? parsed.visited.filter((v): v is WaspState["visited"][number] => typeof v === "string")
      : [];
    const discoveries = Array.isArray(parsed.discoveries)
      ? parsed.discoveries.filter((d): d is string => typeof d === "string")
      : [];
    const interest: Record<string, number> = {};
    if (parsed.interest && typeof parsed.interest === "object") {
      for (const [k, v] of Object.entries(parsed.interest)) {
        if (typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1000) interest[k] = v;
      }
    }
    const builder = { ...defaultState.builder };
    if (parsed.builder && typeof parsed.builder === "object") {
      for (const k of Object.keys(builder) as (keyof BuilderState)[]) {
        if (k === "step") {
          const n = (parsed.builder as Record<string, unknown>)[k];
          if (typeof n === "number" && Number.isFinite(n)) builder.step = Math.max(0, Math.min(20, Math.floor(n)));
        } else {
          const v = (parsed.builder as Record<string, unknown>)[k];
          if (typeof v === "string") builder[k] = v.slice(0, 5000);
        }
      }
    }
    return {
      ...defaultState,
      entered: parsed.entered === true,
      visited: visited.slice(0, 50),
      discoveries: discoveries.slice(0, 100),
      intent: typeof parsed.intent === "string" && VALID_INTENTS.has(parsed.intent) ? (parsed.intent as WaspState["intent"]) : null,
      feel: typeof parsed.feel === "string" && VALID_FEELS.has(parsed.feel) ? (parsed.feel as WaspState["feel"]) : defaultState.feel,
      motion: typeof parsed.motion === "string" && VALID_MOTIONS.has(parsed.motion) ? (parsed.motion as WaspState["motion"]) : defaultState.motion,
      holyShitSeen: parsed.holyShitSeen === true,
      interest,
      builder,
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: WaspState) {
  if (!canUse()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode — non-fatal */
  }
}

function cleanCartItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || typeof r.name !== "string" || typeof r.image !== "string") return null;
  const price = Number(r.price);
  const qty = Number(r.qty);
  if (!Number.isFinite(price) || price < 0 || price > 100000) return null;
  if (!Number.isFinite(qty) || qty <= 0) return null;
  return {
    id: r.id.slice(0, 100),
    name: r.name.slice(0, 200),
    price,
    qty: Math.min(99, Math.floor(qty)),
    size: typeof r.size === "string" ? r.size.slice(0, 40) : undefined,
    option: typeof r.option === "string" ? r.option.slice(0, 40) : undefined,
    image: r.image.slice(0, 500),
  };
}

export function loadCart(key: "noir" | "objects"): CartItem[] {
  if (!canUse()) return [];
  try {
    const raw = window.localStorage.getItem(key === "noir" ? NOIR_BAG : OBJECTS_CART);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(cleanCartItem).filter((x): x is CartItem => x !== null).slice(0, 50);
  } catch {
    return [];
  }
}

export function saveCart(key: "noir" | "objects", items: CartItem[]) {
  if (!canUse()) return;
  try {
    window.localStorage.setItem(key === "noir" ? NOIR_BAG : OBJECTS_CART, JSON.stringify(items.slice(0, 50)));
  } catch {
    /* ignore */
  }
}

export function loadJson<T>(key: string, fallback: T): T {
  if (!canUse()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T) {
  if (!canUse()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export { OS_KEY, WORKSHOP_KEY };
