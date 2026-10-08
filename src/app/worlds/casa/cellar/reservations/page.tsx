import type { Metadata } from "next";
import { CasaReservationsView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Cellar reservations — book the corner table",
  description: "Reserve downstairs, where the pours are.",
};

export default function Page() { return <CasaReservationsView reality="cellar" />; }
