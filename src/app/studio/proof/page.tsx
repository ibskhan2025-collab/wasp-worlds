import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Proof — WASP",
  description: "No invented clients, no invented numbers. Our proof policy, the rooms you can operate, and the frames reserved for real outcomes.",
};

export default function ProofPage() {
  return (
    <div className="studio-page">
      <p className="kicker">Proof</p>
      <h1 className="display">No invented clients. No invented numbers.</h1>
      <p className="lede">
        When real work, real names, and real outcomes exist, they live here. Until then, the proof is the rooms you can operate — and these frames stay visibly reserved rather than quietly faked.
      </p>
      <div className="grid-2" style={{ marginTop: 32 }}>
        <div className="panel">
          <p className="kicker">Testimonials — reserved</p>
          <p>One true sentence from a real client will go here, with their name on it. Not before.</p>
        </div>
        <div className="panel">
          <p className="kicker">Logos — reserved</p>
          <p>Marks of companies that paid for work and agreed to be named. None invented.</p>
        </div>
        <div className="panel">
          <p className="kicker">Outcomes — reserved</p>
          <p>We will not write a conversion rate we did not measure.</p>
        </div>
        <div className="panel">
          <p className="kicker">Before / after — reserved</p>
          <p>Frame reserved for a real homepage that wouldn&apos;t shut up.</p>
        </div>
      </div>
      <hr className="rule" />
      <p className="kicker">Meanwhile, operable proof</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        <Link className="btn" href="/worlds/casa/reservations">Book a fake table →</Link>
        <Link className="btn ghost" href="/worlds/orbit">Open the fake CRM →</Link>
        <Link className="btn ghost" href="/worlds/objects/shop">Buy a fake vase →</Link>
      </div>
    </div>
  );
}
