"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadJson, saveJson } from "@/lib/storage";

const PLAN_KEY = "wasp-v11-atlas-plan";

export function AddStop({ slug, name }: { slug: string; name: string }) {
  const [inPlan, setInPlan] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInPlan(loadJson<string[]>(PLAN_KEY, []).includes(slug));
  }, [slug]);
  function toggle() {
    const plan = loadJson<string[]>(PLAN_KEY, []);
    const next = plan.includes(slug) ? plan.filter((x) => x !== slug) : [...plan, slug];
    saveJson(PLAN_KEY, next);
    setInPlan(next.includes(slug));
  }
  return (
    <span style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button type="button" className={inPlan ? "chip-on" : "chip"} aria-pressed={inPlan} onClick={toggle}>
        {inPlan ? `✓ ${name} is in` : `+ Add ${name}`}
      </button>
      {inPlan ? <Link className="ghost" href="/worlds/atlas/itinerary">Review →</Link> : null}
    </span>
  );
}
