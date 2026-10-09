import { media, type Photo } from "@/rb54l/media";

export const SITE = {
  name: "WASP",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://wasp-worlds-one.vercel.app",
  email: "hello@wasp.studio",
  tagline: "Websites are too small a word.",
  description:
    "WASP is an independent studio that builds the thing, not a picture of the thing — restaurant sites that take bookings, stores that take money, dashboards that do the job. Fifteen working worlds prove it.",
};

/* ---------------- capabilities & technologies ---------------- */

export type Cap = { id: string; name: string; plain: string; uses: string[] };
export const CAPS: Cap[] = [
  { id: "design", name: "Design", plain: "Deciding what is large, what is quiet and what you touch first.", uses: ["editorial layouts", "type systems", "art direction"] },
  { id: "brand", name: "Brand", plain: "The identity and the website stop arguing with each other.", uses: ["voice", "identity systems", "naming"] },
  { id: "ux", name: "UX / UI", plain: "Flows that don't make people think about the flow.", uses: ["forms", "navigation", "states"] },
  { id: "web", name: "Web development", plain: "It works. On a phone. In a hurry. With a screen reader.", uses: ["Next.js apps", "APIs", "performance"] },
  { id: "saas", name: "Software / SaaS", plain: "Dashboards that let someone do the job, then export it.", uses: ["CRUD", "tables", "reports"] },
  { id: "commerce", name: "Ecommerce", plain: "People can find, want, and buy. In that order.", uses: ["catalogues", "carts", "checkout"] },
  { id: "ai", name: "AI", plain: "Retrieval that points at evidence instead of inventing it.", uses: ["search ranking", "intent routing", "recommendation"] },
  { id: "data", name: "Data & analytics", plain: "Clean it, chart it, admit what it can't tell you.", uses: ["visualisation", "derived metrics", "annotation"] },
  { id: "seo", name: "SEO / GEO", plain: "Pages machines can read and people want to.", uses: ["structured data", "entity graphs", "internal linking"] },
  { id: "marketing", name: "Marketing & CRO", plain: "Funnels with the maths showing.", uses: ["positioning", "funnels", "experiments"] },
  { id: "3d", name: "3D / WebGL", plain: "Space, when space explains something.", uses: ["Three.js scenes", "camera work", "procedural geometry"] },
  { id: "motion", name: "Motion", plain: "Easing is an opinion about time.", uses: ["springs", "choreography", "scroll narrative"] },
  { id: "code-art", name: "Creative coding", plain: "Small rule systems that behave like weather.", uses: ["particles", "generative type", "shaders"] },
  { id: "games", name: "Games", plain: "Rules, feedback, a reason to press again.", uses: ["game loops", "input", "difficulty"] },
  { id: "a11y", name: "Accessibility", plain: "The quiet version works for everyone.", uses: ["keyboard", "contrast", "plain language"] },
  { id: "systems", name: "Systems & strategy", plain: "Design tokens, content models, and deciding what not to build.", uses: ["design systems", "content models", "information architecture"] },
];

export type Tech = { id: string; name: string; what: string };
export const TECH: Tech[] = [
  { id: "next", name: "Next.js", what: "routing, server rendering, API routes" },
  { id: "react", name: "React", what: "component state and interaction" },
  { id: "ts", name: "TypeScript", what: "the graph, the forms, the maths" },
  { id: "postgres", name: "PostgreSQL", what: "briefs, bookings, RSVPs, reports" },
  { id: "drizzle", name: "Drizzle ORM", what: "typed queries" },
  { id: "three", name: "Three.js", what: "real-time 3D scenes" },
  { id: "webgl", name: "WebGL / GLSL", what: "fragment shaders on the GPU" },
  { id: "canvas", name: "Canvas 2D", what: "particles, games, terrain" },
  { id: "svg", name: "SVG", what: "plans, maps, charts, diagrams" },
  { id: "audio", name: "Web Audio", what: "synthesised sound, no files" },
  { id: "storage", name: "localStorage", what: "carts, favourites, memory" },
  { id: "css", name: "CSS / Tailwind", what: "layout, type, motion" },
  { id: "schema", name: "Schema.org", what: "machine-readable entities" },
];

/* ---------------- worlds ---------------- */

export type Reality = { id: string; name: string; adds: string };
export type World = {
  slug: string; n: string; name: string; kind: string; mood: string;
  bg: string; fg: string; accent: string; font: string;
  line: string; why: string; interesting: string; discover: string;
  demonstrates: string[]; caps: string[]; tech: string[];
  realities: Reality[]; cover: Photo; cta: string;
  machine: { concept: string; architecture: string; data: string; motion: string; challenge: string; decision: string; lesson: string };
  failed?: string;
};

