import type { Metadata } from "next";
import { VectorLedger } from "@/components/worlds/vector-realities";

export const metadata: Metadata = {
  title: "VECTOR ledger - kept by hand",
  description: "Ruled lines, honest quarters. A reality by WASP.",
};

export default function Page() { return <VectorLedger />; }
