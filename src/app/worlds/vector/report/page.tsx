import type { Metadata } from "next";
import { VectorReport } from "@/components/worlds/vector-realities";

export const metadata: Metadata = {
  title: "VECTOR report - half-year, honestly",
  description: "Half-year, honestly. A reality by WASP.",
};

export default function Page() { return <VectorReport />; }
