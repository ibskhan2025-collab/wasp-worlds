import type { Metadata } from "next";
import Civic from "@/rb15w/Civic";

export const metadata: Metadata = {
  title: "CIVIC High contrast — a contrast reality by WASP",
  description: "Large type, strong contrast, reduced layout. An alternate reality of CIVIC, a demo institutions / public world by WASP.",
};

export default function CivicHighcontrastPage() {
  return <Civic reality="contrast" />;
}
