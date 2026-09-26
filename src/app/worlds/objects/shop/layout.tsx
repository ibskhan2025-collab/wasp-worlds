import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Shop — OBJECTS",
  description: "Ceramics, seating, light. The OBJECTS shop — a demo store by WASP.",
};

export default function ShopLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
