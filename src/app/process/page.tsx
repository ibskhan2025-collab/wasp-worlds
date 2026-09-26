import type { Metadata } from "next";
import Link from "next/link";
import { processSteps } from "@/data/studio";

export const metadata: Metadata = {
  title: "Process — Hiring WASP feels organized",
  description: "Sixteen steps from enquiry to growth. The boring parts are the kind parts.",
};

export default function ProcessPage() {
  return (
    <div className="studio-page">
      <p className="kicker">Process</p>
      <h1 className="display">Hiring WASP should feel organized. Not mysterious.</h1>
      <p className="lede">Sixteen steps from enquiry to continued growth. The boring parts are the kind parts.</p>
      <ol style={{ listStyle: "none", padding: 0, marginTop: 32 }}>
        {processSteps.map((s) => (
          <li key={s.n} style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 16, padding: "18px 0", borderTop: "1px solid var(--line)" }}>
            <span className="kicker">{s.n}</span>
            <div>
              <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>{s.name}</h2>
              <p>{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link className="btn" href="/start">
        Enquiry
      </Link>
    </div>
  );
}
