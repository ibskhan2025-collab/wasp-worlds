import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { AtlasNav } from "@/components/worlds/atlas-realities";
import Atlas from "@/rb15w/Atlas";

export const metadata: Metadata = {
  title: "ATLAS Globe — a globe reality by WASP",
  description: "The trip on a rotating globe with arcs between stops. An alternate reality of ATLAS, a demo travel / places world by WASP.",
};

export default function AtlasGlobePage() {
  return (
    <>
      <WorldExit id="atlas" label="Room 10 · ATLAS/GLOBE" />
      <AtlasNav current="globe" />
      <Atlas reality="globe" />
    </>
  );
}
