import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { media } from "@/lib/media";
import { Finder } from "./finder";
import { ReportForm } from "./report-form";

export const metadata: Metadata = {
  title: "CIVIC — Important information, made understandable",
  description: "A speculative public-service world by WASP: ask a question, get a pathway. All policies fictional.",
};

export default function CivicPage() {
  return (
    <div className="still-root">
      <WorldExit id="civic" label="Room 13 · CIVIC" />
      <header style={{ padding: "32px 20px 12px", borderBottom: "1px solid var(--line)" }}>
        <p className="kicker">Room 13 · Institutions / Public</p>
        <h1 style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)", margin: "4px 0", letterSpacing: "-0.05em" }}>CIVIC</h1>
        <p style={{ maxWidth: "52ch", fontSize: "1.15rem" }}>Don&apos;t browse departments. Ask your question — the site finds the pathway.</p>
        <p className="kicker" style={{ marginTop: 12, border: "1px solid var(--line)", padding: "10px 12px", maxWidth: "64ch" }}>
          Speculative civic-service interface. All names, policies, dates, fees and service details are fictional, created for the WASP exhibition.
        </p>
      </header>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, padding: "20px 20px 0" }}>
        {[
          { src: media.still.street, alt: "The street the service is for" },
          { src: media.still.city, alt: "Service area at dusk" },
          { src: media.still.tower, alt: "The office, from below" },
        ].map((img) => (
          <img key={img.src} src={img.src} alt={img.alt} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", filter: "grayscale(0.5)" }} />
        ))}
      </div>
      <Finder />
      <ReportForm />
    </div>
  );
}
