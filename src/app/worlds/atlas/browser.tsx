"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { atlasRegions, atlasSeasons, destinations } from "@/data/atlas";
import { loadJson, saveJson } from "@/lib/storage";
import { money } from "@/lib/use-cart";

const PLAN_KEY = "wasp-v11-atlas-plan";

export function AtlasBrowser() {
  const [region, setRegion] = useState("All");
  const [season, setSeason] = useState("All");
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState<string[]>([]);

  // Hydrate persisted plan after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlan(loadJson<string[]>(PLAN_KEY, []));
  }, []);
  useEffect(() => {
    saveJson(PLAN_KEY, plan);
  }, [plan]);

  const list = useMemo(
    () =>
      destinations.filter(
        (d) =>
          (region === "All" || d.region === region) &&
          (season === "All" || d.season === season) &&
          `${d.name} ${d.blurb}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [region, season, q],
  );

  function toggle(slug: string) {
    setPlan((p) => (p.includes(slug) ? p.filter((x) => x !== slug) : [...p, slug]));
  }

  return (
    <div style={{ padding: "16px 20px 80px" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search routes"
          aria-label="Search destinations"
          style={{ flex: 1, minWidth: 160, background: "transparent", border: "1px solid var(--line)", padding: 8 }}
        />
        {plan.length ? <Link className="btn" href="/worlds/atlas/itinerary">Itinerary ({plan.length}) →</Link> : null}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        {atlasRegions.map((r) => (
          <button key={r} className={region === r ? "chip-on" : "chip"} type="button" onClick={() => setRegion(r)}>{r}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {atlasSeasons.map((s) => (
          <button key={s} className={season === s ? "chip-on" : "chip"} type="button" onClick={() => setSeason(s)}>{s}</button>
        ))}
      </div>
      <div style={{ display: "grid", gap: 0 }}>
        {list.map((d) => (
          <article key={d.slug} style={{ display: "grid", gridTemplateColumns: "minmax(200px, 320px) 1fr", gap: 20, padding: "20px 0", borderTop: "1px solid var(--line)" }} className="grid-2">
            <Link href={`/worlds/atlas/${d.slug}`}>
              <img src={d.image} alt={d.name} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
            </Link>
            <div>
              <p className="kicker">{d.region} · {d.season} · ★ {d.rating}</p>
              <Link href={`/worlds/atlas/${d.slug}`}><h2 style={{ margin: "6px 0", fontSize: "1.9rem" }}>{d.name}</h2></Link>
              <p style={{ color: "var(--muted)" }}>{d.blurb}</p>
              <p>{d.days} days · {money(d.price)}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Link className="ghost" href={`/worlds/atlas/${d.slug}`}>Walk the stops</Link>
                <button
                  type="button"
                  className={plan.includes(d.slug) ? "chip-on" : "chip"}
                  aria-pressed={plan.includes(d.slug)}
                  onClick={() => toggle(d.slug)}
                >
                  {plan.includes(d.slug) ? "✓ In itinerary" : "+ Itinerary"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {list.length === 0 ? <p>No routes match. Try another season.</p> : null}
    </div>
  );
}
