import type { Metadata } from "next";
import Forge from "@/rb15w/Forge";

export const metadata: Metadata = {
  title: "FORGE 3D Inspect — a inspect reality by WASP",
  description: "Rotate, section and measure the actual part. An alternate reality of FORGE, a demo industrial / b2b world by WASP.",
};

export default function Forge3DInspectPage() {
  return <Forge reality="inspect" />;
}
