function normHex(hex: string) {
  let c = hex.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(c)) {
    c = c.split("").map((ch) => ch + ch).join("");
  }
  return /^[0-9a-fA-F]{6}$/.test(c) ? c.toLowerCase() : null;
}

export function relativeLuminance(hex: string) {
  const c = normHex(hex);
  if (!c) return 0;
  const rgb = [0, 2, 4].map((i) => {
    const n = parseInt(c.slice(i, i + 2), 16) / 255;
    return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

export function contrastRatio(a: string, b: string) {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export function estimateScope(input: {
  type: string;
  pages: number;
  ecommerce: boolean;
  cms: boolean;
  custom: boolean;
  motion: string;
  integrations: number;
  complexity: string;
}) {
  let weeksLow = 3;
  let weeksHigh = 5;
  weeksLow += Math.max(0, input.pages - 5) * 0.35;
  weeksHigh += Math.max(0, input.pages - 5) * 0.6;
  if (input.ecommerce) {
    weeksLow += 3;
    weeksHigh += 6;
  }
  if (input.cms) {
    weeksLow += 1;
    weeksHigh += 2.5;
  }
  if (input.custom) {
    weeksLow += 1.5;
    weeksHigh += 3;
  }
  if (input.motion === "cinematic") {
    weeksLow += 1;
    weeksHigh += 2;
  }
  if (input.motion === "chaotic") {
    weeksLow += 2;
    weeksHigh += 4;
  }
  weeksLow += input.integrations * 0.5;
  weeksHigh += input.integrations * 1.1;
  if (input.complexity === "high") {
    weeksLow *= 1.25;
    weeksHigh *= 1.45;
  }
  if (input.type === "app") {
    weeksLow += 2;
    weeksHigh += 5;
  }
  return {
    weeksLow: Math.round(weeksLow * 10) / 10,
    weeksHigh: Math.round(weeksHigh * 10) / 10,
    note: "A range of effort, not a market price. Geography, content readiness, and decision speed move this more than any calculator.",
  };
}

export function fitScore(input: Record<string, number>) {
  const keys = Object.keys(input);
  const avg = keys.reduce((n, k) => n + input[k], 0) / Math.max(keys.length, 1);
  let label = "Unclear";
  if (avg >= 4) label = "Strong fit to discuss";
  else if (avg >= 3) label = "Possible, with conditions";
  else label = "Probably not yet";
  return { avg: Math.round(avg * 10) / 10, label };
}

export const TOOLS = [
  { slug: "audit", name: "Website audit", blurb: "A structured look. Honest about what a URL can and cannot tell us." },
  { slug: "cost", name: "Scope / cost range", blurb: "Effort in weeks. Not a fake universal price." },
  { slug: "fit", name: "Client fit score", blurb: "A profile, not a pickup line." },
  { slug: "scope", name: "Project scope builder", blurb: "Pages, features, depth. Tradeoffs on purpose." },
  { slug: "brief", name: "Website brief generator", blurb: "Questions in. A brief out." },
  { slug: "critique", name: "Homepage critique", blurb: "Hierarchy, CTA, friction — from what you paste." },
  { slug: "a11y", name: "Accessibility checker", blurb: "Contrast and structure. Not a legal stamp." },
  { slug: "ideas", name: "Website idea generator", blurb: "Directions, not templates." },
  { slug: "redesign", name: "Redesign generator", blurb: "Strategy for a site that already exists." },
  { slug: "conversion", name: "Conversion checklist", blurb: "The unglamorous list that makes money." },
];

export const conversionItems = [
  { id: "vp", g: "Message", t: "Value proposition in the first screen, in language a human would say" },
  { id: "cta", g: "Action", t: "One primary CTA. It does a verb." },
  { id: "trust", g: "Trust", t: "Proof that isn't invented" },
  { id: "social", g: "Trust", t: "Space for real names when you have them" },
  { id: "friction", g: "Friction", t: "Forms ask only what you will use" },
  { id: "nav", g: "Nav", t: "Navigation names destinations, not poetry" },
  { id: "mobile", g: "Mobile", t: "Thumb can do the important thing" },
  { id: "forms", g: "Forms", t: "Errors are specific and kind" },
  { id: "check", g: "Commerce", t: "If you sell, checkout is not a surprise" },
  { id: "hier", g: "Hierarchy", t: "The eye knows where to go without being shouted at" },
];
