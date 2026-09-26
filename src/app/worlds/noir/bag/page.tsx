"use client";

import Link from "next/link";
import { useState } from "react";
import { money, useCart } from "@/lib/use-cart";

export default function NoirBag() {
  const { items, setQty, remove, subtotal, clear } = useCart("noir");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState("");

  async function checkout() {
    if (!email.includes("@")) {
      setDone("An email, so the simulation has somewhere to go.");
      return;
    }
    const res = await fetch("/api/orders/noir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, items }),
    });
    if (res.ok) {
      clear();
      setDone("Recorded as a simulation. No charge. No garment will arrive. The flow worked.");
    } else setDone("Could not record the order.");
  }

  return (
    <div style={{ padding: "32px 20px 80px", maxWidth: 720, margin: "0 auto", fontFamily: "var(--font-sans)" }}>
      <h1 style={{ fontFamily: "var(--font-lux)", fontSize: "4rem", fontWeight: 500, margin: 0 }}>Bag</h1>
      {items.length === 0 ? (
        <p style={{ marginTop: 24 }}>
          Empty. <Link href="/worlds/noir/collection">The collection</Link>
        </p>
      ) : (
        items.map((item, i) => (
          <div key={`${item.id}-${i}`} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 12, padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
            <img src={item.image} alt={item.name} loading="lazy" decoding="async" style={{ width: 80, height: 100, objectFit: "cover", filter: "grayscale(1)" }} />
            <div>
              <div>{item.name}</div>
              <div className="kicker">{item.size}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="button" className="ghost" onClick={() => setQty(i, item.qty - 1)} aria-label="Decrease">
                  −
                </button>
                <span>{item.qty}</span>
                <button type="button" className="ghost" onClick={() => setQty(i, item.qty + 1)} aria-label="Increase">
                  +
                </button>
                <button type="button" className="ghost" onClick={() => remove(i)}>
                  Remove
                </button>
              </div>
            </div>
            <div>{money(item.price * item.qty)}</div>
          </div>
        ))
      )}
      {items.length ? (
        <div style={{ marginTop: 24 }}>
          <p>Subtotal {money(subtotal)}</p>
          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </label>
          <button className="btn" type="button" onClick={checkout}>
            Checkout simulation
          </button>
        </div>
      ) : null}
      {done ? <p style={{ marginTop: 16 }}>{done}</p> : null}
    </div>
  );
}
