import type { Metadata } from "next";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { AtlasBrowser } from "./browser";

export const metadata: Metadata = {
  title: "ATLAS — Destinations you can explore before you arrive",
  description: "A travel world: routes, stops and seasons. Build an itinerary, then request it.",
};

export default function AtlasPage() {
  return (
    <div className="arc-root">
      <WorldExit id="atlas" label="Room 10 · ATLAS" />
      <header style={{ padding: "32px 20px 12px", borderBottom: "1px solid var(--line)" }}>
        <p className="kicker">Room 10 · Travel / Places</p>
        <h1 className="arc-hero-title">ATLAS</h1>
        <p style={{ maxWidth: "52ch", fontSize: "1.15rem" }}>
          A destination should feel explorable before it feels bookable. Pick a route,
          walk its stops, then send the whole itinerary as one request.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "16px 0 8px" }}>
          <Link className="btn" href="/worlds/atlas/itinerary">My itinerary →</Link>
        </div>
      </header>
      <AtlasBrowser />
    </div>
  );
}
