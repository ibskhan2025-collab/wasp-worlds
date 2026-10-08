import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { VectorNav } from "@/components/worlds/vector-realities";
import Vector from "@/rb15w/Vector";

export const metadata: Metadata = {
  title: "VECTOR 3D Surface — a surface reality by WASP",
  description: "Quarter-by-strategy returns as a navigable terrain. An alternate reality of VECTOR, a demo finance / professional world by WASP.",
};

export default function Vector3DSurfacePage() {
  return (
    <>
      <WorldExit id="vector" label="Room 15 · VECTOR/SURFACE" />
      <VectorNav current="surface" />
      <Vector reality="surface" />
    </>
  );
}
