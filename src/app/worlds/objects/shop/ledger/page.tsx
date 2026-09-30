"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RealityShell } from "@/components/worlds/reality-shell";
import { objectProducts } from "@/data/objects";
import { money } from "@/lib/use-cart";

export default function ShopLedgerPage() {
  const [q, setQ] = useState("");
  const rows = useMemo(
    () => objectProducts.filter((p) => `${p.name} ${p.category} ${p.option}`.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  return (
    <div style={{ padding: "12px 20px 80px" }}>
      <RealityShell
        world="objects"
        current="ledger"
        basePath="/worlds/objects/shop"
        options={[
          { id: "classic", label: "Grid", note: "Editorial cards", href: "/worlds/objects/shop" },
          { id: "ledger", label: "Ledger", note: "Everything on one page" },
        ]}
      />
      <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap", margin: "16px 0" }}>
        <h1 style={{ fontSize: "2.4rem", margin: 0, fontWeight: 500 }}>Stock ledger</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter stock"
          aria-label="Filter stock"
          style={{ background: "transparent", border: "1px solid var(--line)", padding: 8, minWidth: 160 }}
        />
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", fontSize: 11, letterSpacing: "0.16em" }}>
            <th style={{ padding: "8px 4px", borderBottom: "2px solid var(--fg)" }}>PIECE</th>
            <th style={{ borderBottom: "2px solid var(--fg)" }}>CAT</th>
            <th style={{ borderBottom: "2px solid var(--fg)" }}>OPTION</th>
            <th style={{ borderBottom: "2px solid var(--fg)", textAlign: "right" }}>PRICE</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid var(--line)" }}>
              <td style={{ padding: "10px 4px" }}><Link href={`/worlds/objects/product/${p.id}`} style={{ textDecoration: "underline" }}>{p.name}</Link></td>
              <td>{p.category}</td>
              <td style={{ color: "var(--muted)" }}>{p.option}</td>
              <td style={{ textAlign: "right" }}>{money(p.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 ? <p>Nothing in stock matches that.</p> : null}
    </div>
  );
}
