import Link from "next/link";
import { destinations } from "@/data/atlas";

const REGION_COLOR: Record<string, string> = { Coast: "#2e6bd8", Hills: "#7a8b6f", Town: "#c98a3d" };

export function AtlasMap() {
  return (
    <section style={{ padding: "8px 20px 8px" }} aria-label="Route map">
      <p className="kicker">The valley, schematically</p>
      <svg viewBox="0 0 400 300" width="100%" role="group" aria-label="Map of routes. Select a route." style={{ maxWidth: 720, border: "1px solid var(--line)", background: "radial-gradient(circle at 70% 30%, #242018, transparent 60%)" }}>
        <path d="M0,240 Q120,200 180,250 T400,230" fill="none" stroke="#2e6bd8" strokeWidth="1.5" strokeDasharray="6 5" opacity="0.6" />
        <path d="M240,0 Q280,90 330,140 T360,300" fill="none" stroke="#7a8b6f" strokeWidth="1.5" strokeDasharray="6 5" opacity="0.6" />
        {destinations.map((d) => (
          <Link key={d.slug} href={`/worlds/atlas/${d.slug}`} aria-label={`${d.name}: ${d.region}, ${d.season}`}>
            <g>
              <circle cx={d.map.x} cy={d.map.y} r="9" fill={REGION_COLOR[d.region]} />
              <circle cx={d.map.x} cy={d.map.y} r="14" fill="none" stroke={REGION_COLOR[d.region]} strokeWidth="1" opacity="0.5" />
              <text x={d.map.x + 18} y={d.map.y + 4} fontSize="12" fill="currentColor">{d.name}</text>
            </g>
          </Link>
        ))}
      </svg>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 8 }}>
        {Object.entries(REGION_COLOR).map(([r, c]) => (
          <span key={r} className="kicker"><span aria-hidden style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: c, marginRight: 6 }} />{r}</span>
        ))}
      </div>
    </section>
  );
}
