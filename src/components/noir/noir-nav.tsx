"use client";

import Link from "next/link";
import { useCart } from "@/lib/use-cart";

export function NoirNav() {
  const { count } = useCart("noir");
  return (
    <nav className="noir-nav">
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <Link href="/worlds/noir">Campaign</Link>
        <Link href="/worlds/noir/collection">Collection</Link>
        <Link href="/worlds/noir/lookbook">Lookbook</Link>
        <Link href="/worlds/noir/journal">Journal</Link>
        <Link href="/worlds/noir/story">House</Link>
        <Link href="/worlds/noir/appointments">Appointments</Link>
      </div>
      <Link href="/worlds/noir" style={{ letterSpacing: "0.42em" }}>
        NOIR
      </Link>
      <Link href="/worlds/noir/bag">Bag ({count})</Link>
    </nav>
  );
}
