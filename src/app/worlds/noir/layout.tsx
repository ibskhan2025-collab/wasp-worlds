import type { Metadata } from "next";
import type { ReactNode } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { NoirNav } from "@/components/noir/noir-nav";

export const metadata: Metadata = {
  title: "NOIR — Fashion as desire, engineered",
  description: "Collection, bag, journal. Luxury commerce without the shouting — a working demo by WASP, not a real store.",
};

export default function NoirLayout({ children }: { children: ReactNode }) {
  return (
    <div className="noir-root">
      <WorldExit id="noir" label="Room 02 · NOIR" />
      <NoirNav />
      {children}
    </div>
  );
}
