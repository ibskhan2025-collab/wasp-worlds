import type { Metadata } from "next";
import { CasaContactView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Oceanic contact — find the flooded room",
  description: "Address, hours and lines for the oceanic room.",
};

export default function Page() { return <CasaContactView reality="oceanic" />; }
