import type { Metadata } from "next";
import Link from "next/link";
import { REALITIES } from "@/lib/realities";
import { WORLDS } from "@/lib/worlds";

export const metadata: Metadata = {
  title: "Work — 15 rooms you can operate",
  description: "Every WASP case study is a working demo, not a screenshot. Enter the rooms.",
};

const OPERATE: Record<string, [string, string]> = {
  casa: ["Book a table", "/worlds/casa/reservations"],
  noir: ["Fill a bag", "/worlds/noir/collection"],
  orbit: ["Run the quarter", "/worlds/orbit"],
  still: ["Take a print home", "/worlds/still/prints"],
  signal: ["Lose a game", "/worlds/signal"],
  objects: ["Buy a vase", "/worlds/objects/shop"],
  archive: ["Read an essay", "/worlds/archive"],
  motion: ["Commission motion", "/worlds/motion/commissions"],
  void: ["Read the notes", "/worlds/void/notes"],
  atlas: ["Plan a route", "/worlds/atlas/itinerary"],
  forge: ["Compare two parts", "/worlds/forge/compare"],
  pulse: ["Check the setlist", "/worlds/pulse/setlist"],
  civic: ["Ask the desk", "/worlds/civic"],
  nest: ["Walk the room", "/worlds/nest/walk"],
  vector: ["Read the letter", "/worlds/vector/letter"],
};

export default function WorkPage() {
  return (
    <div className="studio-page">
      <p className="kicker">Work</p>
      <h1 className="display">Don&apos;t look at examples. Use them.</h1>
      <p className="lede">Each world is a complete interior. If it has a cart, the cart adds. If it has a game, you can lose. The verb under each room is a thing you can actually do.</p>
      <div style={{ marginTop: 32 }}>
        {WORLDS.map((w) => {
          const count = (REALITIES[w.id] ?? []).length;
          const [verb, href] = OPERATE[w.id] ?? ["Enter", w.href];
          return (
            <div key={w.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 16, padding: "18px 0", borderTop: "1px solid var(--line)", alignItems: "baseline" }}>
              <span className="kicker">ROOM {w.room}</span>
              <span>
                <Link href={w.href} style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700 }}>{w.name}</Link>
                <div style={{ color: "var(--muted)" }}>{w.line}</div>
                <div style={{ marginTop: 6 }}>
                  <Link href={href} style={{ textDecoration: "underline", fontSize: "0.95rem" }}>{verb} →</Link>
                  <span className="kicker" style={{ marginLeft: 12 }}>{count} realities</span>
                </div>
              </span>
              <span className="kicker">{w.kind}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
