import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { VectorNav } from "@/components/worlds/vector-realities";
import Vector from "@/rb15w/Vector";

export const metadata: Metadata = {
  title: "VECTOR Report — a report reality by WASP",
  description: "Light, typographic, print-quality. An alternate reality of VECTOR, a demo finance / professional world by WASP.",
};

export default function VectorReportPage() {
  return (
    <>
      <WorldExit id="vector" label="Room 15 · VECTOR/REPORT" />
      <VectorNav current="report" />
      <Vector reality="report" />
    </>
  );
}
