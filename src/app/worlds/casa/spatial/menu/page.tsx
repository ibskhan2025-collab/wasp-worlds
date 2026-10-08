import type { Metadata } from "next";
import { CasaMenuView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Spatial menu — order from the 3D room",
  description: "The menu inside the walkable dining room.",
};

export default function Page() { return <CasaMenuView reality="spatial" />; }
