"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { forgeFamilies, forgeProducts } from "@/data/forge";
import { loadJson, saveJson } from "@/lib/storage";

const LIST_KEY = "wasp-v11-forge-list";

export function ForgeBrowser() {
  const [family, setFamily] = useState("All");
  const [q, setQ] = useState("");
  const [minLoad, setMinLoad] = useState(0);
  const [list, setList] = useState<string[]>([]);

  // Hydrate persisted quote list after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setList(loadJson<string[]>(LIST_KEY, []));
  }, []);
  useEffect(() => {
    saveJson(LIST_KEY, list);
  }, [list]);

  const rows = useMemo(
    () =>
      forgeProducts.filter(
        (p) =>
          (family === "All" || p.family === family) &&
          p.load >= minLoad &&
          `${p.name} ${p.desc}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [family, q, minLoad],
  );

  function toggle(slug: string) {
    setList((l) => (l.includes(slug) ? l.filter((x) => x !== slug) : [...l, slug]));
  }

  return (
    <div style={{ padding: "16px 20px 80px" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search parts"
          aria-label="Search parts"
          style={{ flex: 1, minWidth: 160, background: "transparent", border: "1px solid var(--line)", padding: 8 }}
        />
        <label className="kicker" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Min load {minLoad} kN
          <input type="range" min={0} max={60} step={2} value={minLoad} onChange={(e) => setMinLoad(Number(e.target.value))} />
        </label>
        {list.length ? <Link className="btn" href="/worlds/forge/quote">Quote ({list.length}) →</Link> : null}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {forgeFamilies.map((f) => (
          <button key={f} className={family === f ? "chip-on" : "chip"} type="button" onClick={() => setFamily(f)}>{f}</button>
        ))}
      </div>
      <table className="orbit-table">
        <thead><tr><th>Part</th><th>Family</th><th>Load</th><th>Tolerance</th><th>Lead</th><th></th></tr></thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.slug}>
              <td><Link href={`/worlds/forge/${p.slug}`}><strong>{p.name}</strong></Link></td>
              <td>{p.family}</td>
              <td>{p.load} kN</td>
              <td>{p.tolerance}</td>
              <td>{p.lead}</td>
              <td>
                <button type="button" className={list.includes(p.slug) ? "chip-on" : "chip"} aria-pressed={list.includes(p.slug)} onClick={() => toggle(p.slug)}>
                  {list.includes(p.slug) ? "✓" : "+"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 ? <p>Nothing rated for that. Lower the load.</p> : null}
    </div>
  );
}
