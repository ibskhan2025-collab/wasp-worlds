import type { Metadata } from "next";
import { CasaReservationsView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Spatial reservations — the table you clicked",
  description: "The 3D room pre-fills the booking.",
};

export default function Page() { return <CasaReservationsView reality="spatial" />; }
