import type { Metadata } from "next";
import { NestDrawing } from "@/components/worlds/nest-realities";

export const metadata: Metadata = {
  title: "NEST drawing - inked plan",
  description: "Tracing paper, revision B. A reality by WASP.",
};

export default function Page() { return <NestDrawing />; }
