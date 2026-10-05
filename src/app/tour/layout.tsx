import type { ReactNode } from "react";

/** Tour pages reuse the 8154 paper system. */
export default function TourLayout({ children }: { children: ReactNode }) {
  return <div className="zip-evo">{children}</div>;
}