const serif = "'Fraunces', Georgia, serif";
export const WORLDS: World[] = [
  {
    slug: "casa", n: "01", name: "CASA", kind: "Restaurant", mood: "warm · cinematic", bg: "#f3e9dc", fg: "#2b1a12", accent: "#b4441f", font: serif,
    line: "The restaurant becomes a room you can walk through.",
    why: "Most restaurant sites are a PDF menu and a phone number that rings out. CASA is a trattoria that answers the three real questions — what's cooking, what's it like in there, can I sit down on Friday — without a phone call.",
    interesting: "The booking form knows which slots are nearly full and says so. The menu filters by what you can't eat, not just what you want.",
    discover: "Switch to the Room reality: the same eight tables become a 3D dining room. Click a table and it pre-fills the booking.",
    demonstrates: ["Validated booking flow stored in Postgres", "Dietary filtering + search", "One dataset rendered as editorial, brutalist and 3D"],
    caps: ["design", "web", "3d", "ux", "brand"], tech: ["next", "react", "postgres", "three", "storage"],
    realities: [
      { id: "trattoria", name: "Trattoria", adds: "The warm editorial default — photography leads, prices whisper." },
      { id: "brutal", name: "Brutalist", adds: "Typography-led reinterpretation. No photos. The menu is the design." },
      { id: "room", name: "Room (3D)", adds: "A spatial experiment: the floor plan as a room you orbit and book from." },
    ],
    cover: media.casa.candles, cta: "Build a restaurant that takes bookings",
    machine: {
      concept: "Answer 'can I eat here on Friday' in under ten seconds.",
      architecture: "One menu array and one table array feed three renderers. Bookings POST to /api/submit and land in a Postgres row.",
      data: "Dishes carry dietary tags, so filters are set intersections, not string matching.",
      motion: "Slow. 900ms image crossfades, nothing bounces. Food should not bounce.",
      challenge: "Making the 3D room useful rather than decorative — it only earned its place once clicking a table filled in the form.",
      decision: "Party size is a stepper, not a dropdown. Nobody wants to scroll to '4'.",
      lesson: "The brutalist version tested oddly well for returning guests: they already know the food.",
    },
    failed: "A first version animated steam over every dish. It looked like a screensaver from 2004. Deleted.",
  },
  {
    slug: "noir", n: "02", name: "NOIR", kind: "Fashion house", mood: "monochrome · editorial", bg: "#0d0d0d", fg: "#f2f0eb", accent: "#f2f0eb", font: "'Bodoni Moda', Didot, serif",
    line: "A collection you can hold still long enough to look at.",
    why: "Fashion ecommerce usually shouts SALE over the clothes. NOIR is an exercise in restraint: one image at a time, sizes that tell you what's left, a cart that doesn't beg.",
    interesting: "The runway reality is keyboard-driven — arrow keys walk the collection like a show.",
    discover: "Add something to the wishlist, then open the runway. Wishlisted looks get a small mark in the corner.",
    demonstrates: ["Full commerce flow: filter → size → cart → checkout simulation", "Lookbook with keyboard navigation", "Appointment booking"],
    caps: ["commerce", "design", "brand", "ux"], tech: ["next", "react", "storage", "postgres"],
    realities: [
      { id: "editorial", name: "Editorial", adds: "Magazine grid, serif captions, the shop hides behind the pictures." },
      { id: "runway", name: "Runway", adds: "Full-bleed, one look at a time, arrow keys to walk. Commerce stripped to a single button." },
    ],
    cover: media.noir[0], cta: "View the identity system",
    machine: {
      concept: "Commerce that behaves like an editorial.", architecture: "Shared cart hook (also used by OBJECTS) with a per-world storage key.",
      data: "Products own size inventory, so 'last one' is computed, not hand-written.", motion: "Sharp. 180ms, hard clip-path wipes, no easing flourishes.",
      challenge: "Keeping checkout honest: it's a simulation, and it says so at the payment step.", decision: "No sale badges. Price in the same type size as the name.",
      lesson: "Restraint is harder to build than decoration — every removed element needed a reason.",
    },
  },
  {
    slug: "orbit", n: "03", name: "ORBIT", kind: "SaaS dashboard", mood: "clinical · functional", bg: "#f6f7f9", fg: "#0f172a", accent: "#2f5bff", font: "'Inter Tight', system-ui, sans-serif",
    line: "A dashboard that lets someone do the job, then leave.",
    why: "Plenty of portfolio 'dashboards' are screenshots. ORBIT is a working account manager: add customers, edit them, delete them, watch the metrics recompute, export a CSV you can actually open.",
    interesting: "The Terminal reality is the same app driven by typed commands: `add Acme 1200`, `ls`, `export`.",
    discover: "Delete every customer. The empty state tells you what to do next instead of showing a sad cloud.",
    demonstrates: ["CRUD with persistent state", "Derived metrics computed from rows", "CSV export", "Command-line reinterpretation"],
    caps: ["saas", "ux", "data", "web"], tech: ["react", "ts", "storage"],
    realities: [
      { id: "light", name: "Console", adds: "The standard product UI — tables, metric cards, settings." },
      { id: "terminal", name: "Terminal", adds: "The same data model through a command line. Proves the UI is a view, not the app." },
    ],
    cover: media.bench.laptop, cta: "Explore the product",
    machine: {
      concept: "Every number on screen is derived from the table below it.", architecture: "Reducer over a customer array, persisted to localStorage, two views subscribe.",
      data: "Seed data is labelled DEMO. MRR, churn-risk count and average plan are computed live.", motion: "Fast and functional: 120ms, no decoration.",
      challenge: "A terminal parser that forgives typos without guessing wrong.", decision: "Settings actually change the UI density — no dead toggles.",
      lesson: "Empty states are where software shows whether it respects you.",
    },
  },
  {
    slug: "still", n: "04", name: "STILL", kind: "Photography", mood: "quiet · natural", bg: "#e9e7e2", fg: "#1d1d1b", accent: "#1d1d1b", font: "'Instrument Serif', Georgia, serif",
    line: "The photographs are the interface. Everything else steps back.",
    why: "Photographer portfolios drown pictures in chrome. STILL has almost no interface: a wall, a lightbox that answers to arrow keys, and a way to ask for a print.",
    interesting: "The Gallery reality hangs the same photos on the walls of a 3D room.",
    discover: "Press F in the lightbox to favourite. Favourites persist and pre-fill the print enquiry.",
    demonstrates: ["Accessible lightbox with keyboard + swipe", "Favourites & print pricing", "3D virtual gallery from the same data"],
    caps: ["design", "3d", "a11y", "ux"], tech: ["react", "three", "storage"],
    realities: [
      { id: "wall", name: "Wall", adds: "A quiet masonry wall. Nothing moves until you ask." },
      { id: "gallery", name: "Gallery (3D)", adds: "A room with the prints hung at eye height. Drag to turn." },
    ],
    cover: media.still[0], cta: "Enter the gallery",
    machine: {
      concept: "Remove everything a photograph doesn't need.", architecture: "One photo list, a lightbox with focus trap, a Three.js room that loads textures lazily.",
      data: "Print price = base × size multiplier × paper. Shown as a formula, not a mystery.", motion: "Almost none. 600ms opacity only.",
      challenge: "Cross-origin textures in WebGL — the room falls back to framed blanks if an image refuses.", decision: "No hover zoom. The photographer framed it; we don't reframe it.",
      lesson: "The quietest world took the longest to get right.",
    },
  },
  {
    slug: "signal", n: "05", name: "SIGNAL", kind: "Arcade game", mood: "playful · kinetic", bg: "#12002b", fg: "#fff5c2", accent: "#ff3ea5", font: "'Press Start 2P', monospace",
    line: "Forty-five seconds, three lives, one more go.",
    why: "A portfolio should contain at least one thing you lose to. SIGNAL is a complete game loop: catch the signals, dodge the noise, beat your record.",
    interesting: "Difficulty scales spawn rate and speed together, so hard mode feels faster, not just busier.",
    discover: "Your records are kept locally per difficulty. Press P to pause, R to restart.",
    demonstrates: ["requestAnimationFrame game loop", "Keyboard + touch + pointer input", "Difficulty curves and persistence"],
    caps: ["games", "code-art", "motion"], tech: ["canvas", "react", "storage", "audio"],
    realities: [
      { id: "arcade", name: "Arcade", adds: "Neon cabinet — pink, yellow, chunky pixels." },
      { id: "vector", name: "Vector", adds: "Green phosphor outlines like a 1979 monitor. Same rules, different era." },
    ],
    cover: media.pulse.dj, cta: "Play the machine",
    machine: {
      concept: "The smallest game that still has a reason to replay.", architecture: "Fixed-timestep update, canvas draw, React only for menus.",
      data: "Records: { easy, normal, hard } in localStorage.", motion: "Screen shake on hit — 6px, 120ms. More felt cheap.",
      challenge: "Touch control that doesn't hide the player under your thumb — you drag anywhere, the ship follows with an offset.", decision: "45 seconds. Long enough to get good, short enough to retry.",
      lesson: "Sound doubled the feel of every hit. It's still off by default.",
    },
  },
  {
    slug: "objects", n: "06", name: "OBJECTS", kind: "Homeware store", mood: "bright · colourful", bg: "#fff4e0", fg: "#1a1a1a", accent: "#ff5a1f", font: "'Space Grotesk', system-ui, sans-serif",
    line: "People can find, want, and buy. In that order.",
    why: "A shop for things made by hand, where every product has a maker and a reason. Filtering, sorting, a price range that works, a cart that survives a refresh.",
    interesting: "Each object has a maker story one tap away — the store sells the person, not just the pot.",
    discover: "The Catalogue reality turns the shop into a dense trade price list for buyers.",
    demonstrates: ["Filter + sort + price range", "Wishlist, cart, checkout", "Two merchandising strategies from one catalogue"],
    caps: ["commerce", "design", "marketing", "ux"], tech: ["react", "storage", "ts"],
    realities: [
      { id: "shelf", name: "Shelf", adds: "Colourful product-led merchandising for browsers." },
      { id: "catalogue", name: "Trade list", adds: "A spreadsheet-dense list for wholesale buyers. Same stock, different customer." },
    ],
    cover: media.objects[1], cta: "Build a store like this",
    machine: {
      concept: "Merchandising is a choice about who the customer is.", architecture: "Pure filter/sort pipeline → memoised list → shared cart hook.",
      data: "Price range slider bounds are derived from the catalogue, not hardcoded.", motion: "Springy add-to-cart — the count pops once.",
      challenge: "Making filters combinable without a results page of zero.", decision: "Zero results shows the nearest match instead of nothing.",
      lesson: "The trade list is uglier and more useful. Both are right.",
    },
  },
  {
    slug: "archive", n: "07", name: "ARCHIVE", kind: "Publication", mood: "analog · quiet", bg: "#f7f3ea", fg: "#1b1b1b", accent: "#8a1c1c", font: "'Newsreader', Georgia, serif",
    line: "A magazine that remembers where you stopped reading.",
    why: "Reading online is interrupted constantly. ARCHIVE is a small publication that respects attention: search, categories, bookmarks, a progress bar, and nothing autoplaying.",
    interesting: "The reading progress is real — scroll position of the article body, not the page.",
    discover: "Bookmark an essay, leave, come back. It's waiting on the index with your progress.",
    demonstrates: ["Search + category filtering", "Bookmarks and reading progress", "Newsletter signup stored in Postgres"],
    caps: ["design", "seo", "a11y", "systems"], tech: ["react", "postgres", "storage"],
    realities: [
      { id: "broadsheet", name: "Broadsheet", adds: "Multi-column newspaper index, rules and small caps." },
      { id: "reader", name: "Reader", adds: "One column, big type, nothing else. For actually reading." },
    ],
    cover: media.archive.overhead, cta: "Read the publication",
    machine: {
      concept: "Treat attention as the scarce resource.", architecture: "Articles as data, search via token matching, progress via IntersectionObserver-free scroll ratio.",
      data: "Bookmarks + progress keyed by article slug.", motion: "Typographic only. Nothing slides.",
      challenge: "Progress that doesn't jump when images load.", decision: "No 'related articles' carousel mid-read.",
      lesson: "A good reading experience is mostly things you didn't add.",
    },
  },
  {
    slug: "motion", n: "08", name: "MOTION", kind: "Motion playground", mood: "kinetic · playful", bg: "#f5f5f0", fg: "#111", accent: "#5b3cff", font: "'Syne', system-ui, sans-serif",
    line: "Easing is an opinion about time. Here are several.",
    why: "Clients say 'make it feel premium' and mean 'make the timing better'. MOTION makes timing visible: curves you can see, springs you can tune, text that choreographs.",
    interesting: "The spring solver is real physics — stiffness, damping, mass — integrated every frame.",
    discover: "Drag the stiffness to 400 and damping to 5. That's what 'bouncy' actually means.",
    demonstrates: ["Custom spring integrator", "Easing curve visualisation", "Kinetic typography"],
    caps: ["motion", "code-art", "design"], tech: ["react", "svg", "css"],
    realities: [
      { id: "studio", name: "Studio", adds: "Playful — the curves drive objects you can watch." },
      { id: "blueprint", name: "Blueprint", adds: "The same motion, plotted as graphs on graph paper." },
    ],
    cover: media.pulse.festival, cta: "Open the motion system",
    machine: {
      concept: "Make timing a thing you can see and argue about.", architecture: "Semi-implicit Euler spring, rAF loop, SVG plots.",
      data: "Curves sampled at 60 points for the plots.", motion: "Everything here is the motion.",
      challenge: "Keeping the solver stable at high stiffness.", decision: "Clamp dt to 1/30s so tab-switching doesn't explode the spring.",
      lesson: "Most 'janky' animation is wrong duration, not wrong curve.",
    },
  },
  {
    slug: "void", n: "09", name: "VOID", kind: "Generative field", mood: "organic · dark", bg: "#050608", fg: "#d7e0ea", accent: "#7cf5d0", font: "'JetBrains Mono', monospace",
    line: "The particles notice where your cursor is going, not just where it is.",
    why: "An environment with no purpose except to be touched. Four thousand particles with attraction, repulsion and a memory of your velocity.",
    interesting: "Fast movement stirs the field; slow movement calms it. Leave it alone and it drifts back to rest.",
    discover: "Hold the mouse button to repel instead of attract. Switch to Glyphs and the particles become letters.",
    demonstrates: ["Particle physics on Canvas", "Velocity-aware pointer interaction", "Density and render-mode controls"],
    caps: ["code-art", "motion", "3d"], tech: ["canvas", "react"],
    realities: [
      { id: "dust", name: "Dust", adds: "Fine points and trails." }, { id: "glyphs", name: "Glyphs", adds: "Each particle is a character from WASP." }, { id: "ink", name: "Ink", adds: "Light background, dark marks — a drawing, not a galaxy." },
    ],
    cover: media.still[3], cta: "Enter the field",
    machine: {
      concept: "Physics that feels like weather.", architecture: "Typed arrays for positions/velocities, one loop, no allocations per frame.",
      data: "Pointer velocity smoothed with an exponential moving average.", motion: "Emergent — nothing is keyframed.",
      challenge: "4,000 particles on a phone. Density auto-scales with screen area.", decision: "No sound. It was tempting.",
      lesson: "Damping is the whole aesthetic.",
    },
  },
  {
    slug: "atlas", n: "10", name: "ATLAS", kind: "Travel planner", mood: "natural · warm", bg: "#eef0e6", fg: "#1f2a1c", accent: "#c0562b", font: "'DM Serif Display', Georgia, serif",
    line: "Plan a coast trip on a map that does the arithmetic.",
    why: "Travel planning is a spreadsheet pretending to be a dream. ATLAS keeps the dream (photographs, a map) and does the spreadsheet (distances, nights, packing) for you.",
    interesting: "Distances are great-circle haversine calculations between real coordinates.",
    discover: "Change the traveller setup to 'with kids, winter'. The packing list rewrites itself.",
    demonstrates: ["SVG map with projected coordinates", "Reorderable itinerary with computed distances", "Rule-based packing list"],
    caps: ["ux", "data", "design"], tech: ["svg", "react", "storage"],
    realities: [
      { id: "paper", name: "Paper map", adds: "Warm, printed-map aesthetic." }, { id: "night", name: "Night train", adds: "Dark, route-first, a departures-board itinerary." },
    ],
    cover: media.atlas.alley, cta: "Plan something like this",
    machine: {
      concept: "Let the map do the maths.", architecture: "Equirectangular projection of lon/lat into SVG; itinerary array persisted.",
      data: "Coordinates are real towns on the Turkish Aegean & Black Sea coasts.", motion: "Route lines draw with stroke-dashoffset.",
      challenge: "Reordering on touch without a drag library — up/down controls plus native drag on desktop.", decision: "The map is stylised and says so. It's not for navigation.",
      lesson: "Showing the km between stops changed which order people chose.",
    },
  },
  {
    slug: "forge", n: "11", name: "FORGE", kind: "Industrial catalogue", mood: "industrial · precise", bg: "#dfe2e3", fg: "#16191b", accent: "#ff6a00", font: "'IBM Plex Mono', monospace",
    line: "Specify a part, inspect it in 3D, get a quote with the maths showing.",
    why: "B2B catalogues are PDFs from 2009. FORGE is a parts catalogue where the spec sheet, the drawing and the quote are the same object.",
    interesting: "The dimension drawing is generated from the same numbers as the 3D part and the price.",
    discover: "Change the finish to anodised and quantity to 500. Watch the unit price fall through the break points.",
    demonstrates: ["Spec-driven SVG drawings", "Procedural Three.js part inspection", "Quote builder with quantity breaks"],
    caps: ["3d", "saas", "ux", "data"], tech: ["three", "svg", "react", "ts"],
    realities: [
      { id: "catalogue", name: "Catalogue", adds: "Clean industrial product pages." }, { id: "blueprint", name: "Blueprint", adds: "Everything as technical drawing, white on blue." }, { id: "inspect", name: "Inspect (3D)", adds: "Rotate the actual part geometry, generated from its specs." },
    ],
    cover: media.forge.gears, cta: "Open the machine",
    machine: {
      concept: "One spec, three representations.", architecture: "Part spec → SVG drawing, Three.js geometry, quote function.",
      data: "Unit price = material × volume × finish factor × quantity break.", motion: "Mechanical: linear rotation, hard stops.",
      challenge: "Procedural gear teeth that look machined, not melted.", decision: "Show tolerance as ± with units, always.",
      lesson: "Engineers trust formulas more than photos.",
    },
  },
  {
    slug: "pulse", n: "12", name: "PULSE", kind: "Music label", mood: "rhythmic · loud", bg: "#ff2e2e", fg: "#0a0a0a", accent: "#0a0a0a", font: "'Archivo Black', Impact, sans-serif",
    line: "A label site that keeps time.",
    why: "Label sites are usually a Bandcamp link. PULSE has releases with tracklists, a live countdown to the next drop, tour dates and an RSVP that goes to a real table.",
    interesting: "Track previews are synthesised in the browser with Web Audio — no audio files shipped.",
    discover: "Switch to Club: the whole page pulses on the beat of whatever is previewing.",
    demonstrates: ["Countdown, tracklists, tour data", "RSVP stored in Postgres", "Web Audio synthesis with clear controls"],
    caps: ["brand", "design", "motion", "marketing"], tech: ["audio", "react", "postgres"],
    realities: [
      { id: "poster", name: "Poster", adds: "Loud Swiss gig-poster typography." }, { id: "club", name: "Club", adds: "Dark, beat-synced, lights on the tempo." },
    ],
    cover: media.pulse.night, cta: "Hear the release",
    machine: {
      concept: "Make the website keep time with the music.", architecture: "WebAudio oscillators scheduled ahead of time; a shared beat clock drives CSS.",
      data: "Releases and dates are fictional and marked as such.", motion: "Rhythmic — everything lands on the beat.",
      challenge: "Browsers block audio until a gesture; the play button is the gesture.", decision: "Sound never autoplays. Volume is visible.",
      lesson: "A 4-note synth loop was more convincing than a fake player.",
    },
  },
  {
    slug: "civic", n: "13", name: "CIVIC", kind: "Public service", mood: "calm · clear", bg: "#ffffff", fg: "#0b0c0c", accent: "#1d70b8", font: "'Public Sans', system-ui, sans-serif",
    line: "A council website that answers the question you actually came with.",
    why: "Public services serve everyone, including people in a hurry, on bad connections, using screen readers. CIVIC is a fictional city service designed plain on purpose.",
    interesting: "The question finder maps everyday phrases ('bins', 'pothole', 'parking permit') to guides.",
    discover: "Turn on Plain reality: bigger text, shorter sentences, one thing per screen.",
    demonstrates: ["Question → guide routing", "Checklists that persist", "Accessible issue-report form stored in Postgres"],
    caps: ["a11y", "ux", "systems", "design"], tech: ["react", "postgres", "storage"],
    realities: [
      { id: "standard", name: "Standard", adds: "A clear government-style service." }, { id: "plain", name: "Plain", adds: "Large text, plain language, one step at a time." },
    ],
    cover: media.civic.library, cta: "See the service",
    machine: {
      concept: "Clarity is a design decision, not an absence of one.", architecture: "Keyword index over guides; form with inline, specific errors.",
      data: "Reports stored with category, location, description.", motion: "None, deliberately.",
      challenge: "Error messages that tell you how to fix it, not that you failed.", decision: "Every guide ends with 'what happens next'.",
      lesson: "The plainest world is the one most people could use.",
    },
  },
  {
    slug: "nest", n: "14", name: "NEST", kind: "Architecture practice", mood: "spatial · architectural", bg: "#ecebe7", fg: "#222", accent: "#7a6a4f", font: "'Instrument Serif', Georgia, serif",
    line: "A floor plan you can read, click, and then walk into.",
    why: "Architecture sites show pretty renders and hide the plan. NEST puts the plan first: rooms you can select, real dimensions, materials, and a 3D mode extruded from the same drawing.",
    interesting: "The 3D walls are built from the 2D plan's coordinates — change the plan data and the building changes.",
    discover: "Select a room in Plan, then switch to Walk. The camera flies to that room.",
    demonstrates: ["Interactive SVG floorplan", "Computed areas from dimensions", "Plan-to-3D extrusion in Three.js"],
    caps: ["3d", "design", "ux"], tech: ["svg", "three", "react"],
    realities: [
      { id: "plan", name: "Plan", adds: "The architectural drawing, interactive." }, { id: "materials", name: "Materials", adds: "The house as a palette of surfaces." }, { id: "walk", name: "Walk (3D)", adds: "The plan extruded into walls; camera flies room to room." },
    ],
    cover: media.nest.stairs, cta: "Walk the house",
    machine: {
      concept: "The plan is the source of truth.", architecture: "Rooms as rectangles in metres → SVG rects → Three.js boxes for walls.",
      data: "Area = w × d, totals computed.", motion: "Spatial: camera tweens with ease-in-out and rests.",
      challenge: "Making the camera never fight you — orbit is damped and clamped.", decision: "Metres, not feet, with one decimal.",
      lesson: "Clicking a room and seeing it in 3D does more than any render.",
    },
  },
  {
    slug: "vector", n: "15", name: "VECTOR", kind: "Financial visualisation", mood: "technical · monochrome", bg: "#0e1116", fg: "#e6e6e6", accent: "#e8ff59", font: "'JetBrains Mono', monospace",
    line: "Fourteen quarters, drawn honestly.",
    why: "Financial charts lie by cropping the axis. VECTOR is a small data essay about a fictional fund: fourteen quarters, drawdowns computed properly, and every figure labelled illustrative.",
    interesting: "Drawdown is computed as distance from the running peak — the chart shades the pain.",
    discover: "Toggle 'start axis at zero'. The same numbers tell a calmer story.",
    demonstrates: ["SVG charting from scratch", "Derived metrics (drawdown, CAGR)", "Editorial data storytelling"],
    caps: ["data", "design", "systems"], tech: ["svg", "react", "ts"],
    realities: [
      { id: "terminal", name: "Terminal", adds: "Dense trading-terminal view." }, { id: "editorial", name: "Editorial", adds: "Light, annotated, a data essay." },
    ],
    cover: media.forge.lock, cta: "Read the numbers",
    machine: {
      concept: "Show the numbers and the honesty of the frame.", architecture: "Hand-built SVG scales, no chart library.",
      data: "ILLUSTRATIVE — a fictional fund's quarterly index values.", motion: "Line draws once; tooltips are instant.",
      challenge: "Tooltips on touch: tap-to-pin.", decision: "Axis-at-zero toggle exposed to the reader.",
      lesson: "Letting readers change the framing builds more trust than any caption.",
    },
  },
];

