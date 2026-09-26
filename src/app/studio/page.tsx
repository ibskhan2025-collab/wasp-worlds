import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies, services } from "@/data/studio";

export const metadata: Metadata = {
  title: "Studio — WASP builds the thing",
  description: "Process, services, proof. Independent, premium when needed, weird when it should be.",
};

export default function StudioPage() {
  return (
    <div className="studio-page">
      <p className="kicker">Studio</p>
      <h1 className="display">WASP is a studio that builds the thing, not a picture of the thing.</h1>
      <p className="lede">Independent. Premium when the work needs to be. Weird when it should be. Organized either way.</p>
      <div className="grid-3" style={{ marginTop: 40 }}>
        {[
          { h: "/studio/work", t: "Work", d: "Nine rooms. Enter them." },
          { h: "/studio/services", t: "Services", d: "What you actually get." },
          { h: "/process", t: "Process", d: "Sixteen steps. No fog." },
          { h: "/studio/about", t: "About", d: "A small studio with a large loop." },
          { h: "/studio/proof", t: "Proof", d: "No invented clients." },
          { h: "/lab", t: "Lab", d: "Change a decision. Watch the room change." },
          { h: "/tools", t: "Tools", d: "Useful before you hire us." },
          { h: "/os", t: "OS", d: "The studio as software." },
          { h: "/start", t: "Start", d: "Tell us what to make." },
        ].map((x) => (
          <Link key={x.h} href={x.h} className="panel">
            <div className="kicker">Open</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", margin: "8px 0" }}>{x.t}</h2>
            <p>{x.d}</p>
          </Link>
        ))}
      </div>
      <hr className="rule" />
      <p className="kicker">Self-initiated studies</p>
      <div className="grid-2">
        {caseStudies.map((c) => (
          <Link key={c.slug} href={`/studio/case/${c.slug}`} className="panel">
            <div className="kicker">{c.world}</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>{c.title}</h3>
            <p>{c.problem}</p>
          </Link>
        ))}
      </div>
      <hr className="rule" />
      <p className="kicker">Services, short</p>
      <div className="grid-2">
        {services.slice(0, 4).map((s) => (
          <div key={s.id}>
            <h3>{s.name}</h3>
            <p>{s.outcome}</p>
          </div>
        ))}
      </div>
      <Link className="btn" href="/studio/services" style={{ marginTop: 24 }}>
        All services
      </Link>
    </div>
  );
}
