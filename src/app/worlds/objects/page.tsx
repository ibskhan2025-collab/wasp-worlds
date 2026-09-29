import Link from "next/link";
import { media } from "@/lib/media";
import { WorldProof } from "@/components/worlds/world-proof";

export default function ObjectsHome() {
  return (
    <div>
      <section style={{ padding: "8vh 20px 40px" }}>
        <p className="kicker">A shop for things that take time</p>
        <h1 style={{ fontSize: "clamp(3.4rem, 10vw, 7.5rem)", lineHeight: 0.88, letterSpacing: "-0.05em", margin: 0, fontWeight: 500 }}>
          Made slowly. Sold honestly.
        </h1>
        <Link className="btn" href="/worlds/objects/shop" style={{ marginTop: 28, background: "#2c4a3e", borderColor: "#2c4a3e", color: "#efeae2" }}>
          Enter the shop
        </Link>
      </section>
      <img src={media.objects.vases} alt="White ceramic vessels on a shelf." fetchPriority="high" style={{ width: "100%", maxHeight: 520, objectFit: "cover" }} />
      <section style={{ padding: "40px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="grid-2">
        <p style={{ fontSize: "1.3rem" }}>
          OBJECTS is a working storefront: filter, search, options, cart, totals, checkout simulation. The ceramics are photographed. The till adds up.
        </p>
        <p style={{ color: "var(--muted)" }}>
          Not a theme. Not a screenshot of Shopify. A place to pick something up.
        </p>
      </section>
      <WorldProof
        proves="Discovery, desire, cart, checkout. Four verbs, each designed, each working. That's the whole store."
        relatedHref="/worlds/noir"
        relatedName="NOIR"
      />
    </div>
  );
}