export const worldBySlug = (s: string) => WORLDS.find((w) => w.slug === s);

/* ---------------- lab ---------------- */

export type Experiment = { slug: string; name: string; line: string; tech: string[]; caps: string[]; status: "working" | "rough" | "broken" };
export const LAB: Experiment[] = [
  { slug: "shader", name: "Oil slick shader", line: "A GLSL fragment shader. Your cursor is a heat source.", tech: ["webgl"], caps: ["code-art"], status: "working" },
  { slug: "type", name: "Nervous type", line: "Letters that lean away from the cursor and remember being pushed.", tech: ["react", "css"], caps: ["motion", "design"], status: "working" },
  { slug: "terrain", name: "Terrain from noise", line: "Procedural hills from value noise, drawn as contour lines. Scroll to fly.", tech: ["canvas"], caps: ["code-art", "3d"], status: "working" },
  { slug: "poster", name: "Poster machine", line: "Generative gig posters from a seed. Press space for another.", tech: ["svg"], caps: ["design", "code-art"], status: "working" },
  { slug: "audio", name: "Hum", line: "An oscillator you play with your cursor, visualised as it sounds.", tech: ["audio", "canvas"], caps: ["code-art"], status: "rough" },
  { slug: "gravity", name: "Gravity cursor", line: "Words fall, pile up and can be thrown.", tech: ["canvas"], caps: ["games", "motion"], status: "rough" },
];

