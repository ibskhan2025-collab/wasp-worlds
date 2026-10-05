import { buildIndex, score, WORLDS, LAB, type Entry } from "./live";

// The Operator is deliberately NOT a language model. It classifies intent with
// keyword rules, ranks real indexed entries, and answers by pointing at them.
// It cannot describe something that isn't in the graph.

type Intent = { id: string; match: RegExp; say: string; picks: string[]; brief?: string };

const INTENTS: Intent[] = [
  { id: "restaurant", match: /restaurant|cafe|café|bar|food|menu|booking|reservation|hospitality|bistro/, say: "For a restaurant, start with CASA — it takes real bookings and filters the menu by diet. CIVIC shows the accessibility bar we'd hold it to.", picks: ["/worlds/casa", "/worlds/civic", "/worlds/archive"], brief: "restaurant" },
  { id: "commerce", match: /e-?commerce|shop|store|sell|product|cart|checkout|fashion|retail/, say: "Two commerce builds with different customers: OBJECTS (colourful, maker-led) and NOIR (restrained, editorial). Both have working carts.", picks: ["/worlds/objects", "/worlds/noir", "/tools#funnel"], brief: "store" },
  { id: "saas", match: /saas|dashboard|admin|crm|software|app\b|internal tool|crud|product ui/, say: "ORBIT is the working SaaS: CRUD, derived metrics, CSV export, and a terminal version of the same data.", picks: ["/worlds/orbit", "/tools#system", "/worlds/vector"], brief: "software" },
  { id: "data", match: /data|analytics|chart|visuali|dashboard|report|statistic|finance|numbers/, say: "VECTOR draws a financial series honestly; the Observatory cleans and charts a real public dataset.", picks: ["/worlds/vector", "/tools#observatory", "/worlds/orbit"], brief: "data" },
  { id: "3d", match: /3d|three|webgl|spatial|immersive|architect|walkthrough|render/, say: "3D is only used where space explains something: NEST (walk a floor plan), FORGE (inspect a part), STILL (a gallery), and the optional City.", picks: ["/worlds/nest", "/worlds/forge", "/city"] },
  { id: "ai", match: /\bai\b|artificial|machine learning|llm|gpt|chatbot|automation|operator/, say: "The AI here is me — retrieval, not generation. The note below explains why that was a deliberate choice after a chatbot failed.", picks: ["/notes/retrieval-before-generation", "/worlds/orbit", "/lab"] },
  { id: "weird", match: /weird|strange|experiment|lab|fun|surprise|odd|art|generative|creative cod/, say: "The Lab is where things are allowed to be rough. VOID is the weirdest finished world.", picks: ["/lab", "/worlds/void", "/worlds/signal"] },
  { id: "hard", match: /difficult|hard|technical|complex|impressive|engineering|clever/, say: "Technically hardest: FORGE (one spec → drawing, 3D part and quote), NEST (plan extruded to 3D), VOID (4,000 particles at 60fps).", picks: ["/worlds/forge", "/worlds/nest", "/worlds/void"] },
  { id: "brand", match: /brand|identity|logo|launch|label|music|campaign|marketing|positioning/, say: "PULSE is a label site with a launch countdown and RSVPs; the Funnel Lab shows how we reason about acquisition.", picks: ["/worlds/pulse", "/tools#funnel", "/worlds/noir"], brief: "brand" },
  { id: "seo", match: /seo|geo|search engine|ranking|google|schema|structured/, say: "Every page here is generated from one entity graph — the note explains how that feeds structured data and search.", picks: ["/notes/entities-not-keywords", "/worlds/archive", "/worlds/civic"], brief: "website" },
  { id: "build", match: /how.*(built|made|work)|stack|tech|under the hood|machine|process/, say: "Every world has an 'Open the machine' panel. Process explains the project rhythm.", picks: ["/process", "/worlds/forge", "/tools#constellation"] },
  { id: "can", match: /what can you|what do you|capabilit|services|offer|help with/, say: "Short version: design and build, as one motion. The worlds are the proof — pick the one closest to your problem.", picks: ["/worlds", "/studio", "/start"] },
  { id: "unsure", match: /don'?t know|not sure|no idea|help me decide|confused/, say: "That's the most common starting point. The project builder takes three clicks and we work out the rest together.", picks: ["/start", "/process", "/worlds"], brief: "unsure" },
  { id: "price", match: /price|cost|budget|how much|quote|rate/, say: "It depends on scope, honestly. The builder asks for a range so the first reply can be specific.", picks: ["/start", "/process"] },
  { id: "contact", match: /contact|email|hire|talk|call|start|work with/, say: "The fastest way is the three-click brief. Or email hello@wasp.studio.", picks: ["/start"] },
];

export type OperatorAnswer = { say: string; results: Entry[]; brief?: string; confidence: "matched" | "search" | "none" };

export function ask(question: string): OperatorAnswer {
  const q = question.toLowerCase();
  const index = buildIndex();
  const intent = INTENTS.find((i) => i.match.test(q));
  if (intent) {
    const results = intent.picks.map((h) => index.find((e) => e.href === h)).filter(Boolean) as Entry[];
    return { say: intent.say, results, brief: intent.brief, confidence: "matched" };
  }
  const ranked = index.map((e) => ({ e, s: score(q, e) })).filter((x) => x.s > 2).sort((a, b) => b.s - a.s).slice(0, 5).map((x) => x.e);
  if (ranked.length) return { say: `I don't have a specific answer for that, but these are the closest things on the site:`, results: ranked, confidence: "search" };
  return {
    say: `Nothing on the site matches that. Rather than guess: here's something weird, something useful, and the way to ask a human.`,
    results: [index.find((e) => e.href === `/worlds/${WORLDS[8].slug}`)!, index.find((e) => e.href === "/worlds/orbit")!, index.find((e) => e.href === "/start")!],
    confidence: "none",
  };
}

export const SUGGESTIONS = ["What can you build?", "Show me something weird", "I need a website for a restaurant", "Show me 3D", "Something technically difficult", "How was this built?", "I don't know what I need"];

// Curated journeys — meaningful connections, not random.
export const ROUTES = {
  thirty: [
    { href: "/worlds/casa", why: "One strong piece: a restaurant that takes bookings." },
    { href: "/worlds/forge", why: "One technical proof: spec → 3D → quote." },
    { href: "/lab", why: "One weird experiment." },
    { href: "/studio#failures", why: "One human detail: what didn't work." },
    { href: "/start", why: "Then, three clicks." },
  ],
  deep: [
    { href: "/worlds", why: "The fifteen worlds, as a map." },
    { href: "/worlds/orbit", why: "Software that actually works." },
    { href: "/worlds/nest", why: "Plan → 3D, open the machine." },
    { href: "/tools", why: "Data, funnels, design systems." },
    { href: "/lab", why: "Experiments and failures." },
    { href: "/notes", why: "The thinking behind it." },
    { href: "/process", why: "How a project runs." },
    { href: "/studio", why: "Who is behind this." },
    { href: "/start", why: "Tell us what you're building." },
  ],
  surprise: [
    ["/worlds/forge", "/tools#observatory", "/worlds/motion", "/lab#shader", "/worlds/void", "/start"],
    ["/worlds/casa", "/worlds/nest", "/notes/3d-has-to-explain-something", "/worlds/still", "/start"],
    ["/worlds/pulse", "/worlds/signal", "/lab#audio", "/worlds/motion", "/start"],
    ["/worlds/civic", "/notes/boring-is-a-feature", "/tools#system", "/worlds/archive", "/start"],
    ["/worlds/vector", "/notes/start-the-axis-at-zero", "/tools#funnel", "/worlds/objects", "/start"],
  ],
  labCount: LAB.length,
};
