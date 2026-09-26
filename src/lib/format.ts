// Server-safe formatting helpers (no "use client" — importable anywhere).
export function money(n: number) {
  if (!Number.isFinite(n)) return "$0";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);
}
