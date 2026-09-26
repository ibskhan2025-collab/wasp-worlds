import type { Metadata } from "next";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { nestRooms } from "@/data/nest";

export const metadata: Metadata = {
  title: "NEST — Enter through the floorplan",
  description: "A spatial world: the plan is the sitemap. Click a room, see its light, feel its materials.",
};

export default function NestPage() {
  return (
    <div className="obj-root">
      <WorldExit id="nest" label="Room 14 · NEST" />
      <header style={{ padding: "32px 20px 12px" }}>
        <p className="kicker">Room 14 · Architecture / Space</p>
        <h1 style={{ fontSize: "clamp(3rem, 9vw, 7rem)", margin: "4px 0", letterSpacing: "-0.05em" }}>NEST</h1>
        <p style={{ maxWidth: "52ch", fontSize: "1.15rem" }}>The plan is the sitemap. Click a room to enter it.</p>
      </header>
      <div style={{ padding: "8px 20px 24px", maxWidth: 720 }}>
        <svg viewBox="0 0 400 300" width="100%" role="group" aria-label="Floorplan. Select a room.">
          <rect x="0" y="0" width="400" height="300" fill="none" stroke="currentColor" strokeWidth="2" />
          {nestRooms.map((r) => (
            <Link key={r.slug} href={`/worlds/nest/${r.slug}`} aria-label={`Enter ${r.name}`}>
              <g>
                <rect
                  x={r.rect.x} y={r.rect.y} width={r.rect.w} height={r.rect.h}
                  fill="transparent" stroke="currentColor" strokeWidth="1.5"
                  style={{ transition: "fill 200ms" }}
                />
                <text x={r.rect.x + 10} y={r.rect.y + 26} fontSize="13" fill="currentColor">{r.name}</text>
                <text x={r.rect.x + 10} y={r.rect.y + 44} fontSize="10" fill="currentColor" opacity="0.6">{r.size}</text>
              </g>
            </Link>
          ))}
        </svg>
      </div>
      <div style={{ padding: "0 20px 80px", maxWidth: 720 }}>
        {nestRooms.map((r) => (
          <Link key={r.slug} href={`/worlds/nest/${r.slug}`} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)" }}>
            <span><strong>{r.name}</strong><br /><span className="kicker">{r.light}</span></span>
            <span className="kicker">{r.size}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
