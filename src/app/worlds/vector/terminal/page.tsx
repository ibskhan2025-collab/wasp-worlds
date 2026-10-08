import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { VectorNav } from "@/components/worlds/vector-realities";
import Vector from "@/rb15w/Vector";

export const metadata: Metadata = {
  title: "VECTOR Terminal — a terminal reality by WASP",
  description: "Dark, dense, monospaced. An alternate reality of VECTOR, a demo finance / professional world by WASP.",
};

export default function VectorTerminalPage() {
  return (
    <>
      <WorldExit id="vector" label="Room 15 · VECTOR/TERMINAL" />
      <VectorNav current="terminal" />
      <Vector reality="terminal" />
    </>
  );
}
