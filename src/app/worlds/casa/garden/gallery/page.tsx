import type { Metadata } from "next";
import { CasaGalleryView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Garden gallery — green hour",
  description: "Eight frames from the beds.",
};

export default function Page() { return <CasaGalleryView reality="garden" />; }
