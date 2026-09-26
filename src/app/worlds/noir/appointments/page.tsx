import type { Metadata } from "next";
import { AppointmentForm } from "./form";

export const metadata: Metadata = {
  title: "Appointments — NOIR",
  description: "Private fittings, forty-five minutes, one client at a time.",
};

export default function AppointmentsPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 80px", fontFamily: "var(--font-sans)" }}>
      <p className="kicker">By arrangement</p>
      <h1 style={{ fontFamily: "var(--font-lux)", fontSize: "clamp(3rem, 8vw, 5.5rem)", fontWeight: 500, margin: "6px 0" }}>Appointments</h1>
      <p style={{ maxWidth: "42ch", color: "var(--muted)" }}>
        Forty-five minutes, one client, the whole room. Fittings, wardrobe reviews,
        and occasions with a dress code worth respecting.
      </p>
      <AppointmentForm />
    </div>
  );
}
