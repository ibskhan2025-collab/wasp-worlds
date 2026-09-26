"use client";

import { FormEvent, useState } from "react";
import { money, useCart } from "@/lib/use-cart";

export default function ObjectsCheckout() {
  const { items, subtotal, clear } = useCart("objects");
  const [done, setDone] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (!data.name || !String(data.email).includes("@")) {
      setDone("Name and a real-looking email.");
      return;
    }
    const res = await fetch("/api/orders/objects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name, email: data.email, items }),
    });
    if (res.ok) {
      clear();
      setDone("Order recorded as a simulation. No charge. No parcel. The path from object to till worked.");
    } else setDone("Could not record the order.");
  }

  if (!items.length && !done) {
    return <p style={{ padding: 24 }}>Cart is empty.</p>;
  }

  return (
    <div style={{ padding: "28px 20px 80px", maxWidth: 560, margin: "0 auto" }}>
      <h1 style={{ fontSize: "3rem", fontWeight: 500 }}>Checkout</h1>
      <p>Subtotal {money(subtotal)}. This will not take payment.</p>
      <form onSubmit={onSubmit}>
        <label className="field"><span>Name</span><input name="name" required /></label>
        <label className="field"><span>Email</span><input name="email" type="email" required /></label>
        <label className="field"><span>Notes</span><textarea name="notes" /></label>
        <button className="btn" type="submit">Place simulated order</button>
      </form>
      {done ? <p style={{ marginTop: 16 }}>{done}</p> : null}
    </div>
  );
}
