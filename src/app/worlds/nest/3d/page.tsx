import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { NestNav } from "@/components/worlds/nest-realities";
import Nest from "@/rb15w/Nest";

export const metadata: Metadata = {
  title: "NEST 3D — a 3d reality by WASP",
  description: "Explore the house: cutaway, walk mode, time of day. An alternate reality of NEST, a demo architecture / space world by WASP.",
};

export default function Nest3DPage() {
  return (
    <>
      <WorldExit id="nest" label="Room 14 · NEST/3D" />
      <NestNav current="3d" />
      <Nest reality="3d" />
    </>
  );
}
