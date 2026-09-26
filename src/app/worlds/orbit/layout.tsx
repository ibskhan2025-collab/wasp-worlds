import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ORBIT — Complex software, made legible",
  description: "A working operations demo: customers, projects, team, activity.",
};

export default function OrbitLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
