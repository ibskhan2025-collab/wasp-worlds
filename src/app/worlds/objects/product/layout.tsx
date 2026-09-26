import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Product — OBJECTS",
  description: "An OBJECTS piece in detail: options, cart, checkout. A demo store by WASP.",
};

export default function ProductLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
