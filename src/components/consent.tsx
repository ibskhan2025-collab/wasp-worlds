import Link from "next/link";

/** One-line consent microcopy for every form that stores data. */
export function Consent() {
  return (
    <p className="kicker" style={{ marginTop: 12 }}>
      Sending stores what you typed — see the{" "}
      <Link href="/privacy" style={{ borderBottom: "1px solid currentColor" }}>privacy policy</Link>.
    </p>
  );
}
