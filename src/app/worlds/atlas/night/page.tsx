import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { AtlasNav } from "@/components/worlds/atlas-realities";
import Atlas from "@/rb54w/Atlas";

export const metadata: Metadata = {
  title: "ATLAS Night train — a night reality by WASP",
  description: "Dark, route-first, a departures-board itinerary. An alternate reality of ATLAS, a demo travel / places world by WASP.",
};

export default function AtlasNighttrain54Page() {
  return (
    <>
      <WorldExit id="atlas" label="Room 10 · ATLAS/NIGHT" />
      <AtlasNav current="night" />
      <Atlas reality="night" />
    </>
  );
}
