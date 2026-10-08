import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { AtlasNav } from "@/components/worlds/atlas-realities";
import Atlas from "@/rb15w/Atlas";

export const metadata: Metadata = {
  title: "ATLAS Map — a map reality by WASP",
  description: "Pan, zoom and plot routes on a flat SVG atlas. An alternate reality of ATLAS, a demo travel / places world by WASP.",
};

export default function AtlasMapPage() {
  return (
    <>
      <WorldExit id="atlas" label="Room 10 · ATLAS/MAP" />
      <AtlasNav current="map" />
      <Atlas reality="map" />
    </>
  );
}
