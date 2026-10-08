import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { ForgeNav } from "@/components/worlds/forge-realities";
import Forge from "@/rb15w/Forge";

export const metadata: Metadata = {
  title: "FORGE Blueprint — a blueprint reality by WASP",
  description: "Drafting-table view of the same parametric drawings. An alternate reality of FORGE, a demo industrial / b2b world by WASP.",
};

export default function ForgeBlueprintPage() {
  return (
    <>
      <WorldExit id="forge" label="Room 11 · FORGE/BLUEPRINT" />
      <ForgeNav current="blueprint" />
      <Forge reality="blueprint" />
    </>
  );
}
