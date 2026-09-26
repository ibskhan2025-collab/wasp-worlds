import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documents — The paperwork, in plain language",
  description: "Welcome package, proposals, agreements. Nothing mysterious.",
};

const docs = [
  { t: "Welcome package", d: "What happens after you say yes. People, tools, hours, manners." },
  { t: "Case study deck", d: "Problem / decision / design / interaction / result. No invented metrics." },
  { t: "Proposal", d: "Scope as verbs. Price as a sequence. Built in the OS." },
  { t: "Agreement", d: "Placeholder. Not a contract. Not legal advice." },
  { t: "Invoice / payment", d: "Placeholder for a payment record." },
  { t: "Onboarding questionnaire", d: "Access, voice, assets, the single owner on your side." },
  { t: "Content checklist", d: "Every page has a job. If the asset is missing, the page waits." },
];

export default function DocumentsPage() {
  return (
    <div className="docs-page">
      <p className="kicker">Documents</p>
      <h1 className="display">Paperwork as part of the craft.</h1>
      <p className="lede">Templates and interfaces. Nothing here is a signed legal instrument.</p>
      <div className="grid-2" style={{ marginTop: 28 }}>
        {docs.map((d) => (
          <div key={d.t} className="panel">
            <h2>{d.t}</h2>
            <p>{d.d}</p>
          </div>
        ))}
      </div>
      <Link className="btn ghost" href="/os" style={{ marginTop: 24 }}>
        Open in OS
      </Link>
    </div>
  );
}
