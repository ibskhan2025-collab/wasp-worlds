import type { Metadata } from "next";
import { CollectionLedger } from "./ledger";

export const metadata: Metadata = {
  title: "Collection ledger — NOIR brutalist",
  description: "Every NOIR garment as a ledger row. A brutalist reality by WASP.",
};

export default function BrutalistCollectionPage() {
  return <CollectionLedger />;
}
