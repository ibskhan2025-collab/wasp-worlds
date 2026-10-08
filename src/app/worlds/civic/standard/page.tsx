import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { CivicNav } from "@/components/worlds/civic-realities";
import Civic from "@/rb15w/Civic";

export const metadata: Metadata = {
  title: "CIVIC Standard — a standard reality by WASP",
  description: "Clear, plain-language service. An alternate reality of CIVIC, a demo institutions / public world by WASP.",
};

export default function CivicStandardPage() {
  return (
    <>
      <WorldExit id="civic" label="Room 13 · CIVIC/STANDARD" />
      <CivicNav current="standard" />
      <Civic reality="standard" />
    </>
  );
}
