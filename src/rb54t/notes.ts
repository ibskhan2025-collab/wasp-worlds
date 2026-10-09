export type Note = { slug: string; title: string; dek: string; topic: string; tags: string[]; date: string; body: string[]; worlds: string[] };

export const NOTES: Note[] = [
  {
    slug: "a-reality-is-not-a-theme", title: "A reality is not a theme", topic: "design", date: "2026-02-11", worlds: ["casa", "nest", "orbit"],
    dek: "Why every world on this site has two or three versions, and why most proposed versions got cut.",
    tags: ["design systems", "art direction", "realities"],
    body: [
      "A theme changes colours. A reality changes what the product thinks is important. CASA's brutalist version has no photographs at all — it assumes you already know the food and just want the prices. That's a different customer, not a different paint job.",
      "The test we use is one sentence: what does this version add that the other can't? If the answer is 'it's darker', it's a theme, and it goes in a settings menu or nowhere.",
      "ORBIT's terminal reality passed the test for an unexpected reason. It proves the dashboard is a view over a data model, not the data model itself. That's an architectural claim, made visible.",
      "Most of the realities we sketched failed. Seven per world became two or three. The survivors each have a line in the reality switcher explaining themselves, because if we can't explain it in a line, the visitor won't feel it either.",
    ],
  },
  {
    slug: "retrieval-before-generation", title: "Retrieval before generation", topic: "ai", date: "2026-01-28", worlds: ["orbit", "archive"],
    dek: "The Operator can't invent a project. That's the feature.",
    tags: ["ai", "search", "rag", "operator"],
    body: [
      "The first AI feature on WASP was a chatbot. It was charming for about four questions and then confidently described a project that didn't exist. For a portfolio, that's the worst possible failure: the whole point is evidence.",
      "The Operator works the other way round. Your question is matched against an index of real things on this site — worlds, experiments, notes, tools — using intent keywords and fuzzy scoring. It answers by pointing, not by writing.",
      "That makes it less impressive in a demo and much more useful in practice. It never needs a disclaimer about hallucination, because it has nothing to hallucinate with.",
      "If you want a generative layer later, put it on top: retrieve first, generate a summary constrained to what was retrieved, and always show the sources. The order matters.",
    ],
  },
  {
    slug: "entities-not-keywords", title: "Entities, not keywords", topic: "seo", date: "2026-01-09", worlds: ["archive", "civic"],
    dek: "What GEO actually means once you strip the hype: describe things and their relationships so machines don't have to guess.",
    tags: ["seo", "geo", "schema.org", "structured data"],
    body: [
      "Search engines and language models both do better when a site says what things are. Not 'restaurant website design services' repeated eleven times, but: this is a CreativeWork, made by this Organization, using these technologies, about this topic.",
      "On WASP, one graph file describes every world, experiment, note, capability and technology, and the links between them. That single file generates the search index, the related-work suggestions, the Operator's answers, the sitemap and the JSON-LD on each page.",
      "The benefit isn't a ranking trick. It's consistency: when every surface is generated from the same facts, nothing contradicts anything else, and a crawler — human or machine — gets the same story everywhere.",
      "Generative Engine Optimisation, if it means anything, means that: be the clearest, most internally consistent source on your own work.",
    ],
  },
  {
    slug: "start-the-axis-at-zero", title: "Start the axis at zero (sometimes)", topic: "data", date: "2025-12-15", worlds: ["vector"],
    dek: "VECTOR lets you toggle the y-axis. Watch how the story changes.",
    tags: ["data visualisation", "charts", "honesty"],
    body: [
      "A line chart cropped to its range makes a 4% dip look like a cliff. Starting at zero makes a real crash look like a wobble. Neither is neutral.",
      "Instead of picking one and hiding the decision, VECTOR gives the reader the switch. The data doesn't change; the frame does, and you can feel the difference in your stomach.",
      "Drawdown helps here. It measures distance from the running peak, which is what an investor actually experiences. Shading it under the line shows pain directly instead of making you infer it from slope.",
      "Every figure in VECTOR is labelled illustrative. Fake numbers presented as real are the fastest way to lose a reader who knows anything.",
    ],
  },
  {
    slug: "the-funnel-is-multiplication", title: "The funnel is multiplication", topic: "marketing", date: "2025-11-30", worlds: ["objects", "pulse"],
    dek: "Why doubling a 2% step beats polishing a 60% step, with the maths showing.",
    tags: ["cro", "funnels", "marketing"],
    body: [
      "Revenue from a funnel is visitors × each step's rate × order value. Because it's a product, relative improvements anywhere have the same effect on the result — a 10% lift at checkout equals a 10% lift in traffic.",
      "What differs is cost. Doubling traffic is expensive. Lifting a weak 2% product-page-to-cart rate to 3% is often a copy change and a better photo. The Funnel Lab lets you drag each assumption and see that directly.",
      "The trap is optimising the step you can measure most easily instead of the one that's weakest. Find the smallest number in the chain first.",
      "And none of this is a promise. Funnel models are assumptions made visible, which is exactly why they're useful in a conversation with a client.",
    ],
  },
  {
    slug: "3d-has-to-explain-something", title: "3D has to explain something", topic: "3d", date: "2025-10-22", worlds: ["nest", "forge", "still", "casa"],
    dek: "A floating sphere is not a 3D experience. A floor plan you can walk into is.",
    tags: ["three.js", "webgl", "3d"],
    body: [
      "Every 3D scene on WASP had to answer one question before it was built: what does space explain here that a flat page can't?",
      "NEST: how rooms connect. FORGE: what the part looks like from the side you can't photograph. STILL: the scale of prints on a wall. CASA: where the good table is. Each of those is a real question a real visitor has.",
      "The scenes load only when you choose that reality, never on page load. Lite mode replaces them with 2D equivalents that answer the same question.",
      "The camera never scroll-jacks. It eases, it rests, and it stops when you stop.",
    ],
  },
  {
    slug: "springs-not-durations", title: "Springs, not durations", topic: "motion", date: "2025-09-18", worlds: ["motion", "void"],
    dek: "Duration-based animation is a guess about the future. Springs respond to the present.",
    tags: ["motion", "physics", "animation"],
    body: [
      "A 300ms ease-out looks fine until the user interrupts it. Then it either jumps or finishes a motion nobody wants any more. A spring just retargets: it has position and velocity, and a new target changes its acceleration.",
      "Three numbers describe it — stiffness, damping, mass — and they map to feelings. High stiffness, low damping: bouncy. High damping: heavy and calm. The MOTION world lets you feel each one.",
      "The implementation is ten lines of semi-implicit Euler integration. The only trick is clamping the timestep so a background tab doesn't hand the solver a two-second frame and launch everything into orbit.",
    ],
  },
  {
    slug: "boring-is-a-feature", title: "Boring is a feature", topic: "systems", date: "2025-08-04", worlds: ["civic", "orbit"],
    dek: "CIVIC has no animation at all. It's the world most people could actually use.",
    tags: ["accessibility", "plain language", "public services"],
    body: [
      "Public service design has already solved problems the rest of the web keeps re-failing: one thing per page, errors that tell you how to fix them, words people actually use.",
      "CIVIC borrows all of it. The question finder maps 'bins' to 'waste collection', because nobody searches for the department name. Error messages say 'Enter a street name, like Harbour Road', not 'Invalid input'.",
      "It's the least spectacular world on the site and the one we'd defend hardest in a review.",
    ],
  },
];

export const noteBySlug = (s: string) => NOTES.find((n) => n.slug === s);
