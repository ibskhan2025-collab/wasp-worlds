import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Gallery — Casa Valle",
  description: "The room, the fire, the plates. Casa Valle gallery — a demo restaurant by WASP.",
};

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
