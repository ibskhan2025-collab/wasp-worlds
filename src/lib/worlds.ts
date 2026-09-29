import type { Intent, WorldAbout, WorldMeta } from "./types";

export const WORLDS: WorldMeta[] = [
  { id: "casa", room: "01", name: "CASA", kind: "Hospitality", line: "A website that makes you want to go there.", href: "/worlds/casa", palette: "Terracotta / bone / walnut", tags: ["hospitality", "commerce", "place"], intents: ["business", "brand", "store"], atmosphere: "cinematic hospitality" },
  { id: "noir", room: "02", name: "NOIR", kind: "Fashion / Luxury", line: "Make the object desirable before the price appears.", href: "/worlds/noir", palette: "Bone / charcoal / concrete", tags: ["luxury", "fashion", "commerce"], intents: ["brand", "store"], atmosphere: "dark editorial desire" },
  { id: "orbit", room: "03", name: "ORBIT", kind: "Technology / Product", line: "Complex software, made legible enough to use.", href: "/worlds/orbit", palette: "Slate / graphite / signal blue", tags: ["product", "saas", "systems"], intents: ["app", "business"], atmosphere: "precise product system" },
  { id: "still", room: "04", name: "STILL", kind: "Art / Photography", line: "Pictures first. Everything else learns to whisper.", href: "/worlds/still", palette: "Silver / chalk / deep shadow", tags: ["portfolio", "editorial", "art"], intents: ["portfolio", "brand"], atmosphere: "quiet image-first" },
  { id: "signal", room: "05", name: "SIGNAL", kind: "Games / Interactive", line: "The interface notices that you are touching it.", href: "/worlds/signal", palette: "Phosphor / graphite / black", tags: ["play", "interactive", "entertainment"], intents: ["weird", "app"], atmosphere: "responsive play" },
  { id: "objects", room: "06", name: "OBJECTS", kind: "Commerce / DTC", line: "A store that treats shopping like discovery.", href: "/worlds/objects", palette: "Cobalt / oat / porcelain", tags: ["commerce", "retail", "product"], intents: ["store", "business"], atmosphere: "tactile retail" },
  { id: "archive", room: "07", name: "ARCHIVE", kind: "Media / Publishing", line: "A publication, not a blog skin.", href: "/worlds/archive", palette: "Oxblood / newsprint / ink", tags: ["editorial", "content", "knowledge"], intents: ["brand", "portfolio", "business"], atmosphere: "living editorial" },
  { id: "motion", room: "08", name: "MOTION", kind: "Campaign / Launch", line: "Type, image, sound and time become one material.", href: "/worlds/motion", palette: "Vermilion / overcast bone / ink", tags: ["campaign", "brand", "motion"], intents: ["brand", "weird"], atmosphere: "cinematic campaign" },
  { id: "void", room: "09", name: "VOID", kind: "Experiment", line: "No obvious category. No obvious reason. Good.", href: "/worlds/void", palette: "Graphite / brass / magenta fleck", tags: ["experimental", "generative", "interactive"], intents: ["weird"], atmosphere: "unreasonable interface" },
  { id: "atlas", room: "10", name: "ATLAS", kind: "Travel / Places", line: "Turn a destination into somewhere you can explore before you arrive.", href: "/worlds/atlas", palette: "Valley ink / late sun / paper", tags: ["travel", "place", "hospitality"], intents: ["business", "brand", "portfolio"], atmosphere: "geographic exploration" },
  { id: "forge", room: "11", name: "FORGE", kind: "Industrial / B2B", line: "Make complicated things understandable without making them dull.", href: "/worlds/forge", palette: "Shop floor / safety orange / schematic", tags: ["b2b", "industrial", "systems"], intents: ["business", "app"], atmosphere: "engineered precision" },
  { id: "pulse", room: "12", name: "PULSE", kind: "Music / Culture", line: "A website that behaves like the thing it is promoting.", href: "/worlds/pulse", palette: "Stage black / signal red / house lights", tags: ["culture", "music", "motion"], intents: ["brand", "weird", "portfolio"], atmosphere: "rhythmic culture" },
  { id: "civic", room: "13", name: "CIVIC", kind: "Institutions / Public", line: "Important information should not require patience to understand.", href: "/worlds/civic", palette: "Notice board / action blue / form paper", tags: ["civic", "accessibility", "content"], intents: ["business", "app"], atmosphere: "human clarity" },
  { id: "nest", room: "14", name: "NEST", kind: "Architecture / Space", line: "What if the website itself became a place?", href: "/worlds/nest", palette: "Shadow gap / moss / plaster", tags: ["architecture", "place", "portfolio"], intents: ["portfolio", "brand", "business"], atmosphere: "spatial interface" },
  { id: "vector", room: "15", name: "VECTOR", kind: "Finance / Professional", line: "Serious information, presented with confidence instead of beige.", href: "/worlds/vector", palette: "Terminal / uptick / ledger", tags: ["finance", "b2b", "systems"], intents: ["business", "brand"], atmosphere: "sharp professional" },
];

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