export const FAILURES = [
  { name: "Scroll-jacked homepage", what: "The first WASP homepage hijacked the scroll wheel for a camera move.", why: "Trackpad users overshot, keyboard users got stuck, and it broke 'find in page'.", changed: "Native scroll everywhere. 3D is opt-in at /city.", learned: "If the visitor has to learn your scroll, you've lost them." },
  { name: "The chatbot", what: "A floating chat bubble answering questions with a language model.", why: "It answered confidently about projects that didn't exist.", changed: "The Operator only ranks and links real indexed content — it can't invent a project.", learned: "Retrieval that points at evidence beats generation that sounds nice." },
  { name: "Steam over every dish", what: "Animated steam particles on CASA's food photos.", why: "Cheap. Also made the photos look fake, which they aren't.", changed: "Removed. Photos sit still.", learned: "Photography doesn't need help." },
  { name: "Seven realities per world", what: "Early plan: every world gets seven design variants.", why: "Most were theme swaps pretending to be ideas.", changed: "Two or three per world, each with a sentence explaining what it adds.", learned: "A reality has to earn a reason to exist." },
];

/* ---------------- search index ---------------- */

export type Entry = { type: "world" | "lab" | "note" | "tool" | "page" | "tech" | "cap"; title: string; sub: string; href: string; tags: string[] };

