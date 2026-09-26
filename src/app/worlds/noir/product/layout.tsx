import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Product — NOIR",
  description: "A NOIR garment in detail: fabric, sizes, bag. A demo fashion store by WASP.",
};

export default function ProductLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
