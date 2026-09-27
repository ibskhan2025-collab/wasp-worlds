import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/studio";

export const metadata: Metadata = {
  title: "Services — outcome-first, no packages",
  description: "WASP services framed by outcomes, with an honest pricing philosophy. No $999 packages.",
};

const DETAIL: Record<string, { when: string; different: string; worlds: { href: string; name: string }[] }> = {
  "web-design": { when: "Your site works but says nothing — or says the wrong thing loudly.", different: "Designed by the people who will build it, so nothing precious survives contact with reality.", worlds: [{ href: "/worlds/still", name: "STILL" }, { href: "/worlds/archive", name: "ARCHIVE" }] },
  "web-dev": { when: "You have designs, a deadline, and a fear of the phrase 'minor CMS limitations'.", different: "Production code from day one — forms that go somewhere, performance budgeted like money.", worlds: [{ href: "/worlds/orbit", name: "ORBIT" }, { href: "/worlds/atlas", name: "ATLAS" }] },
  brand: { when: "The logo is fine. Everything it touches is not.", different: "Identity designed through the website, not delivered as a PDF the website then ignores.", worlds: [{ href: "/worlds/noir", name: "NOIR" }, { href: "/worlds/motion", name: "MOTION" }] },
  ecom: { when: "Traffic arrives, money doesn't. Or everything works except desire.", different: "Editorial merchandising first, checkout paranoia second — desire and conversion designed together.", worlds: [{ href: "/worlds/noir", name: "NOIR" }, { href: "/worlds/objects", name: "OBJECTS" }] },
  interactive: { when: "A launch, a campaign, or an idea that needs doing, not describing.", different: "Built as software with a point of view — games, tools and scroll choreography that all actually run.", worlds: [{ href: "/worlds/signal", name: "SIGNAL" }, { href: "/worlds/motion", name: "MOTION" }] },
  product: { when: "Your software works but nobody enjoys operating it.", different: "Product thinking from people who run their own studio as software — states, settings and empty states included.", worlds: [{ href: "/worlds/orbit", name: "ORBIT" }, { href: "/worlds/forge", name: "FORGE" }] },
  redesign: { when: "The current site is load-bearing but ugly, or pretty but useless.", different: "Audit first, ego last: keep what converts, kill theatre, migrate without the lights going out.", worlds: [{ href: "/worlds/casa", name: "CASA" }, { href: "/worlds/vector", name: "VECTOR" }] },
  "creative-tech": { when: "The brief contains the words 'impossible', 'never been done', or 'what if'.", different: "Experiments with error handling — weird on the surface, engineered underneath.", worlds: [{ href: "/worlds/void", name: "VOID" }, { href: "/worlds/nest", name: "NEST" }] },
};

export default function ServicesPage() {
  return (
    <div className="studio-page">
      <p className="kicker">Services</p>
      <h1 className="display">You don&apos;t buy hours. You buy a better room on the internet.</h1>
      <p className="lede">Outcome first. Tools second. We will not list a stack to look busy.</p>
      <div style={{ marginTop: 32 }}>
        {services.map((s) => {
          const d = DETAIL[s.id];
          return (
            <details key={s.id} style={{ padding: "20px 0", borderTop: "1px solid var(--line)" }}>
              <summary style={{ cursor: "pointer", listStyle: "none", display: "flex", gap: 16, alignItems: "baseline", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>{s.name}</span>
                <span className="kicker">{s.outcome}</span>
              </summary>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", marginTop: 12 }}>{s.outcome}</p>
              <div className="grid-2" style={{ marginTop: 8 }}>
                <div>
                  <p className="kicker">When it&apos;s useful</p>
                  <p>{d?.when}</p>
                  <p className="kicker" style={{ marginTop: 12 }}>What you receive</p>
                  <ul>
                    {s.get.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="kicker">What makes it different</p>
                  <p>{d?.different}</p>
                  <p className="kicker" style={{ marginTop: 12 }}>See it working</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {d?.worlds.map((w) => (
                      <Link key={w.href} className="ghost" href={w.href}>{w.name} →</Link>
                    ))}
                    <Link className="ghost" href="/start">Scope this →</Link>
                  </div>
                </div>
              </div>
            </details>
          );
        })}
      </div>
      <section style={{ marginTop: 24 }} className="panel">
        <p className="kicker">Pricing philosophy</p>
        <h2>The budget determines the depth. Not the margin theatre.</h2>
        <p>
          We do not sell $999 / $2,499 / $4,999 packages. A smaller budget means a sharper scope: fewer pages, less custom motion, fewer integrations. A larger budget means more rooms, more iteration, more of the thing only a human would bother to make.
        </p>
        <p>We will shape the smartest project possible around what you actually have — or decline if the math is unkind to both of us.</p>
      </section>
      <section style={{ marginTop: 32 }}>
        <p className="kicker">Depth, visualized</p>
        <div className="grid-3" style={{ marginTop: 12 }}>
          {[
            { label: "Focused", range: "Smaller budget", depth: 32, points: ["Core pages done properly", "Sensible defaults over custom systems", "Essential interaction only", "Clear handover docs"] },
            { label: "Complete", range: "Mid budget", depth: 68, points: ["Full information architecture", "Custom design system", "Considered motion + interaction", "CMS modelling if needed", "Accessibility + performance passes"] },
            { label: "Transformative", range: "Larger budget", depth: 100, points: ["Research and strategy phase", "Custom interactive or generative work", "Multi-surface systems", "Prototyping and testing", "Ongoing iteration"] },
          ].map((t) => (
            <div key={t.label} className="panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem" }}>{t.label}</strong>
                <span className="kicker">{t.range}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                <span className="kicker">Depth of scope</span>
                <span className="kicker">{t.depth}%</span>
              </div>
              <div style={{ height: 6, background: "var(--line)", marginTop: 6 }}>
                <div style={{ height: "100%", width: `${t.depth}%`, background: "var(--fg)" }} />
              </div>
              <ul style={{ marginTop: 16 }}>
                {t.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
          <Link className="btn" href="/tools/cost">Open cost estimator →</Link>
          <Link className="btn ghost" href="/tools/scope">Build a scope →</Link>
        </div>
      </section>
    </div>
  );
}
