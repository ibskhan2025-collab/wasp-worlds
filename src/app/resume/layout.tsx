import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Ibrahim F Khan | Full-Stack Developer",
  description: "Freelance full-stack developer. Websites, web apps, apps and software — designed, built, shipped.",
};

export default function ResumeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
