import type { Metadata } from "next";
import Link from "next/link";
import { RealityShell } from "@/components/worlds/reality-shell";
import { dishes } from "@/data/casa";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Tide menu — CASA oceanic",
  description: "The Casa Valle menu ordered by depth: sea first, land after. A menu reality by WASP.",
};

const ZONES: { zone: string; cats: string[] }[] = [
  { zone: "0–2m · shallows", cats: ["Sea"] },
  { zone: "Above water", cats: ["Garden", "Fire", "Sweet", "Wine"] },
];

export default function TideMenuPage() {
  return (
    <div style={{ padding: "28px 22px 80px", maxWidth: 920, margin: "0 auto" }}>
      <RealityShell
        world="casa"
        current="oceanic"
        basePath="/worlds/casa/menu"
        options={[
          { id: "classic", label: "Menu", note: "The printed list", href: "/worlds/casa/menu" },
          { id: "oceanic", label: "Tide", note: "Ordered by depth", href: "/worlds/casa/menu/oceanic" },
        ]}
      />
      <p className="kicker" style={{ marginTop: 16 }}>Ordered by depth, not course</p>
      <h1 style={{ fontFamily: "var(--font-lux)", fontSize: "clamp(3rem, 8vw, 5.5rem)", fontWeight: 500, margin: "6px 0 24px" }}>
        Tide menu
      </h1>
      {ZONES.map((z) => (
        <section key={z.zone} style={{ marginBottom: 28 }}>
          <p className="kicker">{z.zone}</p>
          {dishes.filter((d) => z.cats.includes(d.category)).map((dish) => (
            <Link key={dish.id} href={`/worlds/casa/menu/${dish.id}`} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
              <span>
                <strong style={{ fontFamily: "var(--font-lux)", fontSize: "1.4rem", fontWeight: 500 }}>{dish.name}</strong>
                <span style={{ color: "var(--muted)", display: "block", fontSize: "0.95rem" }}>{dish.desc}</span>
              </span>
              <span style={{ fontFamily: "var(--font-lux)", fontSize: "1.3rem" }}>{money(dish.price)}</span>
            </Link>
          ))}
        </section>
      ))}
      <p><Link href="/worlds/casa/menu" style={{ borderBottom: "1px solid currentColor" }}>Back to the printed menu →</Link></p>
    </div>
  );
}
