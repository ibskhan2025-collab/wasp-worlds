import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Bag — NOIR",
  description: "Your NOIR bag and simulated checkout. A demo fashion store by WASP — no charge, no garment arrives.",
};

export default function BagLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
