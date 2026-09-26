"use client";

import Link from "next/link";
import { money, useCart } from "@/lib/use-cart";

export default function ObjectsCart() {
  const { items, setQty, remove, subtotal } = useCart("objects");
  return (
    <div style={{ padding: "28px 20px 80px", maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: "3.2rem", fontWeight: 500 }}>Cart</h1>
      {items.length === 0 ? (
        <p>
          Empty. <Link href="/worlds/objects/shop">Shop</Link>
        </p>
      ) : (
        items.map((item, i) => (
          <div key={`${item.id}-${i}`} style={{ display: "grid", gridTemplateColumns: "72px 1fr auto", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
            <img src={item.image} alt={item.name} loading="lazy" decoding="async" style={{ width: 72, height: 88, objectFit: "cover" }} />
            <div>
              <div>{item.name}</div>
              <div className="kicker">{item.option}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className="ghost" type="button" onClick={() => setQty(i, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button className="ghost" type="button" onClick={() => setQty(i, item.qty + 1)}>+</button>
                <button className="ghost" type="button" onClick={() => remove(i)}>Remove</button>
              </div>
            </div>
            <div>{money(item.price * item.qty)}</div>
          </div>
        ))
      )}
      {items.length ? (
        <div style={{ marginTop: 24 }}>
          <p>Subtotal {money(subtotal)}</p>
          <Link className="btn" href="/worlds/objects/checkout">
            Checkout
          </Link>
        </div>
      ) : null}
    </div>
  );
}
