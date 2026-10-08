import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { CivicNav } from "@/components/worlds/civic-realities";
import Civic from "@/rb15w/Civic";

export const metadata: Metadata = {
  title: "CIVIC High contrast — a contrast reality by WASP",
  description: "Large type, strong contrast, reduced layout. An alternate reality of CIVIC, a demo institutions / public world by WASP.",
};

export default function CivicHighcontrastPage() {
  return (
    <>
      <WorldExit id="civic" label="Room 13 · CIVIC/CONTRAST" />
      <CivicNav current="contrast" />
      <Civic reality="contrast" />
    </>
  );
}
