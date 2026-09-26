import type { Metadata } from "next";
import Link from "next/link";
import { WORLDS } from "@/lib/worlds";

export const metadata: Metadata = {
  title: "Work — 15 rooms you can operate",
  description: "Every WASP case study is a working demo, not a screenshot. Enter the rooms.",
};

export default function WorkPage() {
  return (
    <div className="studio-page">
      <p className="kicker">Work</p>
      <h1 className="display">Don&apos;t look at examples. Use them.</h1>
      <p className="lede">Each world is a complete interior. If it has a cart, the cart adds. If it has a game, you can lose.</p>
      <div style={{ marginTop: 32 }}>
        {WORLDS.map((w) => (
          <Link key={w.id} href={w.href} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 16, padding: "18px 0", borderTop: "1px solid var(--line)", alignItems: "baseline" }}>
            <span className="kicker">ROOM {w.room}</span>
            <span>
              <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>{w.name}</strong>
              <div style={{ color: "var(--muted)" }}>{w.line}</div>
            </span>
            <span className="kicker">{w.kind}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
