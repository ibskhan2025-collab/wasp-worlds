import type { Metadata } from "next";
import Nest from "@/rb15w/Nest";

export const metadata: Metadata = {
  title: "NEST 3D — a 3d reality by WASP",
  description: "Explore the house: cutaway, walk mode, time of day. An alternate reality of NEST, a demo architecture / space world by WASP.",
};

export default function Nest3DPage() {
  return <Nest reality="3d" />;
}
