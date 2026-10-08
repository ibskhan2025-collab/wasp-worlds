import type { Metadata } from "next";
import { CasaContactView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Spatial contact — walk in first",
  description: "Tour the room, then write.",
};

export default function Page() { return <CasaContactView reality="spatial" />; }
