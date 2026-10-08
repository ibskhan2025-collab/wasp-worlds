import type { Metadata } from "next";
import { CasaMenuView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Garden menu — from the beds by CASA",
  description: "Picked at 16:00, plated at 17:30.",
};

export default function Page() { return <CasaMenuView reality="garden" />; }
