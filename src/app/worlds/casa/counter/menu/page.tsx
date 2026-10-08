import type { Metadata } from "next";
import { CasaMenuView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Counter menu — fire order by CASA",
  description: "The whole menu in fire order, eaten at the pass.",
};

export default function Page() { return <CasaMenuView reality="counter" />; }
