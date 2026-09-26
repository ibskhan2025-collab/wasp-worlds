import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Collection — NOIR",
  description: "The NOIR collection: outerwear, dresses, knits. A demo fashion store by WASP.",
};

export default function CollectionLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
