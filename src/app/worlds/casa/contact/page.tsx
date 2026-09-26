import type { Metadata } from "next";
import { casa } from "@/data/casa";

export const metadata: Metadata = {
  title: "Contact — Casa Valle",
  description: "Find Casa Valle: address, hours and phone. A demo restaurant by WASP.",
};

export default function CasaContact() {
  return (
    <div style={{ padding: "40px 24px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="grid-2">
      <div>
        <p className="kicker">Find us</p>
        <h1 style={{ fontFamily: "var(--font-lux)", fontSize: "clamp(2.8rem, 6vw, 4.6rem)", fontWeight: 500 }}>
          {casa.address}
        </h1>
        <p>{casa.phone}</p>
        <p>{casa.email}</p>
        <p style={{ color: "var(--muted)", marginTop: 12 }}>
          A study location. Do not arrive expecting a host.
        </p>
      </div>
      <div>
        <p className="kicker">Hours</p>
        {casa.hours.map((h) => (
          <div key={h.day} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
            <span>{h.day}</span>
            <span>{h.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
