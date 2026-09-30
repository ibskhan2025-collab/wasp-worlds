import type { MetadataRoute } from "next";
import { REALITIES } from "@/lib/realities";
import { WORLDS } from "@/lib/worlds";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.SITE_URL || "https://example.com").replace(/\/$/, "");
  const pages: [string, "weekly" | "monthly", number][] = [
    ["/", "weekly", 1],
    ["/studio", "monthly", 0.8],
    ["/work", "weekly", 0.8],
    ["/tools", "monthly", 0.6],
    ["/start", "monthly", 0.9],
    ["/process", "monthly", 0.5],
    ["/lab", "monthly", 0.5],
    ["/os", "monthly", 0.5],
    ["/matrix", "monthly", 0.6],
    ["/3d", "monthly", 0.6],
    ["/analog", "monthly", 0.6],
    ["/night", "monthly", 0.6],
    ["/resume", "monthly", 0.5],
    ["/privacy", "monthly", 0.3],
    ["/terms", "monthly", 0.3],
  ];
  for (const w of WORLDS) {
    pages.push([w.href, "monthly", 0.7]);
    for (const r of REALITIES[w.id] ?? []) {
      if (r.id !== "classic") pages.push([`${w.href}/${r.id}`, "monthly", 0.6]);
    }
  }
  return pages.map(([path, freq, priority]) => ({ url: `${base}${path}`, changeFrequency: freq, priority }));
}
