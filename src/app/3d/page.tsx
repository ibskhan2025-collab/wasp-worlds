import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "3D index — spatial realities",
  description: "Every spatial reality: turntables, walkthroughs, viewers and miniatures. No downloads, no plugins.",
};

const SPATIAL = [
  { href: "/worlds/nest/walk", name: "NEST/WALK", note: "Orbit a room, switch materials" },
  { href: "/worlds/forge/viewer", name: "FORGE/VIEWER", note: "Rotate parts, read dimensions" },
  { href: "/worlds/objects/turntable", name: "OBJECTS/TURNTABLE", note: "Drag the ring, open vessels" },
  { href: "/worlds/atlas/miniature", name: "ATLAS/MINIATURE", note: "Tilt the valley, click pins" },
];

export default function ThreeDPage() {
  return (
    <div style={{ background: "#0b0e10", color: "#e8e4dc", minHeight: "100dvh" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 20px 80px" }}>
        <p style={{ fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.25em", color: "#8a938f" }}>
          CROSS-WORLD REALITY · CSS-3D ONLY · NO LIBRARIES
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 10vw, 7rem)", lineHeight: 0.88, margin: "8px 0", letterSpacing: "-0.05em" }}>
          SPATIAL
        </h1>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", maxWidth: "52ch", color: "#a9b8b4" }}>
          Four rooms you can turn over in your hands. Pure CSS 3D — perspective,
          preserve-3d and pointer math. No engine, no download, 60fps, and every
          one templated for touch and reduced motion.
        </p>
        <div style={{ marginTop: 32 }}>
          {SPATIAL.map((s, i) => (
            <Link key={s.href} href={s.href} style={{ display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 16, padding: "20px 0", borderTop: "1px solid rgba(232,228,220,0.16)", alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-code)", fontSize: 12, color: "#8a938f" }}>3D.0{i + 1}</span>
              <span>
                <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem" }}>{s.name}</strong>
                <span style={{ color: "#8a938f", display: "block", fontSize: "0.95rem" }}>{s.note}</span>
              </span>
              <span style={{ fontFamily: "var(--font-code)" }}>→</span>
            </Link>
          ))}
        </div>
        <p style={{ marginTop: 24 }}>
          <Link href="/matrix" style={{ borderBottom: "1px solid currentColor" }}>Full matrix →</Link>
          {" · "}
          <Link href="/night" style={{ borderBottom: "1px solid currentColor" }}>Night →</Link>
        </p>
      </div>
    </div>
  );
}