export const WORLD_ABOUT: Record<string, WorldAbout> = {
  casa: {
    concept: "Hospitality websites always choose between atmosphere and utility. CASA refuses the choice.",
    client: "Casa Valle (fictional), Ojai",
    stack: ["Next.js App Router", "Drizzle + Postgres reservations", "validated server actions", "local bookings mirror"],
    interactions: ["Menu search, filters, sort and favorites over one derived list", "Gallery with keyboard lightbox and closing CTA", "Reservation flow validated twice — client for speed, server for truth"],
    challenges: ["Filtering a 12-dish menu without turning it into a spreadsheet", "Keeping candlelit photography legible at 320px", "A booking flow that feels like the evening, not a form"],
  },
  noir: {
    concept: "Editorial and commerce are one object. The picture is shoppable; the bag is real.",
    client: "NOIR (fictional fashion house)",
    stack: ["Next.js App Router", "localStorage cart", "server-side repricing endpoint", "simulated checkout"],
    interactions: ["Size-aware line items with quantity, subtotal and removal", "Lookbook looks that jump to their garments", "Wishlist, appointments and journal around the till"],
    challenges: ["Black-on-black that reads expensive, not empty", "Asymmetric editorial layout intact from 320px to 1920px", "Totals the customer cannot edit in devtools"],
  },
  orbit: {
    concept: "A portfolio claiming product craft should let you operate the product.",
    client: "Orbit Systems (fictional)",
    stack: ["Next.js App Router", "local-first store shaped for API swap", "validated CRUD", "CSV export"],
    interactions: ["Customer and project CRUD with validation", "Inline stage moves", "Activity log derived from mutations", "Reports with live counts and CSV download"],
    challenges: ["Dense data with tappable targets at 375px", "One dataset serving KPIs, tables and charts without drift", "Settings that re-skin without forking components"],
  },
  still: {
    concept: "The photograph is the interface; everything else is a mat.",
    client: "Still Studio (fictional)",
    stack: ["Next.js App Router", "next/image grids", "shared Lightbox primitive", "localStorage favorites"],
    interactions: ["Arrow-key lightbox with counter and captions", "Favorites driving a saved-only view", "Print enquiries with edition logic"],
    challenges: ["An almost-empty page that still feels deliberate", "Honest aspect ratios across breakpoints", "Restraint as a technical discipline"],
  },
  signal: {
    concept: "Proof of interactivity: a game with real rules, real feedback, real records.",
    client: "Self-initiated",
    stack: ["Canvas 2D loop", "requestAnimationFrame", "throttled state writes", "localStorage records"],
    interactions: ["Distance-to-core collision with combo scoring", "Pause that truly freezes the timer", "Per-difficulty bests and a claimable records wall"],
    challenges: ["No setState in the 60fps hot loop", "Hit detection fair on a phone thumb", "Pause/resume without losing elapsed time"],
  },
  objects: {
    concept: "Independent retail deserves its own system — not a theme, not a marketplace listing.",
    client: "Berg Objects & co. (fictional makers)",
    stack: ["Next.js App Router", "shared cart engine with NOIR", "option/qty validation", "simulated till"],
    interactions: ["Price slider, categories, search and four sorts in one pipeline", "Maker dossiers beside the catalogue", "In-situ gallery feeding product pages"],
    challenges: ["Faceted filtering that never dead-ends wrongly", "Editorial rhythm that still converts", "Two stores, one honest engine"],
  },
  archive: {
    concept: "A publication is a system of promises: keep your place, remember what you read.",
    client: "The Archive (fictional quarterly)",
    stack: ["Next.js App Router", "IntersectionObserver progress", "bookmarks in localStorage", "inquiries-backed newsletter"],
    interactions: ["Read-state committed at 90% scroll", "Search across titles, deks and bodies", "Subscribe/unsubscribe round-trip"],
    challenges: ["Six essays actually worth reading", "Two-column reading surviving mobile", "A newsletter with no funnel attached"],
  },
  motion: {
    concept: "Motion design is not decoration; it is a timing specification you can read.",
    client: "Self-initiated campaign",
    stack: ["Scroll-linked CSS variables", "rAF-throttled observers", "cubic-bezier token system", "prefers-reduced-motion paths"],
    interactions: ["Progress rail with chapter dots and smooth jumps", "Easing playground: curve, duration, replay", "Seven-rule principles manifesto"],
    challenges: ["Six chapters, one shared timeline vocabulary", "Scroll-linked animation without jank on mid-range phones", "Stillness scored as a beat, not a bug"],
  },
  void: {
    concept: "An art toy with a physics essay behind it: playful first, explainable second.",
    client: "Self-initiated",
    stack: ["Canvas 2D integration loop", "pointer physics", "persisted settings", "field-notes documentation"],
    interactions: ["Attract/repel toggle, density slider, burst", "Typed glyphs injected into the field", "Stillness detection unlocking a formation"],
    challenges: ["Drift that never settles and never explodes", "60fps with hundreds of motes", "Touch controls to replace the keyboard-only original"],
  },
  atlas: {
    concept: "Travel planning is arithmetic dressed as daydreaming. Do both.",
    client: "Atlas (fictional route studio)",
    stack: ["Next.js App Router", "hand-authored SVG map", "itinerary state in localStorage", "validated trip requests"],
    interactions: ["Clickable schematic map synced with filters", "Itinerary builder: reorder, travelers, month, totals", "Request posting a complete brief"],
    challenges: ["A believable schematic from raw path data", "Reordering usable by thumb and arrow keys", "Six fictional routes that feel researched"],
  },
  forge: {
    concept: "Engineers don't want design; they want the number, and proof the number is stable.",
    client: "Forge Industries (fictional)",
    stack: ["Next.js App Router", "SVG dimension generator", "derived spec maths", "validated quote flow"],
    interactions: ["Load slider recomputing the diagram", "Variant-driven drawing geometry", "Three-question quote builder"],
    challenges: ["Dimension lines drawn from data, not by hand", "Zero-decoration visuals pleasant for long sessions", "Quote state surviving reload"],
  },
  pulse: {
    concept: "A record label is a typographic system with a release schedule attached.",
    client: "Pulse Recordings (fictional)",
    stack: ["Next.js App Router", "computed runtimes", "live countdown", "RSVP ledger (server)"],
    interactions: ["Tracklists summing their own totals", "Countdown flipping to OUT NOW at release", "Tour RSVPs persisted with live counts"],
    challenges: ["Oversized type that never breaks measure on small screens", "A music site with no audio that still feels loud", "Sold-out states that refuse politely"],
  },
  civic: {
    concept: "Make complicated information understandable, then prove you did.",
    client: "Northgate Borough (entirely fictional)",
    stack: ["Next.js App Router", "keyword intent matcher", "persisted checklists", "validated issue reporter"],
    interactions: ["Natural-language service finder", "Checklists with progress counts", "Issue reports returning references"],
    challenges: ["Guidance reading like a real council minus the fog", "WCAG-level contrast without blandness", "Fiction labeled unmistakably as fiction"],
  },
  nest: {
    concept: "Rooms are a graph. Draw the graph, let people walk on it.",
    client: "Nest Atelier (fictional)",
    stack: ["Next.js App Router", "interactive SVG floorplan", "material token set", "room-context enquiries"],
    interactions: ["Plan-driven navigation, keyboard included", "Material switcher re-skinning the view", "Per-room enquiries carrying room + material"],
    challenges: ["One material definition serving view and copy", "Mood/scale/relation notes per room", "Floorplan usable with a thumb"],
  },
  vector: {
    concept: "Financial design is trust design. Say what the number is and isn't.",
    client: "Vector Partners (fictional)",
    stack: ["Next.js App Router", "hand-built SVG chart", "toggleable annotations", "validated call booking"],
    interactions: ["14-quarter chart with drawdown labels", "Event-label toggle", "Insight essays with related links"],
    challenges: ["A chart that feels sketched but is measured", "Disclaimers impossible to miss", "Legible axes at 320px"],
  },
};
