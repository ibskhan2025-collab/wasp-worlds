import { media } from "@/lib/media";

export default function CasaAbout() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="grid-2">
        <img src={media.casa.chef} alt="Chef over an open flame." style={{ width: "100%", minHeight: 360, objectFit: "cover" }} />
        <div style={{ padding: "48px 28px" }}>
          <p className="kicker">Story</p>
          <h1 style={{ fontFamily: "var(--font-lux)", fontSize: "clamp(2.8rem, 6vw, 4.8rem)", fontWeight: 500, lineHeight: 0.9 }}>
            We built a fire and waited to see who came.
          </h1>
          <p style={{ fontSize: "1.15rem", maxWidth: "38ch" }}>
            Casa Valle is a study in hospitality websites that behave like hospitality. The room is fictional. The reservation is stored. The point is the same: a restaurant site should get you to a table.
          </p>
        </div>
      </div>
      <section style={{ padding: "48px 28px", maxWidth: 720 }}>
        <h2 style={{ fontFamily: "var(--font-lux)", fontSize: "2.4rem", fontWeight: 500 }}>The house</h2>
        <p>
          Stone floor. Too few seats. A grill that is slightly too close to the first table, on purpose. We cook with oak because it is what we have, and because it makes the room smell like a decision.
        </p>
        <img src={media.casa.fire} alt="Flames in the kitchen." style={{ marginTop: 24, width: "100%" }} />
      </section>
    </div>
  );
}
