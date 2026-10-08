import type { Metadata } from "next";
import Atlas from "@/rb15w/Atlas";

export const metadata: Metadata = {
  title: "ATLAS Map — a map reality by WASP",
  description: "Pan, zoom and plot routes on a flat SVG atlas. An alternate reality of ATLAS, a demo travel / places world by WASP.",
};

export default function AtlasMapPage() {
  return <Atlas reality="map" />;
}
