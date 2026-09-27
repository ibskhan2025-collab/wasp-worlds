"use client";

/**
 * Honeypot trap: invisible to humans (off-screen, aria-hidden, no tab stop),
 * irresistible to bots that fill every field. Uncontrolled on purpose —
 * read it at submit time with hpValue() so forms need no extra state.
 */
export function Honeypot() {
  return (
    <input
      type="text"
      name="hp_website"
      autoComplete="off"
      tabIndex={-1}
      aria-hidden="true"
      defaultValue=""
      style={{ position: "absolute", left: "-9999px", height: 1, width: 1, opacity: 0 }}
    />
  );
}

export function hpValue(): string {
  if (typeof document === "undefined") return "";
  const el = document.querySelector('input[name="hp_website"]') as HTMLInputElement | null;
  return el?.value ?? "";
}
