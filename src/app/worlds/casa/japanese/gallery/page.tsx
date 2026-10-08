import type { Metadata } from "next";
import { CasaGalleryView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Japanese gallery — three frames, quiet",
  description: "Still room, soft light.",
};

export default function Page() { return <CasaGalleryView reality="japanese" />; }
