import type { MetadataRoute } from "next";

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
    ["/worlds/casa", "monthly", 0.7],
    ["/worlds/noir", "monthly", 0.7],
    ["/worlds/orbit", "monthly", 0.7],
    ["/worlds/still", "monthly", 0.7],
    ["/worlds/signal", "monthly", 0.7],
    ["/worlds/objects", "monthly", 0.7],
    ["/worlds/archive", "monthly", 0.7],
    ["/worlds/motion", "monthly", 0.7],
    ["/worlds/void", "monthly", 0.7],
    ["/worlds/atlas", "monthly", 0.7],
    ["/worlds/forge", "monthly", 0.7],
    ["/worlds/pulse", "monthly", 0.7],
    ["/worlds/civic", "monthly", 0.7],
    ["/worlds/nest", "monthly", 0.7],
    ["/worlds/vector", "monthly", 0.7],
  ];
  return pages.map(([path, freq, priority]) => ({ url: `${base}${path}`, changeFrequency: freq, priority }));
}
