import type { Metadata } from "next";
import { CasaMenuView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Oceanic menu — tide-first dishes by CASA",
  description: "The sea dishes lead. Same kitchen, twelve fathoms down.",
};

export default function Page() { return <CasaMenuView reality="oceanic" />; }
