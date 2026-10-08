import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { AtlasNav } from "@/components/worlds/atlas-realities";
import Atlas from "@/rb54w/Atlas";

export const metadata: Metadata = {
  title: "ATLAS Paper map — a paper reality by WASP",
  description: "Warm, printed-map aesthetic. An alternate reality of ATLAS, a demo travel / places world by WASP.",
};

export default function AtlasPapermap54Page() {
  return (
    <>
      <WorldExit id="atlas" label="Room 10 · ATLAS/PAPER" />
      <AtlasNav current="paper" />
      <Atlas reality="paper" />
    </>
  );
}
