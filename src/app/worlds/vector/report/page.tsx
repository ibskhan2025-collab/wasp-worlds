import type { Metadata } from "next";
import Vector from "@/rb15w/Vector";

export const metadata: Metadata = {
  title: "VECTOR Report — a report reality by WASP",
  description: "Light, typographic, print-quality. An alternate reality of VECTOR, a demo finance / professional world by WASP.",
};

export default function VectorReportPage() {
  return <Vector reality="report" />;
}
