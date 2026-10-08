import type { Metadata } from "next";
import { CasaGalleryView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Oceanic gallery — the room underwater",
  description: "Eight frames from the flooded dining room.",
};

export default function Page() { return <CasaGalleryView reality="oceanic" />; }
