import type { Metadata } from "next";
import { CasaContactView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Garden contact — among the beds",
  description: "Write via the potting shed.",
};

export default function Page() { return <CasaContactView reality="garden" />; }
