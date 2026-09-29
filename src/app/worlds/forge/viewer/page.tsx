import type { Metadata } from "next";
import { ForgeViewer } from "@/components/worlds/forge-viewer";

export const metadata: Metadata = {
  title: "FORGE viewer — rotate and measure",
  description: "Solids built from spec numbers. A reality by WASP.",
};

export default function Page() { return <ForgeViewer />; }
