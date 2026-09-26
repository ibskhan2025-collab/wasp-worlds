import type { Metadata } from "next";
import type { ReactNode } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { CasaNav } from "@/components/casa/casa-nav";

export const metadata: Metadata = {
  title: "CASA — A restaurant site that makes you hungry",
  description: "Menu, gallery, reservations. Hospitality as an interface — a working demo by WASP, not a real restaurant.",
};

export default function CasaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="casa-root">
      <WorldExit id="casa" label="Room 01 · CASA" />
      <CasaNav />
      {children}
    </div>
  );
}
