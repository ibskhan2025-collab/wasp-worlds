import type { Metadata } from "next";
import { CasaGalleryView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Counter gallery — heat and tickets",
  description: "Eight frames from the pass.",
};

export default function Page() { return <CasaGalleryView reality="counter" />; }
