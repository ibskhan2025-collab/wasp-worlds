import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Menu — Casa Valle",
  description: "Fire, garden, sea, sweet, wine. The Casa Valle menu — a demo restaurant by WASP.",
};

export default function MenuLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
