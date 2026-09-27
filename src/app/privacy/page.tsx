import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — WASP",
  description: "What WASP collects (very little), why, how long it stays, and how to delete it.",
};

const SECTIONS: [string, string][] = [
  [
    "What we collect",
    "When you use a form — project enquiries, table reservations, itinerary requests, quotes, appointments, print enquiries, newsletter signup — we store what you typed: name, email, and anything you wrote in the message fields (company, dates, party size, project details). Nothing else. We don't buy data, we don't infer data, and there is no advertising profile of you anywhere in this operation.",
  ],
  [
    "Analytics: ours, not theirs",
    "We run our own analytics on our own database. When you visit a world or submit a form, we record the event name (e.g. world_visit), the page path, and the time. No cookies, no fingerprinting, no third-party trackers, no data sold or shared with ad networks — there is nobody to share it with.",
  ],
  [
    "In your browser, not ours",
    "Preferences (theme, motion, carts, wishlists, game scores, builder drafts) live in your browser's local storage. They never leave your device unless a form you submit includes them. Clearing site data wipes them completely.",
  ],
  [
    "Why we keep it",
    "Enquiries and reservations are business records: so we can reply, so we know what was agreed, and so repeated spam can be recognized. That's the whole list of reasons.",
  ],
  [
    "How long it stays",
    "Form submissions are kept until you ask us to delete them, or for 24 months after our last exchange — whichever comes first. Backups rotate out within 90 days after that.",
  ],
  [
    "Your rights",
    "Whatever your jurisdiction, we honor the substance of it: ask what we hold on you, correct it, or delete it entirely. Email hello@wasp.studio with the address you used, and it's done within 30 days — usually within one. No forms, no retention dark patterns, no 'are you sure' maze.",
  ],
  [
    "Security",
    "The database is hosted (Neon, US region) with encrypted connections and access limited to the studio. The site itself runs on Vercel (EU/US regions). Those two are our only subprocessors — nobody else touches your data, because there is nobody else in the loop. No system is perfectly secure; ours holds names and emails, not passwords or payment details — we never see those at all.",
  ],
  [
    "Children",
    "This site is not directed at children and we knowingly collect nothing from them. If you're under 16, please don't submit forms here.",
  ],
];

export default function PrivacyPage() {
  return (
    <div className="studio-page" style={{ maxWidth: 720 }}>
      <p className="kicker">Privacy · last updated 27 September 2026</p>
      <h1 className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 4.4rem)" }}>We collect very little, and say so.</h1>
      <p className="lede">
        Forms store what you type so we can reply. Our own analytics counts visits without cookies
        or trackers. Everything else stays in your browser. Delete-anything requests go to{" "}
        <a href="mailto:hello@wasp.studio">hello@wasp.studio</a> — honored within 30 days.
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
      <p>This page is a plain-language statement of actual practice, not a legal document. If WASP ever handles data beyond form replies and visit counts, this page gets rewritten first.</p>
      <p style={{ marginTop: 16 }}>
        <Link href="/" className="kicker">← Exhibition</Link>
      </p>
    </div>
  );
}
