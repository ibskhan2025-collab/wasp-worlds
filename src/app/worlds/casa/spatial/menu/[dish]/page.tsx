import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CasaNav } from "@/components/worlds/casa-realities";
import { CasaSubNav } from "@/components/worlds/casa-views";
import { CASA_VIEW_THEMES } from "@/components/worlds/casa-view-themes";
import { WorldExit } from "@/components/wasp/world-exit";
import { WorldProof } from "@/components/worlds/world-proof";
import { dishes } from "@/data/casa";

export async function generateMetadata({ params }: { params: Promise<{ dish: string }> }): Promise<Metadata> {
  const { dish: id } = await params;
  const dish = dishes.find((d) => d.id === id);
  if (!dish) return { title: "Dish not found — CASA spatial" };
  return { title: `${dish.name} — spatial menu by CASA`, description: dish.desc };
}

export default async function SpatialDishPage({ params }: { params: Promise<{ dish: string }> }) {
  const { dish: id } = await params;
  const t = CASA_VIEW_THEMES.spatial;
  const dish = dishes.find((d) => d.id === id);
  if (!dish) notFound();
  const related = dishes.filter((d) => d.category === dish.category && d.id !== dish.id).slice(0, 3);
  return (
    <div style={{ background: t.bg, color: t.fg, minHeight: "100dvh", fontFamily: t.font }}>
      <WorldExit id="casa" label="Room 01 · SPATIAL/DISH" />
      <CasaNav current="spatial" />
      <CasaSubNav reality="spatial" current="menu" />
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", minHeight: "80dvh" }} className="grid-2">
        <img src={dish.image} alt={dish.name} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 320 }} />
        <div style={{ padding: "40px 28px" }}>
          <Link href="/worlds/casa/spatial/menu" className="kicker" style={{ color: t.muted }}>
            ← Spatial menu
          </Link>
          <h1 style={{ fontSize: "clamp(2.6rem, 6vw, 4.6rem)", fontWeight: 500, margin: "12px 0" }}>
            {dish.name}
          </h1>
          <p style={{ fontSize: "1.2rem" }}>{dish.desc}</p>
          <p style={{ color: t.muted, marginTop: 12 }}>{dish.note}</p>
          <p style={{ fontSize: "2rem", marginTop: 24 }}>{dish.price}</p>
          <Link className="btn" href="/worlds/casa/spatial/reservations" style={{ marginTop: 24, background: t.accent, borderColor: t.accent, color: t.bg }}>
            Book around this
          </Link>
          <div style={{ marginTop: 40 }}>
            <p className="kicker" style={{ color: t.muted }}>Also in this room</p>
            {related.map((r) => (
              <Link key={r.id} href={`/worlds/casa/spatial/menu/${r.id}`} style={{ display: "block", marginTop: 10, color: t.fg }}>
                {r.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <WorldProof proves="The plan is the booking flow: geometry that pre-fills the form." relatedHref="/worlds/nest" relatedName="NEST" />
    </div>
  );
}
