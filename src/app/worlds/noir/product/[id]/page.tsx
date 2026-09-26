"use client";

import Link from "next/link";
import { use, useState } from "react";
import { noirProducts } from "@/data/noir";
import { money, useCart } from "@/lib/use-cart";

export default function NoirProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = noirProducts.find((p) => p.id === id);
  const { add } = useCart("noir");
  const [size, setSize] = useState(product?.sizes[0] ?? "M");
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  if (!product) return <p style={{ padding: 24 }}>Gone.</p>;
  const related = noirProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="grid-2" style={{ minHeight: "80dvh" }}>
      <img src={product.image} alt={product.name} style={{ width: "100%", minHeight: 420, objectFit: "cover", filter: "grayscale(1)" }} />
      <div style={{ padding: "40px 28px", fontFamily: "var(--font-sans)" }}>
        <Link href="/worlds/noir/collection" className="kicker">
          ← Collection
        </Link>
        <h1 style={{ fontFamily: "var(--font-lux)", fontSize: "clamp(2.6rem, 6vw, 4.4rem)", fontWeight: 500, margin: "12px 0" }}>
          {product.name}
        </h1>
        <p>{product.desc}</p>
        <p className="kicker" style={{ marginTop: 16 }}>{product.fabric}</p>
        <p style={{ fontSize: "1.6rem", margin: "16px 0" }}>{money(product.price)}</p>
        <p className="kicker">Size</p>
        <div style={{ display: "flex", gap: 8, margin: "8px 0 20px", flexWrap: "wrap" }}>
          {product.sizes.map((s) => (
            <button key={s} className={size === s ? "chip-on" : "chip"} type="button" onClick={() => setSize(s)}>
              {s}
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
            if (!product.sizes.includes(size)) {
              setMsg("Pick a size first.");
              return;
            }
            add({ id: product.id, name: product.name, price: product.price, image: product.image, size, qty });
            setMsg(`${qty} × ${product.name} (${size}) in the bag.`);
          }}
        >
          Add to bag — {money(product.price * qty)}
        </button>
        {msg ? <p style={{ marginTop: 12 }}>{msg} <Link href="/worlds/noir/bag">View bag</Link></p> : null}
        {related.length ? (
          <div style={{ marginTop: 32 }}>
            <p className="kicker">Pairs with</p>
            {related.map((r) => (
              <Link key={r.id} href={`/worlds/noir/product/${r.id}`} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
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
