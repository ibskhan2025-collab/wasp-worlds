import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Checkout — OBJECTS",
  description: "Simulated checkout for the OBJECTS store. A demo by WASP — nothing is charged.",
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