import { NOTES } from "./notes";

export const TOOLS = [
  { slug: "observatory", name: "Data Observatory", line: "Clean, filter and chart a real public dataset.", caps: ["data"] },
  { slug: "funnel", name: "Funnel Lab", line: "Move the assumptions, watch the revenue maths.", caps: ["marketing"] },
  { slug: "system", name: "Design System Lab", line: "Change the tokens, watch the interface rebuild.", caps: ["systems", "design"] },
  { slug: "workbench", name: "Workbench", line: "World × style × tech × interaction → a concept.", caps: ["systems", "design"] },
  { slug: "constellation", name: "Tech constellation", line: "Click a technology, see where it's used.", caps: ["systems"] },
];

export function buildIndex(): Entry[] {
  const e: Entry[] = [];
  WORLDS.forEach((w) => e.push({ type: "world", title: w.name, sub: `${w.kind} — ${w.line}`, href: `/worlds/${w.slug}`, tags: [w.kind, w.mood, ...w.caps, ...w.tech, ...w.demonstrates, ...w.realities.map((r) => r.name)] }));
  LAB.forEach((x) => e.push({ type: "lab", title: x.name, sub: x.line, href: `/lab#${x.slug}`, tags: [...x.tech, ...x.caps, "experiment", "weird"] }));
  NOTES.forEach((n) => e.push({ type: "note", title: n.title, sub: n.dek, href: `/notes/${n.slug}`, tags: [n.topic, ...n.tags] }));
  TOOLS.forEach((t) => e.push({ type: "tool", title: t.name, sub: t.line, href: `/tools#${t.slug}`, tags: t.caps }));
  TECH.forEach((t) => e.push({ type: "tech", title: t.name, sub: t.what, href: `/tools#constellation`, tags: [t.id] }));
  CAPS.forEach((c) => e.push({ type: "cap", title: c.name, sub: c.plain, href: `/worlds?cap=${c.id}`, tags: [c.id, ...c.uses] }));
  [
    ["Start a project", "Three clicks to a brief", "/start", "contact hire brief quote budget"],
    ["Studio — who is behind this", "Philosophy, failures, the bench", "/studio", "about person team"],
    ["Process", "How a project actually runs", "/process", "method timeline"],
    ["WASP OS", "The studio as software", "/os", "desktop os"],
    ["The City (3D)", "Optional 3D map of disciplines", "/city", "3d webgl city"],
    ["Work", "Client work, honestly", "/work", "clients case study"],
    ["Credits", "Every photograph, credited", "/credits", "photos attribution"],
  ].forEach(([t, s, h, tags]) => e.push({ type: "page", title: t, sub: s, href: h, tags: tags.split(" ") }));
  return e;
}

