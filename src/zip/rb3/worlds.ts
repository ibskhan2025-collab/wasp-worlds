export type Discipline = "Design" | "Code" | "3D" | "Motion" | "Product" | "Commerce" | "Experimental";
export const DISCIPLINES: Discipline[] = ["Design", "Code", "3D", "Motion", "Product", "Commerce", "Experimental"];

export type TransitionKind = "ink" | "curtain" | "scan" | "iris" | "glitch" | "blinds" | "dissolve" | "rise" | "pixel" | "diag" | "shutter" | "flash" | "fade" | "slide";

export type Reality = { id: string; label: string; blurb: string; gl?: boolean };

export type World = {
  slug: string;
  num: string;
  name: string;
  line: string;
  disc: Discipline[];
  caps: string[];
  realities: Reality[];
  transition: TransitionKind;
  palette: { bg: string; fg: string; accent: string };
  note?: string;
  hood: { built: string; why: string; how: string; tech: string[]; model: string; challenges: string };
};

export const WORLDS: World[] = [
  {
    slug: "casa", num: "01", name: "CASA", line: "A restaurant that takes bookings, in five different realities.",
    disc: ["Design", "Code", "3D", "Motion"], caps: ["Hospitality", "Editorial", "Forms", "Database", "Interaction", "WebGL"],
    transition: "ink", palette: { bg: "#2a1810", fg: "#f4e6d0", accent: "#d9763a" },
    realities: [
      { id: "classic", label: "Classic", blurb: "The restaurant website: menu, dishes, gallery, story, booking." },
      { id: "oceanic", label: "Oceanic", blurb: "The room floods. Depth replaces pages; the menu floats." },
      { id: "3d", label: "3D", blurb: "Walk the dining room, inspect a table, book it.", gl: true },
      { id: "brutalist", label: "Brutalist", blurb: "Typography is the building. The menu is a ledger." },
      { id: "japanese", label: "Japanese", blurb: "Quiet, vertical, and mostly silence." },
    ],
    hood: {
      built: "A complete restaurant: 14 dishes with search and dietary filters, dish pages, gallery with lightbox, story, contact and a booking engine with live availability stored in PostgreSQL.",
      why: "Hospitality has one job — fill the tables. It is the clearest test of whether a site can do the thing rather than describe it.",
      how: "One data model and one booking engine, five renderers. Each reality re-authors layout, type, navigation and motion over the same records, so the content never drifts.",
      tech: ["Next.js route handlers", "PostgreSQL + Drizzle", "Canvas 2D water", "React Three Fiber", "Procedural geometry"],
      model: "Browse → filter → inspect → book. In 3D: walk to a table, inspect its dish, choose it, reserve it.",
      challenges: "Honest availability under double submissions (server-side capacity check per slot). Keeping five very different skins on a single semantic, keyboard-usable core.",
    },
  },
  {
    slug: "noir", num: "02", name: "NOIR", line: "Luxury fashion. Eight pieces, a cart, a fitting room.",
    disc: ["Design", "Commerce", "3D"], caps: ["Ecommerce", "Fashion", "Art direction", "Cart & checkout", "WebGL"],
    transition: "curtain", palette: { bg: "#0d0d0d", fg: "#eee9e0", accent: "#b89b6a" },
    realities: [
      { id: "editorial", label: "Editorial", blurb: "A magazine that sells. Big serif, asymmetric layout." },
      { id: "archive", label: "Archive", blurb: "The collection as a catalogue raisonné: index, lot numbers, specs." },
      { id: "showroom", label: "3D Showroom", blurb: "Pieces on pedestals in a dark room. Orbit, select, buy.", gl: true },
    ],
    hood: {
      built: "A fashion house: collection with filters and sorting, product pages with size and quantity, wishlist, persistent cart, checkout simulation, lookbook, appointments and a journal.",
      why: "Luxury is restraint under pressure. The hard part is making buying feel like ceremony without adding friction.",
      how: "A shared commerce engine (cart, wishlist, checkout) under three art directions; the showroom re-presents the same products as lit objects in a WebGL scene.",
      tech: ["Commerce engine hooks", "localStorage persistence", "Bodoni + Jost type pairing", "React Three Fiber", "PMREM environment lighting"],
      model: "Collect → inspect → select size → bag → check out (simulated; nothing is charged).",
      challenges: "Making the 3D showroom an honest shop rather than a screensaver: every pedestal is selectable, keyboard reachable and buys through the same cart.",
    },
  },
  {
    slug: "orbit", num: "03", name: "ORBIT", line: "A believable SaaS product: revenue, customers, projects, reports.",
    disc: ["Product", "Code", "Design"], caps: ["SaaS", "Product design", "Data", "CRUD", "State", "UX"],
    transition: "scan", palette: { bg: "#0a0f1c", fg: "#dbe4ff", accent: "#5b8cff" },
    realities: [
      { id: "console", label: "Console", blurb: "Dense, dark, sidebar-driven operator view." },
      { id: "paper", label: "Paper", blurb: "The same data as a calm, light, top-tabbed executive workspace." },
    ],
    hood: {
      built: "A working subscription-analytics product: MRR dashboard with SVG charts, customer CRUD with search and sort, project board, team, activity feed, reports with CSV export, and persisted settings.",
      why: "Product design is judged in the boring states: empty, edit, delete, confirm, export. This world lives there.",
      how: "A single reducer-style store persisted to localStorage; charts are hand-built SVG with no chart library, so every mark is deliberate.",
      tech: ["React state + persistence", "Hand-built SVG charts", "CSV export via Blob", "Responsive IA (sidebar → tabs → bottom bar)"],
      model: "Scan the numbers → drill into a customer → edit → export the report.",
      challenges: "Information architecture that collapses gracefully: sidebar to bottom bar on mobile without losing any function.",
    },
  },
  {
    slug: "still", num: "04", name: "STILL", line: "Photography: collections, editions and a room you can walk through.",
    disc: ["Design", "3D", "Experimental"], caps: ["Photography", "Gallery", "Keyboard UX", "Editions", "WebGL", "Procedural imagery"],
    transition: "iris", palette: { bg: "#111110", fg: "#e7e2d8", accent: "#c8b88a" },
    realities: [
      { id: "gallery", label: "Gallery", blurb: "Collections, filters, fullscreen viewer, favourites." },
      { id: "contact", label: "Contact sheet", blurb: "Every frame on one sheet, marked with a grease pencil." },
      { id: "hall", label: "Virtual hall", blurb: "A white-walled gallery in 3D. Walk, approach, look closer.", gl: true },
    ],
    hood: {
      built: "A photographer's site: 12 photographs in four collections, filtering, fullscreen viewer with keyboard controls, favourites, print editions and an enquiry form — plus a 3D hall where the same frames hang on the wall.",
      why: "Photography sites usually fail at the two things that matter: the image, and the next step after admiring it.",
      how: "Images are procedurally painted to canvas from a seed, so the gallery ships zero image bytes; the 3D hall reuses those canvases as GPU textures.",
      tech: ["Canvas 2D generation", "CanvasTexture in three.js", "Accessible lightbox dialog", "Keyboard navigation"],
      model: "Filter → view → favourite → choose a print → enquire. In the hall: walk to a frame to read its plate.",
      challenges: "A 3D gallery is useless if you can't leave it: every frame is also reachable as a list and opens the same viewer.",
    },
  },
  {
    slug: "signal", num: "05", name: "SIGNAL", line: "A game. Catch the signal, dodge the noise. Forty-five seconds.",
    disc: ["Code", "Motion", "Experimental"], caps: ["Game design", "Canvas", "Game loop", "Touch input", "Scoring", "Accessibility"],
    transition: "glitch", palette: { bg: "#05070d", fg: "#9cf7ff", accent: "#ff2e7e" },
    realities: [
      { id: "arcade", label: "Arcade", blurb: "Phosphor, scanlines and pixel type." },
      { id: "ink", label: "Ink", blurb: "The same rules drawn like a quiet notebook. Lower contrast, slower feel." },
    ],
    hood: {
      built: "A real-time canvas game: 45 seconds, 3 lives, 3 difficulties, combo scoring, pause, restart, persistent best scores and a server leaderboard.",
      why: "A game is the harshest honesty test: if the loop stutters or the input lags, nobody forgives it.",
      how: "Fixed-timestep update, separate render, pointer/keyboard/touch unified into one target position, render skins injected as draw functions.",
      tech: ["requestAnimationFrame fixed timestep", "Canvas 2D", "Pointer Events", "PostgreSQL leaderboard", "prefers-reduced-motion"],
      model: "Drag or arrow-key the receiver. Catch signals, avoid noise, chain combos.",
      challenges: "Reduced-motion players get no screen shake, no particle bursts and a gentler speed curve — without changing the score rules.",
    },
  },
  {
    slug: "objects", num: "06", name: "OBJECTS", line: "A shop for things made slowly. Ten pieces, ten makers.",
    disc: ["Commerce", "3D", "Design"], caps: ["Ecommerce", "Filtering", "Makers", "Procedural 3D", "Checkout"],
    transition: "blinds", palette: { bg: "#e8e0d2", fg: "#2b2620", accent: "#a4573a" },
    realities: [
      { id: "shop", label: "Shop", blurb: "A calm grid with filters, sorting and a price slider." },
      { id: "workshop", label: "Workshop", blurb: "Maker-first: the people before the products." },
      { id: "inspect", label: "3D Shelf", blurb: "Pieces turned on a lathe, inspectable from any side.", gl: true },
    ],
    hood: {
      built: "A full shop: 10 products, category/material filters, sorting, price slider, wishlist, cart, checkout simulation, maker stories, gallery and product pages with a 3D viewer.",
      why: "Commerce design is mostly restraint: fewer decisions per screen, confidence at each one.",
      how: "Products carry a lathe profile, so the 3D view is generated from the same record as the listing — one source of truth.",
      tech: ["LatheGeometry profiles", "Commerce engine hooks", "Range filtering", "Image-optimised photography"],
      model: "Filter → view → inspect in 3D → add → check out (simulated).",
      challenges: "Keeping the 3D shelf thumb-friendly: one-finger orbit, large tap targets, no scroll-hijacking.",
    },
  },
  {
    slug: "archive", num: "07", name: "ARCHIVE", line: "A digital publication. Six essays worth the time.",
    disc: ["Design", "Code"], caps: ["Editorial", "Typography", "Search", "Reading UX", "Newsletter"],
    transition: "dissolve", palette: { bg: "#f3efe6", fg: "#1c1a17", accent: "#8c2f1b" },
    realities: [
      { id: "journal", label: "Journal", blurb: "Single-column reading. Progress, bookmarks, calm." },
      { id: "broadsheet", label: "Broadsheet", blurb: "Columns, rules, dense front page." },
      { id: "index", label: "Index", blurb: "Plain monospaced catalogue for searching and scanning." },
    ],
    hood: {
      built: "A publication with six long essays, full-text search, categories, bookmarks, scroll-based reading progress, read tracking, manifesto and validated newsletter signup.",
      why: "Editorial design is how you prove you can hold attention without tricks.",
      how: "Essays are data, not pages. Three layouts render the same text; reading state is stored per article.",
      tech: ["Content as data", "Scroll progress observer", "Multi-column CSS", "Newsreader variable type"],
      model: "Search or browse → read → bookmark → return exactly where you were.",
      challenges: "Measure (line length) and leading across three radically different layouts.",
    },
  },
  {
    slug: "motion", num: "08", name: "MOTION", line: "Motion as a material. Chapters, curves, a playground.",
    disc: ["Motion", "Design", "Code"], caps: ["Motion design", "Easing", "Scroll-driven", "Typography", "Reduced motion"],
    transition: "rise", palette: { bg: "#0c0c0c", fg: "#f2f2ee", accent: "#c6ff3d" },
    realities: [
      { id: "stage", label: "Stage", blurb: "Scroll-driven chapters and a live easing playground." },
      { id: "dopesheet", label: "Dopesheet", blurb: "The same animations as a timeline you can scrub." },
    ],
    hood: {
      built: "A motion-design showcase: scroll-driven chapters, a draggable cubic-bezier editor with live curve, duration control, replay, kinetic typography and a reduced-motion mode.",
      why: "Motion is usually decoration. Here it is the content.",
      how: "Custom cubic-bezier solver; the same function drives the plotted curve and the moving object, so what you see in the graph is what moves.",
      tech: ["Cubic-bezier solver", "Scroll progress mapping", "Web Animations API", "SVG curve editor", "prefers-reduced-motion"],
      model: "Drag the handles, press replay, watch the same curve move type, shape and scale.",
      challenges: "Reduced-motion mode replaces movement with state change (fades, outlines), so nothing is lost, only calmed.",
    },
  },
  {
    slug: "void", num: "09", name: "VOID", line: "Generative environment. 180 particles and a pointer with opinions.",
    disc: ["Experimental", "Code", "3D", "Motion"], caps: ["Creative coding", "Canvas", "Physics", "Generative art", "GLSL", "Interaction"],
    transition: "pixel", palette: { bg: "#000000", fg: "#d8d8ff", accent: "#7a5cff" },
    realities: [
      { id: "particles", label: "Particles", blurb: "Attraction, repulsion and pointer physics on canvas." },
      { id: "liquid", label: "Liquid", blurb: "The same bodies, rendered as merging metaballs." },
      { id: "gravity", label: "Gravity", blurb: "Orbits. Hold to add mass, release to slingshot." },
      { id: "shader", label: "Shader", blurb: "A fragment shader in raw GLSL, driven by the pointer.", gl: true },
      { id: "space", label: "3D", blurb: "A volume of points with real depth, steered by the pointer.", gl: true },
    ],
    hood: {
      built: "A generative environment: ~180 particles with pointer attraction/repulsion, density control, glyph spawning by typing, hidden interactions, five renderers, and field notes.",
      why: "It is the quickest way to show physical intuition in code.",
      how: "One simulation step (forces, damping, walls) and interchangeable renderers: dots, metaballs via blur+threshold, orbital integration, a GLSL plane and a 3D point cloud.",
      tech: ["Canvas 2D", "Raw WebGL + GLSL", "React Three Fiber points", "Verlet-style integration", "Pointer physics"],
      model: "Move to push, hold to pull, type to spawn glyphs, discover the rest.",
      challenges: "Frame-rate independence and a graceful fallback: if WebGL is unavailable, the Canvas realities remain.",
    },
  },
  {
    slug: "atlas", num: "10", name: "ATLAS", line: "A travel planner that adds up: map, routes, itinerary, totals.",
    disc: ["Product", "Design", "3D"], caps: ["Maps", "SVG", "Planner", "Drag & reorder", "Totals", "WebGL globe"],
    transition: "diag", palette: { bg: "#13263a", fg: "#f1e9d6", accent: "#e8a33d" },
    realities: [
      { id: "map", label: "Map", blurb: "Pan, zoom and plot routes on a flat SVG atlas." },
      { id: "globe", label: "Globe", blurb: "The trip on a rotating globe with arcs between stops.", gl: true },
    ],
    hood: {
      built: "A trip planner: 12 destinations on a pan/zoom SVG map, ratings, seasons, packing lists, filters, itinerary builder with reorder, travellers, month, running totals and a trip request form.",
      why: "Planning tools are where maps stop being pictures and become arithmetic.",
      how: "Equirectangular projection done by hand; great-circle distances drive route lengths; totals recompute from the itinerary.",
      tech: ["SVG + pointer pan/zoom", "Haversine distance", "CanvasTexture globe", "Keyboard-reorderable list"],
      model: "Filter → add stops → reorder → set travellers and month → request.",
      challenges: "Touch: pinch to zoom, one-finger pan, and buttons for every gesture.",
    },
  },
  {
    slug: "forge", num: "11", name: "FORGE", line: "Industrial catalogue: ten components, real tolerances, quote builder.",
    disc: ["Product", "3D", "Design"], caps: ["Industrial", "Engineering UI", "Parametric SVG", "3D inspection", "Quoting"],
    transition: "shutter", palette: { bg: "#15171a", fg: "#e6e8ea", accent: "#ffb400" },
    realities: [
      { id: "catalogue", label: "Datasheet", blurb: "Specs, parametric diagrams and the quote builder." },
      { id: "inspect", label: "3D Inspect", blurb: "Rotate, section and measure the actual part.", gl: true },
      { id: "blueprint", label: "Blueprint", blurb: "Drafting-table view of the same parametric drawings." },
    ],
    hood: {
      built: "An industrial components catalogue with load, tolerance, finish and lead-time specs, dimension diagrams driven by sliders, family filtering, 3D inspection, and a quote builder with running totals.",
      why: "Industrial buyers don't want delight. They want certainty, fast. That is its own design discipline.",
      how: "Each part is a parametric definition. The SVG diagram, the 3D geometry and the price all derive from the same parameters.",
      tech: ["Parametric SVG", "Procedural 3D (Lathe, Extrude)", "RoomEnvironment PBR metal", "Quote state machine"],
      model: "Pick a family → tune dimensions → inspect in 3D → add to quote.",
      challenges: "Dimension labels that never overlap the part at any parameter value.",
    },
  },
  {
    slug: "pulse", num: "12", name: "PULSE", line: "A music label. Releases, a countdown, a tour, sold-out states.",
    disc: ["Design", "Motion", "Experimental"], caps: ["Music", "Typography", "Web Audio", "Countdown", "RSVP", "Motion"],
    transition: "flash", palette: { bg: "#e5ff3a", fg: "#0a0a0a", accent: "#ff3b1f" },
    realities: [
      { id: "label", label: "Label", blurb: "Giant type, generative covers, tracklists." },
      { id: "board", label: "Departures", blurb: "Tour dates as a split-flap board." },
      { id: "sound", label: "Sound", blurb: "Generative audio per release, with a live analyser.", gl: true },
    ],
    hood: {
      built: "A label site: six releases with generated covers and tracklists, runtime maths, live countdown, tour with RSVP and sold-out states, a split-flap board and a generative-audio player.",
      why: "Labels are identity. This shows typography and motion carrying a whole brand.",
      how: "Every release owns a seed: cover art, tempo and scale all derive from it, so visuals and sound agree.",
      tech: ["Web Audio API", "AnalyserNode canvas", "Split-flap animation", "Countdown hooks"],
      model: "Play → watch the analyser → open the release → RSVP to a show.",
      challenges: "Audio starts only on a user gesture, has a mute control, and never autoplays.",
    },
  },
  {
    slug: "civic", num: "13", name: "CIVIC", line: "A fictional public-service interface, built to be used by everyone.",
    disc: ["Product", "Design", "Code"], caps: ["Accessibility", "Public service", "Content design", "Forms", "Persistence"],
    transition: "fade", palette: { bg: "#ffffff", fg: "#0b0c0c", accent: "#1d70b8" },
    note: "FICTIONAL SERVICE — NOT A REAL GOVERNMENT BODY",
    realities: [
      { id: "standard", label: "Standard", blurb: "Clear, plain-language service." },
      { id: "contrast", label: "High contrast", blurb: "Large type, strong contrast, reduced layout." },
      { id: "plain", label: "Plain text", blurb: "Text-only, no decoration, lightest possible." },
    ],
    hood: {
      built: "A fictional city-council service: question finder, guides with source references, persistent checklists, issue reporting with a reference number, and tracking.",
      why: "Accessibility is the highest-stakes design problem: the interface has to work when everything else fails.",
      how: "Realities here are real accessibility modes — each restructures the page, not just the colours.",
      tech: ["Semantic landmarks", "Skip links", "aria-live regions", "Persistent checklists", "PostgreSQL reports"],
      model: "Ask a question → read a guide → tick the checklist → report an issue → track it.",
      challenges: "Focus order and announcements across a wizard-style question finder.",
    },
  },
  {
    slug: "nest", num: "14", name: "NEST", line: "Architecture: an interactive plan you can step inside.",
    disc: ["Design", "3D", "Experimental"], caps: ["Architecture", "SVG", "3D", "WebGL", "Material system", "Enquiries"],
    transition: "slide", palette: { bg: "#e9e5dc", fg: "#23211d", accent: "#3d6b5a" },
    realities: [
      { id: "blueprint", label: "Blueprint", blurb: "Drafting-style SVG plan with dimensions." },
      { id: "material", label: "Material", blurb: "Swatch-led view: choose floors, walls, cladding." },
      { id: "3d", label: "3D", blurb: "Explore the house: cutaway, walk mode, time of day.", gl: true },
    ],
    hood: {
      built: "A house project: SVG floor plan with clickable rooms and dimensions, material system, room information, enquiries, and a genuine 3D model generated from the same plan.",
      why: "Architects communicate in plans and materials. A plan that you can click, and then enter, is the natural upgrade.",
      how: "Rooms are rectangles in metres. The SVG, the areas, and the extruded 3D walls are all derived from that single array.",
      tech: ["SVG plan generation", "Extruded wall geometry", "Shadow-mapped lighting", "Material presets", "Walk controls"],
      model: "Click a room → read it → pick materials → step into 3D → enquire.",
      challenges: "Wall openings in extruded geometry without a CSG library: walls are assembled from segments.",
    },
  },
  {
    slug: "vector", num: "15", name: "VECTOR", line: "A speculative financial interface. Illustrative numbers only.",
    disc: ["Product", "Design", "3D"], caps: ["Data visualisation", "Fintech UI", "Charts", "Tooltips", "Editorial", "WebGL"],
    transition: "blinds", palette: { bg: "#06120f", fg: "#d4ffe9", accent: "#2cff9a" },
    note: "ILLUSTRATIVE FIGURES — NOT FINANCIAL ADVICE",
    realities: [
      { id: "terminal", label: "Terminal", blurb: "Dark, dense, monospaced." },
      { id: "report", label: "Report", blurb: "Light, typographic, print-quality." },
      { id: "surface", label: "3D Surface", blurb: "Quarter-by-strategy returns as a navigable terrain.", gl: true },
    ],
    hood: {
      built: "A speculative fund interface: 14-quarter performance chart with drawdowns, labelled extremes, tooltips, series toggles, three essays and a partner enquiry form.",
      why: "Charts are arguments. This shows how to make one legible, honest and beautiful.",
      how: "Hand-built SVG with computed drawdown from running peak; the same series feeds the 3D terrain.",
      tech: ["Hand-built SVG", "Drawdown calculation", "Pointer tooltips", "3D bar surface"],
      model: "Toggle strategies → hover quarters → read drawdowns → enquire.",
      challenges: "Making every datum keyboard-reachable and readable in a table fallback.",
    },
  },
];

export const worldBySlug = (s: string) => WORLDS.find((w) => w.slug === s);

export const NAV = [
  { href: "/worlds", label: "Worlds", key: "w" },
  { href: "/lab", label: "Lab", key: "l" },
  { href: "/tools", label: "Tools", key: "t" },
  { href: "/studio", label: "Studio", key: "s" },
  { href: "/process", label: "Process", key: "p" },
  { href: "/os", label: "OS", key: "o" },
  { href: "/start", label: "Start", key: "n" },
];
