import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { ForgeNav } from "@/components/worlds/forge-realities";
import Forge from "@/rb15w/Forge";

export const metadata: Metadata = {
  title: "FORGE 3D Inspect — a inspect reality by WASP",
  description: "Rotate, section and measure the actual part. An alternate reality of FORGE, a demo industrial / b2b world by WASP.",
};

export default function Forge3DInspectPage() {
  return (
    <>
      <WorldExit id="forge" label="Room 11 · FORGE/INSPECT" />
      <ForgeNav current="inspect" />
      <Forge reality="inspect" />
    </>
  );
}