/* fuzzy scoring: subsequence + token hits */
export function score(q: string, e: Entry) {
  const query = q.toLowerCase().trim();
  if (!query) return 0;
  const hay = `${e.title} ${e.sub} ${e.tags.join(" ")}`.toLowerCase();
  let s = 0;
  if (e.title.toLowerCase().startsWith(query)) s += 12;
  if (e.title.toLowerCase().includes(query)) s += 6;
  for (const t of query.split(/\s+/)) {
    if (!t) continue;
    if (hay.includes(t)) s += 3;
    else {
      let i = 0;
      for (const ch of e.title.toLowerCase()) if (ch === t[i]) i++;
      if (i === t.length && t.length > 2) s += 1;
    }
  }
  return s;
}

export function related(w: World) {
  return WORLDS.filter((o) => o.slug !== w.slug)
    .map((o) => {
      const cap = o.caps.filter((c) => w.caps.includes(c));
      const tech = o.tech.filter((t) => w.tech.includes(t));
      const mood = o.mood.split(" · ").some((m) => w.mood.includes(m));
      return { w: o, cap, tech, mood, s: cap.length * 2 + tech.length + (mood ? 2 : 0) };
    })
    .sort((a, b) => b.s - a.s)
    .slice(0, 3);
}

export const capName = (id: string) => CAPS.find((c) => c.id === id)?.name ?? id;
export const techName = (id: string) => TECH.find((t) => t.id === id)?.name ?? id;
