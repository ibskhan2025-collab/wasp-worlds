import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Analog index — print realities",
  description: "Every print-inspired reality: letterpress, zines, datasheets, microfiche. Ink on pixels.",
};

const PRINT = [
  { href: "/worlds/casa/analog", name: "CASA/ANALOG", note: "Letterpress menu card" },
  { href: "/worlds/noir/analog", name: "NOIR/ANALOG", note: "Photocopied lookbook" },
  { href: "/worlds/objects/catalogue", name: "OBJECTS/CATALOGUE", note: "1974 mail-order print" },
  { href: "/worlds/archive/typer", name: "ARCHIVE/TYPER", note: "Monospace manuscript" },
  { href: "/worlds/forge/analog", name: "FORGE/ANALOG", note: "Microfiche scan" },
  { href: "/worlds/pulse/flyer", name: "PULSE/FLYER", note: "Wheatpaste gig poster" },
  { href: "/worlds/civic/paperform", name: "CIVIC/PAPERFORM", note: "Carbon-copy counter slip" },
  { href: "/worlds/nest/mockup", name: "NEST/MOCKUP", note: "Cardboard and tape" },
  { href: "/worlds/vector/filing", name: "VECTOR/FILING", note: "Stamped regulatory form" },
];

export default function AnalogPage() {
  return (
    <div style={{ background: "#e5d5b8", color: "#2a2018", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>CROSS-WORLD REALITY · INK ON PIXELS</p>
        <h1 style={{ fontSize: "clamp(3rem, 10vw, 6.5rem)", fontWeight: 400, margin: "8px 0" }}>Analog.</h1>
        <p style={{ fontStyle: "italic", fontSize: "1.15rem", maxWidth: "48ch" }}>
          Nine rooms as physical artifacts: menus, zines, datasheets, forms.
          Dashes, stamps, carbon copies — interfaces that smell faintly of paper.
        </p>
        <div style={{ marginTop: 32, border: "2px solid #2a2018", padding: "8px 20px 20px" }}>
          {PRINT.map((p, i) => (
            <Link key={p.href} href={p.href} style={{ display: "grid", gridTemplateColumns: "48px 1fr auto", gap: 12, padding: "14px 0", borderBottom: i === PRINT.length - 1 ? 0 : "1px dashed #2a201866", alignItems: "baseline" }}>
              <span style={{ fontWeight: 700 }}>№{i + 1}</span>
              <span><strong style={{ fontSize: "1.3rem" }}>{p.name}</strong><br /><span style={{ fontSize: "0.9rem" }}>{p.note}</span></span>
              <span>→</span>
            </Link>
          ))}
        </div>
        <p style={{ marginTop: 24, fontSize: "0.9rem" }}>
          <Link href="/matrix" style={{ textDecoration: "underline" }}>Full matrix →</Link>
          {" · "}
          <Link href="/3d" style={{ textDecoration: "underline" }}>Spatial index →</Link>
        </p>
      </div>
    </div>
  );
}
