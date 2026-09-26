import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dishes } from "@/data/casa";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dish = dishes.find((d) => d.id === slug);
  return dish
    ? { title: `${dish.name} — CASA menu`, description: `${dish.desc} A dish from Casa Valle, a demo restaurant by WASP.` }
    : { title: "Dish not found — CASA" };
}

export default async function DishPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dish = dishes.find((d) => d.id === slug);
  if (!dish) notFound();
  const related = dishes.filter((d) => d.category === dish.category && d.id !== dish.id).slice(0, 3);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", minHeight: "80dvh" }} className="grid-2">
      <img src={dish.image} alt={dish.name} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 320 }} />
      <div style={{ padding: "40px 28px" }}>
        <Link href="/worlds/casa/menu" className="kicker">
          ← Menu
        </Link>
        <h1 style={{ fontFamily: "var(--font-lux)", fontSize: "clamp(2.6rem, 6vw, 4.6rem)", fontWeight: 500, margin: "12px 0" }}>
          {dish.name}
        </h1>
        <p style={{ fontSize: "1.2rem" }}>{dish.desc}</p>
        <p style={{ color: "var(--muted)", marginTop: 12 }}>{dish.note}</p>
        <p style={{ fontFamily: "var(--font-lux)", fontSize: "2rem", marginTop: 24 }}>{dish.price}</p>
        <Link className="btn" href="/worlds/casa/reservations" style={{ marginTop: 24 }}>
          Book around this
        </Link>
        <div style={{ marginTop: 40 }}>
          <p className="kicker">Also on the fire</p>
          {related.map((r) => (
            <Link key={r.id} href={`/worlds/casa/menu/${r.id}`} style={{ display: "block", marginTop: 10 }}>
              {r.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
