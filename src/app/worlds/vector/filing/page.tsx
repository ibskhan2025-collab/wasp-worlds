import type { Metadata } from "next";
import { VectorFiling } from "@/components/worlds/vector-realities";

export const metadata: Metadata = {
  title: "VECTOR filing - on record",
  description: "Stamped for emphasis. A reality by WASP.",
};

export default function Page() { return <VectorFiling />; }
