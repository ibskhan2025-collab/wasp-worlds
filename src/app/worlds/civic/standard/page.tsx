import type { Metadata } from "next";
import Civic from "@/rb15w/Civic";

export const metadata: Metadata = {
  title: "CIVIC Standard — a standard reality by WASP",
  description: "Clear, plain-language service. An alternate reality of CIVIC, a demo institutions / public world by WASP.",
};

export default function CivicStandardPage() {
  return <Civic reality="standard" />;
}
