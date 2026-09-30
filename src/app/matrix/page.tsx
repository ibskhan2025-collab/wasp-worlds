import type { Metadata } from "next";
import Link from "next/link";
import { REALITIES } from "@/lib/realities";
import { WORLDS } from "@/lib/worlds";

export const metadata: Metadata = {
  title: "Matrix — every world, every reality",
  description: "The full addressable index: 15 worlds, all realities, one grid. No dead ends.",
};

export default function MatrixPage() {
  const total = WORLDS.reduce((n, w) => n + (REALITIES[w.id] ?? []).length, 0);
  return (
    <div className="studio-page" style={{ maxWidth: 1000 }}>
      <p className="kicker">Index · {WORLDS.length} worlds · {total} realities</p>
      <h1 className="display">The matrix.</h1>
      <p className="lede">Every addressable room. Starred rows are alternates — same world, new building.</p>
      <div style={{ marginTop: 32 }}>
        {WORLDS.map((w) => (
          <section key={w.id} style={{ padding: "20px 0", borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", margin: 0 }}>
                <Link href={w.href}>{w.name}</Link>
              </h2>
              <span className="kicker">ROOM {w.room} · {w.kind}</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              {(REALITIES[w.id] ?? []).map((r) => (
                <Link
                  key={r.id}
                  className={r.id === "classic" ? "chip-on" : "chip"}
                  href={r.id === "classic" ? w.href : `${w.href}/${r.id}`}
                  title={r.note}
                >
                  {r.id === "classic" ? "★ " : ""}{r.label}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
      <hr className="rule" />
      <p className="kicker">Cross-world</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        <Link className="ghost" href="/night">Night →</Link>
        <Link className="ghost" href="/3d">3D index →</Link>
        <Link className="ghost" href="/analog">Analog index →</Link>
      </div>
    </div>
  );
}
