import type { Metadata } from "next";
import { VectorChart } from "@/components/worlds/vector-realities";

export const metadata: Metadata = {
  title: "VECTOR chart - every quarter plotted",
  description: "Drawdowns labelled, not smoothed. A reality by WASP.",
};

export default function Page() { return <VectorChart />; }
