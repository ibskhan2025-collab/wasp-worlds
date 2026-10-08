import type { Metadata } from "next";
import Vector from "@/rb15w/Vector";

export const metadata: Metadata = {
  title: "VECTOR 3D Surface — a surface reality by WASP",
  description: "Quarter-by-strategy returns as a navigable terrain. An alternate reality of VECTOR, a demo finance / professional world by WASP.",
};

export default function Vector3DSurfacePage() {
  return <Vector reality="surface" />;
}
