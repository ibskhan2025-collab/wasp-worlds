import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Tools — Useful before you hire anyone",
  description: "Audits, estimators, checklists. Working instruments, honestly labelled.",
};

export default function ToolsPage() {
  return (
    <div className="tool-page">
      <p className="kicker">Tools</p>
      <h1 className="display">Useful before you hire anyone. Including us.</h1>
      <p className="lede">These are working instruments. Where a live crawl isn&apos;t possible, the tool says so.</p>
      <div className="grid-2" style={{ marginTop: 32 }}>
        {TOOLS.map((t, i) => (
          <Link key={t.slug} href={`/tools/${t.slug}`} className="panel">
            <div className="kicker">0{i + 1}</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>{t.name}</h2>
            <p>{t.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
