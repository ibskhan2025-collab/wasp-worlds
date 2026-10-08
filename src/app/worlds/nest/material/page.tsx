import type { Metadata } from "next";
import Nest from "@/rb15w/Nest";

export const metadata: Metadata = {
  title: "NEST Material — a material reality by WASP",
  description: "Swatch-led view: choose floors, walls, cladding. An alternate reality of NEST, a demo architecture / space world by WASP.",
};

export default function NestMaterialPage() {
  return <Nest reality="material" />;
}
