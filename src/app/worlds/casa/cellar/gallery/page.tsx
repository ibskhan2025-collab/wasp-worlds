import type { Metadata } from "next";
import { CasaGalleryView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Cellar gallery — low light, long pours",
  description: "Eight frames from the cellar book.",
};

export default function Page() { return <CasaGalleryView reality="cellar" />; }
