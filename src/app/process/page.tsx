import type { Metadata } from "next";
import Link from "next/link";
import { processSteps } from "@/data/studio";

export const metadata: Metadata = {
  title: "Process — Hiring WASP feels organized",
  description: "Sixteen steps from enquiry to growth. The boring parts are the kind parts.",
};

export default function ProcessPage() {
  const totalWeeks = processSteps.reduce((sum, s) => sum + (s.weeks ?? 0), 0);
  return (
    <div className="studio-page">
      <p className="kicker">Process</p>
      <h1 className="display">Hiring WASP should feel organized. Not mysterious.</h1>
      <p className="lede">Sixteen steps from enquiry to continued growth. The boring parts are the kind parts.</p>
      <div className="timeline-banner" style={{ marginTop: 24, padding: "18px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <span className="kicker">Timeline</span>
        <p style={{ marginTop: 4 }}>{totalWeeks} weeks from enquiry to launch. Most of that is waiting for content and decisions, not us.</p>
      </div>
      <ol style={{ listStyle: "none", padding: 0, marginTop: 32 }}>
        {processSteps.map((s) => (
          <li key={s.n} style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 16, padding: "18px 0", borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span className="kicker">{s.n}</span>
              <span className="kicker" style={{ fontSize: "11px", color: "var(--muted)" }}>{String(s.weeks)}w</span>
            </div>
            <div>
              <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>{s.name}</h2>
              <p>{s.text}</p>
              <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <p className="kicker">You</p>
                  <p style={{ marginTop: 4, fontSize: "0.95rem" }}>{s.client.join(", ")}</p>
                </div>
                <div>
                  <p className="kicker">WASP</p>
                  <p style={{ marginTop: 4, fontSize: "0.95rem" }}>{s.wasp.join(", ")}</p>
                </div>
              </div>
              <p style={{ marginTop: 8 }}><strong>Output:</strong> {s.output}</p>
              <p style={{ marginTop: 8 }}><Link href={s.proof[1]} style={{ textDecoration: "underline", fontSize: "0.95rem" }}>See it for real: {s.proof[0]} →</Link></p>
            </div>
          </li>
        ))}
      </ol>
      <p style={{ marginTop: 32 }}><strong>If we part after step 06, you keep the strategy and proposal. Nothing is held hostage.</strong></p>
      <Link className="btn" href="/start">
        Enquiry
      </Link>
      <hr className="rule" />
      <p className="kicker">Don&apos;t take our word — operate the artifacts</p>
      <h2 className="display" style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}>Process you can touch.</h2>
      <p className="lede">Other studios show sketches. We show working paperwork — every artifact below runs on real data, right now.</p>
      <div className="grid-2" style={{ marginTop: 24 }}>
        {[
          ["Timing sheet", "Every frame specified before it renders.", "/worlds/motion/timing"],
          ["Storyboard", "What the client approves first.", "/worlds/motion/storyboard"],
          ["Stock ledger", "Everything on one page.", "/worlds/objects/shop/ledger"],
          ["Spec compare", "Differences lit, winner by numbers.", "/worlds/forge/compare"],
          ["Departures board", "Every route priced and boarding.", "/worlds/atlas/timetable"],
          ["Setlist", "Runtimes, tour dates, honest scarcity.", "/worlds/pulse/setlist"],
        ].map(([name, note, href]) => (
          <Link key={href} href={href} className="panel" style={{ display: "block" }}>
            <p className="kicker">{name} →</p>
            <p>{note}</p>
          </Link>
        ))}
      </div>
      <hr className="rule" />
      <p className="kicker">The reassuring part</p>
      <h2 className="display" style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}>Certainty, itemized.</h2>
      <div className="grid-2" style={{ marginTop: 24 }}>
        <div>
          <p className="kicker">WASP handles</p>
          <p>Everything technical and visual: direction, design, build, QA, launch, analytics, redirects, the 404 page. You never touch a config file or learn what a bundler is.</p>
          <p className="kicker" style={{ marginTop: 16 }}>You handle</p>
          <p>Decisions, content, and access. One owner on your side who can say yes. Showing up to two scheduled reviews with opinions. That&apos;s the whole job.</p>
        </div>
        <div>
          <p className="kicker">Feedback & revisions</p>
          <p>Two structured revision rounds per phase, on a written list — not a drip-feed of new ideas for six weeks. Anything beyond scope gets priced plainly before it&apos;s built, never discovered on the invoice.</p>
          <p className="kicker" style={{ marginTop: 16 }}>Money & after</p>
          <p>A start fee reserves the calendar, milestones follow progress, nothing is due for work you haven&apos;t seen. After launch: handover with docs, or a care arrangement if you&apos;d rather never think about it again.</p>
        </div>
      </div>
    </div>
  );
}
