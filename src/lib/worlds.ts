import type { Intent, WorldId, WorldMeta } from "./types";

export const WORLDS: WorldMeta[] = [
  { id: "casa", room: "01", name: "CASA", kind: "Hospitality", line: "A website that makes you want to go there.", href: "/worlds/casa", tags: ["hospitality", "commerce", "place"], intents: ["business", "brand", "store"], atmosphere: "cinematic hospitality" },
  { id: "noir", room: "02", name: "NOIR", kind: "Fashion / Luxury", line: "Make the object desirable before the price appears.", href: "/worlds/noir", tags: ["luxury", "fashion", "commerce"], intents: ["brand", "store"], atmosphere: "dark editorial desire" },
  { id: "orbit", room: "03", name: "ORBIT", kind: "Technology / Product", line: "Complex software, made legible enough to use.", href: "/worlds/orbit", tags: ["product", "saas", "systems"], intents: ["app", "business"], atmosphere: "precise product system" },
  { id: "still", room: "04", name: "STILL", kind: "Art / Photography", line: "Pictures first. Everything else learns to whisper.", href: "/worlds/still", tags: ["portfolio", "editorial", "art"], intents: ["portfolio", "brand"], atmosphere: "quiet image-first" },
  { id: "signal", room: "05", name: "SIGNAL", kind: "Games / Interactive", line: "The interface notices that you are touching it.", href: "/worlds/signal", tags: ["play", "interactive", "entertainment"], intents: ["weird", "app"], atmosphere: "responsive play" },
  { id: "objects", room: "06", name: "OBJECTS", kind: "Commerce / DTC", line: "A store that treats shopping like discovery.", href: "/worlds/objects", tags: ["commerce", "retail", "product"], intents: ["store", "business"], atmosphere: "tactile retail" },
  { id: "archive", room: "07", name: "ARCHIVE", kind: "Media / Publishing", line: "A publication, not a blog skin.", href: "/worlds/archive", tags: ["editorial", "content", "knowledge"], intents: ["brand", "portfolio", "business"], atmosphere: "living editorial" },
  { id: "motion", room: "08", name: "MOTION", kind: "Campaign / Launch", line: "Type, image, sound and time become one material.", href: "/worlds/motion", tags: ["campaign", "brand", "motion"], intents: ["brand", "weird"], atmosphere: "cinematic campaign" },
  { id: "void", room: "09", name: "VOID", kind: "Experiment", line: "No obvious category. No obvious reason. Good.", href: "/worlds/void", tags: ["experimental", "generative", "interactive"], intents: ["weird"], atmosphere: "unreasonable interface" },
  { id: "atlas", room: "10", name: "ATLAS", kind: "Travel / Places", line: "Turn a destination into somewhere you can explore before you arrive.", href: "/worlds/atlas", tags: ["travel", "place", "hospitality"], intents: ["business", "brand", "portfolio"], atmosphere: "geographic exploration" },
  { id: "forge", room: "11", name: "FORGE", kind: "Industrial / B2B", line: "Make complicated things understandable without making them dull.", href: "/worlds/forge", tags: ["b2b", "industrial", "systems"], intents: ["business", "app"], atmosphere: "engineered precision" },
  { id: "pulse", room: "12", name: "PULSE", kind: "Music / Culture", line: "A website that behaves like the thing it is promoting.", href: "/worlds/pulse", tags: ["culture", "music", "motion"], intents: ["brand", "weird", "portfolio"], atmosphere: "rhythmic culture" },
  { id: "civic", room: "13", name: "CIVIC", kind: "Institutions / Public", line: "Important information should not require patience to understand.", href: "/worlds/civic", tags: ["civic", "accessibility", "content"], intents: ["business", "app"], atmosphere: "human clarity" },
  { id: "nest", room: "14", name: "NEST", kind: "Architecture / Space", line: "What if the website itself became a place?", href: "/worlds/nest", tags: ["architecture", "place", "portfolio"], intents: ["portfolio", "brand", "business"], atmosphere: "spatial interface" },
  { id: "vector", room: "15", name: "VECTOR", kind: "Finance / Professional", line: "Serious information, presented with confidence instead of beige.", href: "/worlds/vector", tags: ["finance", "b2b", "systems"], intents: ["business", "brand"], atmosphere: "sharp professional" },
];

export function getWorld(id: WorldId) { return WORLDS.find((world) => world.id === id)!; }

export function recommendWorlds(intent: Intent | null, interest: Record<string, number>) {
  const tagOwners = new Map<string, string[]>();
  for (const w of WORLDS) {
    for (const tag of w.tags) {
      const list = tagOwners.get(tag) ?? [];
      list.push(w.id);
      tagOwners.set(tag, list);
    }
  }
  return WORLDS.map((world) => {
    let score = Math.min(interest[world.id] ?? 0, 20);
    if (intent && world.intents.includes(intent)) score += 3;
    for (const tag of world.tags) {
      const owners = tagOwners.get(tag) ?? [];
      if (owners.length <= 1) continue;
      let shared = 0;
      for (const other of owners) {
        if (other === world.id) continue;
        shared += Math.min(interest[other] ?? 0, 10);
      }
      score += (shared / (owners.length - 1)) * 0.1;
    }
    return { world, score };
  }).sort((a, b) => b.score - a.score).map(({ world }) => world);
}

export const INTENT_COPY: Record<Intent, { headline: string; body: string; services: string[] }> = {
  business: { headline: "MAKE IT WORK.", body: "Clarity, conversion, and a system that can grow without getting ugly.", services: ["Website design", "Website development", "Redesign", "Ecommerce"] },
  brand: { headline: "MAKE IT FELT.", body: "Atmosphere, type, motion and editorial control. The site becomes part of the identity.", services: ["Brand experience", "Website design", "Interactive experiences"] },
  store: { headline: "MAKE IT BUYABLE.", body: "Browse, desire, cart, checkout. Commerce as craft, not a plugin.", services: ["Ecommerce", "Product storytelling", "Conversion"] },
  app: { headline: "MAKE IT OPERABLE.", body: "Product thinking. Interfaces people live in, not pages they land on.", services: ["Product / UI", "Creative technology", "Web development"] },
  portfolio: { headline: "MAKE IT SEEN.", body: "Sequence, image, typography and the discipline to stop talking.", services: ["Portfolio design", "Editorial systems", "Interactive experiences"] },
  weird: { headline: "MAKE IT IMPOSSIBLE.", body: "We don't only build what already exists. We make interfaces with a point of view.", services: ["Creative technology", "Interactive experiences", "Experimental builds"] },
};

export const META_WORLDS = [
  { id: "lab", name: "LAB", line: "Experiments that may become products.", href: "/lab" },
  { id: "machine", name: "MACHINE", line: "AI, automation and systems underneath the surface.", href: "/os" },
  { id: "archive", name: "THE ARCHIVE", line: "Everything worth keeping.", href: "/work" },
];
