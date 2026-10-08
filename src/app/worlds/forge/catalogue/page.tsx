import type { Metadata } from "next";
import Forge from "@/rb15w/Forge";

export const metadata: Metadata = {
  title: "FORGE Datasheet — a catalogue reality by WASP",
  description: "Specs, parametric diagrams and the quote builder. An alternate reality of FORGE, a demo industrial / b2b world by WASP.",
};

export default function ForgeDatasheetPage() {
  return <Forge reality="catalogue" />;
}
