"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { civicServices, findService } from "@/data/civic";

export function Finder() {
  const [q, setQ] = useState("");
  const results = useMemo(() => findService(q), [q]);
  return (
    <section style={{ padding: "24px 20px" }} aria-label="Find a service">
      <label className="field" style={{ maxWidth: 640 }}>
        <span>What do you need to do?</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. my bin was missed, parking near my flat…"
          aria-label="Describe what you need"
          style={{ fontSize: 18, padding: "14px 16px" }}
        />
      </label>
      {q.trim().length > 2 ? (
        results.length ? (
          <div style={{ maxWidth: 640 }}>
            {results.map((s) => (
              <Link key={s.slug} href={`/worlds/civic/${s.slug}`} style={{ display: "block", padding: "16px 0", borderTop: "1px solid var(--line)" }}>
                <strong style={{ fontSize: "1.25rem" }}>{s.title}</strong>
                <div style={{ color: "var(--muted)" }}>{s.intro}</div>
                <span className="kicker">{s.dept}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p>No pathway matches that yet. Try fewer words — “bin”, “park”, “repair”, “school”.</p>
        )
      ) : (
        <div style={{ maxWidth: 640 }}>
          <p className="kicker">Or start here</p>
          {civicServices.map((s) => (
            <Link key={s.slug} href={`/worlds/civic/${s.slug}`} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--line)" }}>
              <span>{s.title}</span>
              <span className="kicker">{s.dept}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
