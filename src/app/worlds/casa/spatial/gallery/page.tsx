import type { Metadata } from "next";
import { CasaGalleryView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Spatial gallery — the room, framed",
  description: "Eight frames from the walkable room.",
};

export default function Page() { return <CasaGalleryView reality="spatial" />; }
