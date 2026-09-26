import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Cart — OBJECTS",
  description: "Your OBJECTS cart. A demo store by WASP — no charge, no parcel.",
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
