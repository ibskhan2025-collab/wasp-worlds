import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { CivicNav } from "@/components/worlds/civic-realities";
import Civic from "@/rb15w/Civic";

export const metadata: Metadata = {
  title: "CIVIC Plain text — a plain reality by WASP",
  description: "Text-only, no decoration, lightest possible. An alternate reality of CIVIC, a demo institutions / public world by WASP.",
};

export default function CivicPlaintextPage() {
  return (
    <>
      <WorldExit id="civic" label="Room 13 · CIVIC/PLAIN" />
      <CivicNav current="plain" />
      <Civic reality="plain" />
    </>
  );
}
