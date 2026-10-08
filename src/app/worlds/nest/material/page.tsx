import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { NestNav } from "@/components/worlds/nest-realities";
import Nest from "@/rb15w/Nest";

export const metadata: Metadata = {
  title: "NEST Material — a material reality by WASP",
  description: "Swatch-led view: choose floors, walls, cladding. An alternate reality of NEST, a demo architecture / space world by WASP.",
};

export default function NestMaterialPage() {
  return (
    <>
      <WorldExit id="nest" label="Room 14 · NEST/MATERIAL" />
      <NestNav current="material" />
      <Nest reality="material" />
    </>
  );
}
