import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Tools — Useful before you hire anyone",
  description: "Audits, estimators, checklists. Working instruments, honestly labelled.",
};

const OUTPUT: Record<string, string> = {
  audit: "Fetch + checklist",
  cost: "Week range",
  fit: "Fit profile",
  scope: "Scope text",
  brief: "Brief text",
  critique: "Critique list",
  a11y: "Contrast ratio",
  ideas: "Directions",
  redesign: "Strategy",
  conversion: "Checklist score",
};

export default function ToolsPage() {
  return (
    <div className="tool-page">
      <p className="kicker">Tools</p>
      <h1 className="display">Useful before you hire anyone. Including us.</h1>
      <p className="lede">These are working instruments. Where a live crawl isn&apos;t possible, the tool says so. Where a result can travel to the builder, it offers to.</p>
      <div className="grid-2" style={{ marginTop: 32 }}>
        {TOOLS.map((t, i) => (
          <Link key={t.slug} href={`/tools/${t.slug}`} className="panel" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div className="kicker">0{i + 1}</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>{t.name}</h2>
              <p>{t.blurb}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="kicker">Output</span>
              <span className="kicker">{OUTPUT[t.slug] ?? "Result"}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
