"use client";

import Link from "next/link";
import { useCart } from "@/lib/use-cart";

export function ObjNav() {
  const { count } = useCart("objects");
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase" }}>
      <Link href="/worlds/objects" style={{ fontWeight: 600 }}>OBJECTS</Link>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Link href="/worlds/objects/shop">Shop</Link>
        <Link href="/worlds/objects/makers">Makers</Link>
        <Link href="/worlds/objects/gallery">Gallery</Link>
        <Link href="/worlds/objects/cart">Cart ({count})</Link>
      </div>
    </nav>
  );
}
