import { services } from "@/data/studio";

export default function ServicesPage() {
  return (
    <div className="studio-page">
      <p className="kicker">Services</p>
      <h1 className="display">You don&apos;t buy hours. You buy a better room on the internet.</h1>
      <p className="lede">Outcome first. Tools second. We will not list a stack to look busy.</p>
      <div style={{ marginTop: 32 }}>
        {services.map((s) => (
          <section key={s.id} style={{ padding: "28px 0", borderTop: "1px solid var(--line)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", margin: 0 }}>{s.name}</h2>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem" }}>{s.outcome}</p>
            <ul>
              {s.get.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section style={{ marginTop: 24 }} className="panel">
        <p className="kicker">Pricing philosophy</p>
        <h2>The budget determines the depth. Not the margin theatre.</h2>
        <p>
          We do not sell $999 / $2,499 / $4,999 packages. A smaller budget means a sharper scope: fewer pages, less custom motion, fewer integrations. A larger budget means more rooms, more iteration, more of the thing only a human would bother to make.
        </p>
        <p>We will shape the smartest project possible around what you actually have — or decline if the math is unkind to both of us.</p>
      </section>
    </div>
  );
}
