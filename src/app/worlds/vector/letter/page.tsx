import type { Metadata } from "next";
import { VectorLetter } from "@/components/worlds/vector-realities";

export const metadata: Metadata = {
  title: "VECTOR letter - the quarterly letter",
  description: "Full thinking, plain figures. A reality by WASP.",
};

export default function Page() { return <VectorLetter />; }
