import type { Metadata } from "next";
import { CasaGalleryView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Brutalist gallery — evidence",
  description: "Eight frames: room, fire, plates.",
};

export default function Page() { return <CasaGalleryView reality="brutalist" />; }
