import Link from "next/link";
import { casa } from "@/data/casa";
import { media } from "@/lib/media";
import { WorldProof } from "@/components/worlds/world-proof";

export default function CasaHome() {
  return (
    <div>
      <section className="casa-hero">
        <div>
          <p className="kicker" style={{ color: "#d7cfc4" }}>
            {casa.city} · Dinner from 17:30
          </p>
          <h1>A house in the valley.</h1>
          <p>Fire, stone, whatever the canyon gave us this morning.</p>
          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <Link className="btn" href="/worlds/casa/reservations">
              Reserve a table
            </Link>
            <Link className="btn ghost" href="/worlds/casa/menu">
              Read the menu
            </Link>
          </div>
        </div>
      </section>

      <section className="grid-2" style={{ gap: 0 }}>
        <img src={media.casa.dish1} alt="Seafood plated on black ceramic." fetchPriority="high" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 360 }} />
        <div style={{ padding: "48px 32px" }}>
          <p className="kicker">Tonight</p>
          <h2 style={{ fontFamily: "var(--font-lux)", fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 500, margin: "8px 0 16px", lineHeight: 0.95 }}>
            The kitchen decides. You sit.
          </h2>
          <p style={{ maxWidth: "36ch", fontSize: "1.15rem" }}>
            Casa Valle is a small room with a large fire. We cook what arrives from the valley and the coast. If you need a tasting menu with a manifesto, this is not your house.
          </p>
          <Link href="/worlds/casa/about" style={{ display: "inline-block", marginTop: 24, letterSpacing: "0.18em", fontSize: 12, textTransform: "uppercase" }}>
            The story →
          </Link>
        </div>
      </section>

      <section className="grid-3" style={{ padding: "48px 24px" }}>
        {[
          { t: "Menu", d: "Fire, garden, sea, sweet.", h: "/worlds/casa/menu" },
          { t: "Table", d: "A night, a time, a number of bodies.", h: "/worlds/casa/reservations" },
          { t: "Room", d: "Wine glasses waiting in the dark.", h: "/worlds/casa/gallery" },
        ].map((c) => (
          <Link key={c.t} href={c.h} className="panel" style={{ minHeight: 180 }}>
            <div className="kicker">Enter</div>
            <h3 style={{ fontFamily: "var(--font-lux)", fontSize: "2.2rem", margin: "8px 0", fontWeight: 500 }}>{c.t}</h3>
            <p>{c.d}</p>
          </Link>
        ))}
      </section>
      <WorldProof
        proves="A hospitality site doesn't choose between atmosphere and utility. The reservation journey can be part of the evening, not a mechanical step before it — and that thinking ports directly to any business that takes bookings."
        relatedHref="/worlds/noir"
        relatedName="NOIR"
      />
    </div>
  );
}
