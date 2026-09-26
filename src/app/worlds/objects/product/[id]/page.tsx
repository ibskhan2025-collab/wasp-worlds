"use client";

import Link from "next/link";
import { use, useState } from "react";
import { objectProducts } from "@/data/objects";
import { money, useCart } from "@/lib/use-cart";

export default function ObjectProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = objectProducts.find((p) => p.id === id);
  const { add } = useCart("objects");
  const [option, setOption] = useState(product?.options[0] ?? "");
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  if (!product) return <p style={{ padding: 24 }}>Not in the room.</p>;
  const related = objectProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="grid-2">
      <img src={product.image} alt={product.name} style={{ width: "100%", minHeight: 360, objectFit: "cover" }} />
      <div style={{ padding: "32px 24px" }}>
        <Link href="/worlds/objects/shop" className="kicker">← Shop</Link>
        <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 500 }}>{product.name}</h1>
        <p>{product.desc}</p>
        <p style={{ fontSize: "1.5rem" }}>{money(product.price)}</p>
        <p className="kicker">Option</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0 20px" }}>
          {product.options.map((o) => (
            <button key={o} className={option === o ? "chip-on" : "chip"} type="button" onClick={() => setOption(o)}>
              {o}
            </button>
          ))}
        </div>
        <p className="kicker">Quantity</p>
        <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0 20px" }}>
          <button type="button" className="ghost" aria-label="Decrease quantity" onClick={() => setQty((n) => Math.max(1, n - 1))}>−</button>
          <span aria-live="polite">{qty}</span>
          <button type="button" className="ghost" aria-label="Increase quantity" onClick={() => setQty((n) => Math.min(9, n + 1))}>+</button>
        </div>
        <button
          className="btn"
          type="button"
          onClick={() => {
            if (!product.options.includes(option)) {
              setMsg("Pick an option first.");
              return;
            }
            add({ id: product.id, name: product.name, price: product.price, image: product.image, option, qty });
            setMsg(`${qty} × ${product.name} (${option}) in the cart.`);
          }}
        >
          Add to cart — {money(product.price * qty)}
        </button>
        {msg ? (
          <p>
            {msg} <Link href="/worlds/objects/cart">View cart</Link>
          </p>
        ) : null}
        {related.length ? (
          <div style={{ marginTop: 32 }}>
            <p className="kicker">Sits well with</p>
            {related.map((r) => (
              <Link key={r.id} href={`/worlds/objects/product/${r.id}`} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                <span>{r.name}</span>
                <span>{money(r.price)}</span>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
