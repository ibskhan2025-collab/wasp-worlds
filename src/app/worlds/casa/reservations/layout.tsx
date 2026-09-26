import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Reservations — Casa Valle",
  description: "Hold a table at Casa Valle. A working reservation demo by WASP — the restaurant is fictional, the form is real.",
};

export default function ReservationsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
