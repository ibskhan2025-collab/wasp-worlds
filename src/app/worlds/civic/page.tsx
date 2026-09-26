import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { Finder } from "./finder";
import { ReportForm } from "./report-form";

export const metadata: Metadata = {
  title: "CIVIC — Important information, made understandable",
  description: "A public-service world: ask a question, get a pathway. Parking, bins, repairs, school places.",
};

export default function CivicPage() {
  return (
    <div className="still-root">
      <WorldExit id="civic" label="Room 13 · CIVIC" />
      <header style={{ padding: "32px 20px 12px", borderBottom: "1px solid var(--line)" }}>
        <p className="kicker">Room 13 · Institutions / Public</p>
        <h1 style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)", margin: "4px 0", letterSpacing: "-0.05em" }}>CIVIC</h1>
        <p style={{ maxWidth: "52ch", fontSize: "1.15rem" }}>Don&apos;t browse departments. Ask your question — the site finds the pathway.</p>
      </header>
      <Finder />
      <ReportForm />
    </div>
  );
}
