import type { Metadata } from "next";
import Forge from "@/rb15w/Forge";

export const metadata: Metadata = {
  title: "FORGE Blueprint — a blueprint reality by WASP",
  description: "Drafting-table view of the same parametric drawings. An alternate reality of FORGE, a demo industrial / b2b world by WASP.",
};

export default function ForgeBlueprintPage() {
  return <Forge reality="blueprint" />;
}
