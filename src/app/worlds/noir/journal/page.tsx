import type { Metadata } from "next";
import Link from "next/link";
import { noirJournal } from "@/data/noir";

export const metadata: Metadata = {
  title: "Journal — NOIR",
  description: "Notes on cut, color and constraint from the NOIR house. A demo fashion world by WASP.",
};

export default function NoirJournal() {
  return (
    <div style={{ padding: "40px 24px 80px", maxWidth: 720 }}>
      <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 500, margin: 0 }}>Journal</h1>
      {noirJournal.map((j) => (
        <Link key={j.slug} href={`/worlds/noir/journal/${j.slug}`} style={{ display: "block", padding: "28px 0", borderBottom: "1px solid var(--line)" }}>
          <div className="kicker">{j.date}</div>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 500, margin: "8px 0" }}>{j.title}</h2>
          <p>{j.dek}</p>
        </Link>
      ))}
    </div>
  );
}
