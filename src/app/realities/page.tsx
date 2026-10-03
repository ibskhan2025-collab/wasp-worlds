import type { Metadata } from "next";
import Link from "next/link";
import { REALITIES } from "@/lib/realities";
import { WORLDS } from "@/lib/worlds";

export const metadata: Metadata = {
  title: "Realities — one thing, many ways to experience it",
  description: "Every world re-authored: same data, different building. 93 realities and what each one is.",
};

const WEBGL = new Set(["nest/volume"]);
const SPATIAL = new Set(["nest/walk", "forge/viewer", "objects/turntable", "atlas/miniature"]);

export default function RealitiesPage() {
  const total = Object.values(REALITIES).flat().length;
  return (
    <div className="studio-page" style={{ maxWidth: 1080 }}>
      <p className="kicker">Realities · {total} ways in</p>
      <h1 className="display">One thing. Many ways to experience it.</h1>
      <p className="lede">
        A reality is a different creative direction for the same world — layout, typography, navigation,
        density, sometimes a whole dimension. Never a theme switch. Same content, same data, different building.
      </p>
      <div style={{ marginTop: 32 }}>
        {WORLDS.map((w) => (
          <section key={w.id} style={{ padding: "28px 0", borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.9rem", margin: 0 }}>
                <span className="kicker" style={{ marginRight: 12 }}>ROOM {w.room}</span>
                <Link href={w.href} style={{ textDecoration: "underline" }}>{w.name}</Link>
              </h2>
              <span className="kicker">{w.kind} · {(REALITIES[w.id] ?? []).length} realities</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 1, background: "var(--line)", border: "1px solid var(--line)", marginTop: 16 }}>
              {(REALITIES[w.id] ?? []).map((r) => {
                const key = `${w.id}/${r.id}`;
                const href = r.id === "classic" ? w.href : `${w.href}/${r.id}`;
                return (
                  <Link key={r.id} href={href} style={{ background: "var(--bg)", padding: 18, display: "block" }}>
                    <p style={{ margin: 0, display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                      <strong style={{ fontSize: "1.15rem" }}>{r.label}</strong>
                      {WEBGL.has(key) ? <span className="kicker">WEBGL</span> : null}
                      {SPATIAL.has(key) ? <span className="kicker">SPATIAL</span> : null}
                    </p>
                    <p style={{ color: "var(--muted)", fontSize: "0.92rem", margin: "8px 0 0" }}>{r.note}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 32 }}>
        <Link className="btn" href="/matrix">Matrix view →</Link>
        <Link className="btn ghost" href="/start">Start a project</Link>
      </div>
    </div>
  );
}
