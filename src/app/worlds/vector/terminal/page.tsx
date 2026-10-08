import type { Metadata } from "next";
import Vector from "@/rb15w/Vector";

export const metadata: Metadata = {
  title: "VECTOR Terminal — a terminal reality by WASP",
  description: "Dark, dense, monospaced. An alternate reality of VECTOR, a demo finance / professional world by WASP.",
};

export default function VectorTerminalPage() {
  return <Vector reality="terminal" />;
}
