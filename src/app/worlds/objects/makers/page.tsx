import type { Metadata } from "next";
import Link from "next/link";
import { media } from "@/lib/media";

export const metadata: Metadata = {
  title: "Makers — OBJECTS",
  description: "The hands behind the vessels. Three studios, one kiln schedule.",
};

const MAKERS = [
  { name: "Berg Objects", place: "Lisbon", note: "Throwing and glazing. The column vase is hers.", img: media.objects.hands },
  { name: "Studio Vale", place: "Porto", note: "Seating in ash and oak. Nothing wobbles.", img: media.objects.studio },
  { name: "Kiln House", place: "Ojai", note: "Fires the valley's work. Salt white is their signature.", img: media.objects.shelves },
];

export default function MakersPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 80px" }}>
      <p className="kicker">The hands</p>
      <h1 style={{ fontSize: "clamp(2.6rem, 7vw, 5rem)", fontWeight: 500, margin: "6px 0" }}>Makers</h1>
      <p style={{ maxWidth: "52ch", fontSize: "1.15rem", color: "var(--muted)" }}>
        Everything in the shop is made by someone with a name and a place.
        This is who, and what of theirs you can own.
      </p>
      {MAKERS.map((m) => (
        <section key={m.name} style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, padding: "28px 0", borderTop: "1px solid var(--line)", marginTop: 28 }} className="grid-2">
          <img src={m.img} alt={m.name} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover" }} />
          <div>
            <p className="kicker">{m.place}</p>
            <h2 style={{ fontSize: "2rem", margin: "6px 0" }}>{m.name}</h2>
            <p>{m.note}</p>
            <Link className="ghost" href="/worlds/objects/shop">Shop the work →</Link>
          </div>
        </section>
      ))}
    </div>
  );
}
