import type { Metadata } from "next";
import Nest from "@/rb15w/Nest";

export const metadata: Metadata = {
  title: "NEST Blueprint — a blueprint reality by WASP",
  description: "Drafting-style SVG plan with dimensions. An alternate reality of NEST, a demo architecture / space world by WASP.",
};

export default function NestBlueprintPage() {
  return <Nest reality="blueprint" />;
}
