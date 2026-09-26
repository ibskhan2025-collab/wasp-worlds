// Quarterly index values + labelled events. Drawdowns labelled, not smoothed.
export const vectorQuarters = [
  { q: "Q1 23", v: 100, event: null as string | null },
  { q: "Q2 23", v: 106, event: null },
  { q: "Q3 23", v: 102, event: "Rate shock" },
  { q: "Q4 23", v: 111, event: null },
  { q: "Q1 24", v: 118, event: null },
  { q: "Q2 24", v: 114, event: "Drawdown −3.4%" },
  { q: "Q3 24", v: 124, event: null },
  { q: "Q4 24", v: 131, event: null },
  { q: "Q1 25", v: 127, event: "Rebalance" },
  { q: "Q2 25", v: 138, event: null },
  { q: "Q3 25", v: 146, event: null },
  { q: "Q4 25", v: 152, event: null },
  { q: "Q1 26", v: 149, event: "Drawdown −2.0%" },
  { q: "Q2 26", v: 158, event: null },
];

export type Insight = { slug: string; title: string; dek: string; date: string; body: string[] };

export const vectorInsights: Insight[] = [
  {
    slug: "drawdowns-are-the-fee",
    title: "Drawdowns are the fee",
    dek: "Returns are the gross. What you keep depends on what you do when it falls.",
    date: "June 2026",
    body: [
      "Every quarter above is labelled, including the two that hurt. Q2 24 fell 3.4% on the rate shock; Q1 26 fell 2.0% on the rebalance.",
      "The clients who stayed did so because the loss was narrated before it happened: this is the fee for the other twelve quarters.",
      "A finance website that hides its drawdowns is asking you to trust a narrator who edits. Vector doesn't edit.",
    ],
  },
  {
    slug: "fees-in-plain-figures",
    title: "Fees in plain figures",
    dek: "One percent, compounded, is not a small number. Here it is, worked.",
    date: "March 2026",
    body: [
      "On £500,000 over twenty years at 6% gross, a 1% fee costs roughly £230,000. Not approximately — arithmetically.",
      "We charge 0.6% on the first million, 0.4% after, nothing on cash. The full schedule is one page, and it is linked from every page.",
      "If a firm needs twelve pages to explain its fees, the fees are the product.",
    ],
  },
  {
    slug: "why-we-write",
    title: "Why we write",
    dek: "Thought leadership that never asks is just publishing.",
    date: "January 2026",
    body: [
      "Each insight on this page ends one scroll from a named partner and a calendar. That is deliberate.",
      "Writing that entertains but never converts is a hobby. Writing that converts but never informs is a funnel. We aim for the narrow middle.",
      "If an article didn't change a single allocation decision, it shouldn't have been published.",
    ],
  },
];

export const vectorPractices = ["Advisory", "Discretionary", "Pensions"];
