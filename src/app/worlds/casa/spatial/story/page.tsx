import type { Metadata } from "next";
import { CasaStoryView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Spatial story — geometry with a purpose",
  description: "Every table in 3D is a table in the ledger.",
};

export default function Page() { return <CasaStoryView reality="spatial" />; }
