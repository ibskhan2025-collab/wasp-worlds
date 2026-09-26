import {
  orbitActivity,
  orbitCustomers,
  orbitProjects,
  orbitTeam,
  type OrbitCustomer,
  type OrbitProject,
} from "@/data/orbit";

// Local-first store, shaped for a later API swap: all reads/writes go
// through loadOrbit/saveOrbit/touch, so replacing localStorage with fetch
// calls touches this file, not the page.
export const ORBIT_KEY = "wasp-v11-orbit";

export type OrbitSettings = { notify: boolean; compact: boolean; density: string };
export type OrbitActivityItem = { id: string; who: string; what: string; when: string };
export type OrbitTeamMember = { name: string; role: string; status: string };

export type OrbitState = {
  customers: OrbitCustomer[];
  projects: OrbitProject[];
  team: OrbitTeamMember[];
  activity: OrbitActivityItem[];
  settings: OrbitSettings;
};

const defaultState: OrbitState = {
  customers: orbitCustomers,
  projects: orbitProjects,
  team: orbitTeam,
  activity: orbitActivity,
  settings: { notify: true, compact: false, density: "Comfortable" },
};

const PLANS = new Set(["Studio", "House", "Orbit"]);
const HEALTH = new Set(["Quiet", "Watch", "Risk"]);
const STAGES = new Set(["Discovery", "Design", "Build", "QA", "Live"]);

function cleanCustomer(r: unknown): OrbitCustomer | null {
  if (!r || typeof r !== "object") return null;
  const o = r as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.name !== "string" || typeof o.company !== "string") return null;
  if (typeof o.email !== "string" || !o.email.includes("@")) return null;
  const spend = Number(o.spend);
  if (!Number.isFinite(spend) || spend < 0 || spend > 10_000_000) return null;
  return {
    id: o.id.slice(0, 40),
    name: o.name.slice(0, 100),
    company: o.company.slice(0, 100),
    plan: typeof o.plan === "string" && PLANS.has(o.plan) ? (o.plan as OrbitCustomer["plan"]) : "Studio",
    spend: Math.floor(spend),
    health: typeof o.health === "string" && HEALTH.has(o.health) ? (o.health as OrbitCustomer["health"]) : "Quiet",
    last: typeof o.last === "string" ? o.last.slice(0, 40) : "just now",
    email: o.email.slice(0, 200),
  };
}

function cleanProject(r: unknown): OrbitProject | null {
  if (!r || typeof r !== "object") return null;
  const o = r as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.name !== "string" || typeof o.client !== "string") return null;
  return {
    id: o.id.slice(0, 40),
    name: o.name.slice(0, 120),
    client: o.client.slice(0, 100),
    stage: typeof o.stage === "string" && STAGES.has(o.stage) ? (o.stage as OrbitProject["stage"]) : "Discovery",
    due: typeof o.due === "string" ? o.due.slice(0, 40) : "—",
    owner: typeof o.owner === "string" ? o.owner.slice(0, 80) : "Unassigned",
  };
}

export function loadOrbit(): OrbitState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(ORBIT_KEY);
    if (!raw) return defaultState;
    const p = JSON.parse(raw) as Partial<OrbitState>;
    return {
      customers: Array.isArray(p.customers)
        ? p.customers.map(cleanCustomer).filter((x): x is OrbitCustomer => x !== null).slice(0, 200)
        : defaultState.customers,
      projects: Array.isArray(p.projects)
        ? p.projects.map(cleanProject).filter((x): x is OrbitProject => x !== null).slice(0, 200)
        : defaultState.projects,
      team: Array.isArray(p.team)
        ? p.team
            .filter((m) => m && typeof m.name === "string")
            .map((m) => ({
              name: String(m.name).slice(0, 80),
              role: typeof m.role === "string" ? m.role.slice(0, 80) : "",
              status: typeof m.status === "string" ? m.status.slice(0, 80) : "",
            }))
            .slice(0, 50)
        : defaultState.team,
      activity: Array.isArray(p.activity)
        ? p.activity
            .filter((a) => a && typeof a.who === "string" && typeof a.what === "string")
            .map((a) => ({
              id: String(a.id).slice(0, 40),
              who: String(a.who).slice(0, 80),
              what: String(a.what).slice(0, 200),
              when: typeof a.when === "string" ? a.when.slice(0, 40) : "",
            }))
            .slice(0, 100)
        : defaultState.activity,
      settings: {
        notify: (p.settings?.notify ?? true) === true,
        compact: (p.settings?.compact ?? false) === true,
        density: typeof p.settings?.density === "string" ? p.settings.density.slice(0, 40) : "Comfortable",
      },
    };
  } catch {
    return defaultState;
  }
}

export function saveOrbit(state: OrbitState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ORBIT_KEY, JSON.stringify(state));
  } catch {
    /* quota — non-fatal */
  }
}

/** Prepend an activity entry (cap 100). Call inside every mutation. */
export function touch(state: OrbitState, who: string, what: string): OrbitState {
  const entry = { id: `a${Date.now()}`, who: who.slice(0, 80), what: what.slice(0, 200), when: "just now" };
  return { ...state, activity: [entry, ...state.activity].slice(0, 100) };
}

export function isCustomerEmailTaken(state: OrbitState, email: string, exceptId?: string) {
  const e = email.trim().toLowerCase();
  return state.customers.some((c) => c.email.toLowerCase() === e && c.id !== exceptId);
}
