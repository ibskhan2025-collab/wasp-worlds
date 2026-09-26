import Link from "next/link";
import { media } from "@/lib/media";
import { WorldProof } from "@/components/worlds/world-proof";

export default function NoirHome() {
  return (
    <div>
      <section className="noir-hero">
        <div>
          <h1>NOIR ATELIER</h1>
          <p style={{ fontFamily: "var(--font-sans)", maxWidth: "28ch", padding: "0 24px", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 12 }}>
            Autumn 26. Black as a constraint, not a default.
          </p>
          <div style={{ padding: "24px" }}>
            <Link className="btn ghost" href="/worlds/noir/collection">
              The collection
            </Link>
          </div>
        </div>
        <img src={media.noir.campaign} alt="Editorial portrait in a long black coat." fetchPriority="high" />
      </section>
      <section style={{ padding: "40px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "var(--line)" }} className="grid-3">
        {[
          { src: media.noir.dress, t: "Bias" },
          { src: media.noir.leather, t: "Leather" },
          { src: media.noir.hat, t: "Object" },
        ].map((x) => (
          <Link key={x.t} href="/worlds/noir/collection" style={{ background: "#050505" }}>
            <img src={x.src} alt={`NOIR ${x.t} look`} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", filter: "grayscale(1)" }} />
            <div className="kicker" style={{ padding: 12 }}>{x.t}</div>
          </Link>
        ))}
      </section>
      <WorldProof
        proves="Editorial desire and commercial function are not enemies. NOIR makes the object wanted before the price appears — then still closes with sizes, bag, appointments and validated checkout. That is ecommerce as craft."
        relatedHref="/worlds/objects"
        relatedName="OBJECTS"
      />
    </div>
  );
}
