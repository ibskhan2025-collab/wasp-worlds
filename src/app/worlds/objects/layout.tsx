import type { Metadata } from "next";
import type { ReactNode } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { ObjNav } from "@/components/objects/obj-nav";

export const metadata: Metadata = {
  title: "OBJECTS — A shop that treats shopping like discovery",
  description: "Ceramics, seating, light. Browse, desire, cart, convert.",
};

export default function ObjectsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="obj-root">
      <WorldExit id="objects" label="Room 06 · OBJECTS" />
      <ObjNav />
      {children}
    </div>
  );
}
