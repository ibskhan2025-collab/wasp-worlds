export type CivicService = {
  slug: string;
  title: string;
  dept: string;
  keywords: string[];
  intro: string;
  steps: { t: string; b: string }[];
  source: string;
};

export const civicServices: CivicService[] = [
  {
    slug: "parking-permit",
    title: "Resident parking permit",
    dept: "Streets",
    keywords: ["park", "car", "permit", "street", "vehicle", "zone"],
    intro: "Park in your own zone without collecting tickets. Apply once a year, renew in two taps.",
    steps: [
      { t: "Check your zone", b: "Enter your street on the map. Zones follow parking pressure, not postcodes — your neighbour may differ." },
      { t: "Prove the car lives here", b: "Logbook or lease with your name and address. A photo from your phone is fine." },
      { t: "Pay for the year", b: "First car £42, second £96. Blue badge holders park free — declare it, no evidence uploaded twice." },
      { t: "Print nothing", b: "Wardens check plates, not paper. Your permit is live the moment you pay." },
    ],
    source: "Streets order 14-B, revised March 2026",
  },
  {
    slug: "bin-collection",
    title: "Bins and recycling",
    dept: "Waste",
    keywords: ["bin", "rubbish", "recycling", "collect", "trash", "waste", "missed"],
    intro: "What goes out, when, and what to do when the truck misses you.",
    steps: [
      { t: "Learn your day", b: "Collections run Tuesday to Friday by street. Put bins out by 6:30 — the truck does not loop back." },
      { t: "Sort it right", b: "Food in the caddy, dry recycling loose (never bagged), glass in the box. Wrong-bin bins get a tag, not a fine, the first time." },
      { t: "Report a miss", b: "Missed before noon? Report it here the same day and the crew returns within 48 hours." },
      { t: "Big things", b: "Mattresses, sofas, fridges: book a bulky pickup. Three items, £28, collected Thursdays." },
    ],
    source: "Waste collection charter 2026",
  },
  {
    slug: "housing-repair",
    title: "Report a housing repair",
    dept: "Housing",
    keywords: ["repair", "leak", "mould", "mold", "boiler", "heating", "damp", "landlord", "fix"],
    intro: "Something broken in a council home. Tell us once, track it, never chase.",
    steps: [
      { t: "Say what's wrong", b: "One sentence and one photo. Leak, no heat, broken lock — pick the closest, describe the rest." },
      { t: "Get a priority", b: "Emergency (no heat, major leak): same day. Urgent: 3 days. Routine: 20 days. The page tells you which, with the rule linked." },
      { t: "Pick a slot", b: "Morning or afternoon windows, texted the night before with the operative's name." },
      { t: "Confirm it's fixed", b: "Nothing closes until you say so. Reopen in one tap if the fix didn't hold." },
    ],
    source: "Repairs policy, tenant version",
  },
  {
    slug: "school-place",
    title: "Apply for a school place",
    dept: "Education",
    keywords: ["school", "place", "admission", "child", "apply", "nursery", "reception"],
    intro: "Reception applications, explained without the panic. Deadlines are real; the rest is calmer than rumour says.",
    steps: [
      { t: "List three schools", b: "In true order of preference — the algorithm is not fooled by tactics, only by dishonest addresses." },
      { t: "Apply by 15 January", b: "Online, ten minutes. Late applications are processed after on-time ones, no exceptions." },
      { t: "Offers on 16 April", b: "One offer, by email. Accept within two weeks or it lapses." },
      { t: "Appeal if you must", b: "Appeals heard within 40 school days. Most succeed only on process error — the guide says what counts." },
    ],
    source: "Admissions code, parent summary",
  },
];

export function findService(q: string): CivicService[] {
  const words = q.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2);
  if (!words.length) return [];
  return civicServices
    .map((s) => {
      const hay = `${s.title} ${s.intro} ${s.keywords.join(" ")}`.toLowerCase();
      const score = words.filter((w) => hay.includes(w)).length;
      return { s, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.s);
}
