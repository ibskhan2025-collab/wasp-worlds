import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms — WASP",
  description: "The short, plain terms for using the WASP exhibition: demos, simulated stores, your content, our content.",
};

const SECTIONS: [string, string][] = [
  [
    "What this site is",
    "WASP is a design studio's exhibition. The fifteen worlds are working demonstrations by WASP — fictional restaurants, stores, dashboards and publications built to show capability. They are not real businesses, and nothing here implies otherwise where it matters.",
  ],
  [
    "Simulated commerce",
    "Bags, carts, checkouts, reservations and quotes across the worlds are simulations. No payment is taken, no goods ship, no table is held in the real world. Any page that records an order says so on the page.",
  ],
  [
    "Your content",
    "What you type into forms — enquiries, briefs, reports, subscriptions — is yours. You grant WASP permission to store and use it to respond to you, as described in the privacy policy. Don't submit anything you don't have the right to share.",
  ],
  [
    "Our content",
    "Design, copy, code and imagery arrangement on this site are WASP's. Pexels photographs follow the Pexels license. Don't clone a world wholesale and sell it; ask instead — the answer is often yes with credit.",
  ],
  [
    "Acceptable use",
    "No spam through the forms, no scraping at abusive rates, no probing for vulnerabilities. Rate limits enforce this automatically; deliberate abuse gets blocked and, if necessary, reported.",
  ],
  [
    "No warranties",
    "The site is provided as-is. Demos may change or break without notice. WASP is not liable for decisions made on the basis of illustrative figures (see VECTOR), fictional guides (see CIVIC), or anything else clearly marked as demonstration.",
  ],
  [
    "Changes",
    "These terms may change as the site grows; the current version always lives at this URL. Continued use after changes means acceptance.",
  ],
  [
    "Contact",
    "Questions about these terms: hello@wasp.studio.",
  ],
];

export default function TermsPage() {
  return (
    <div className="studio-page" style={{ maxWidth: 720 }}>
      <p className="kicker">Terms · last updated 27 September 2026</p>
      <h1 className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 4.4rem)" }}>Short terms, plainly stated.</h1>
      <p className="lede">
        Demos are demos, simulated stores sell nothing, your words stay yours,
        our work stays ours. The detail is below, in eight short sections.
      </p>
      <div style={{ marginTop: 28 }}>
        {SECTIONS.map(([t, b], i) => (
          <details key={t} style={{ padding: "16px 0", borderTop: "1px solid var(--line)" }}>
            <summary style={{ cursor: "pointer", fontSize: "1.2rem", fontFamily: "var(--font-display)" }}>
              <span className="kicker">0{i + 1} · </span>{t}
            </summary>
            <p style={{ lineHeight: 1.65, maxWidth: "62ch" }}>{b}</p>
          </details>
        ))}
      </div>
      <hr className="rule" />
      <p className="kicker">Not legal advice</p>
      <p>Plain-language terms for a studio site, not a legal document. If WASP ever takes real payments or signs enterprise contracts, those carry their own terms.</p>
      <p style={{ marginTop: 16, display: "flex", gap: 16 }}>
        <Link href="/privacy" className="kicker">Privacy →</Link>
        <Link href="/" className="kicker">← Exhibition</Link>
      </p>
    </div>
  );
}
