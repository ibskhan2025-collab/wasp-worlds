import { clientKey, rateLimit } from "@/lib/server";

export const dynamic = "force-dynamic";

const MAX_BYTES = 500_000;

function isBlockedHost(host: string) {
  const h = host.toLowerCase().trim().replace(/\.$/, "");
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h === "0.0.0.0" || h === "[::]" || h === "::1") return true;
  if (/^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h)) return true;
  if (h === "169.254.169.254" || h === "metadata.google.internal") return true;
  return false;
}

export async function POST(req: Request) {
  if (!rateLimit(`audit:${clientKey(req)}`, 10, 60_000)) {
    return Response.json({ fetched: false, reason: "Too many requests. Slow down." }, { status: 429 });
  }
  try {
    const { url } = (await req.json()) as { url?: string };
    if (!url || !/^https?:\/\//i.test(url)) {
      return Response.json({ fetched: false, reason: "Need a full http(s) URL." });
    }
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return Response.json({ fetched: false, reason: "Only http(s)." });
    }
    if (isBlockedHost(parsed.hostname)) {
      return Response.json({ fetched: false, reason: "That host is not auditable." });
    }
    const res = await fetch(parsed.toString(), {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "WASP-audit/1.0" },
    });
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("text/html")) {
      return Response.json({ fetched: false, reason: `Not HTML (${type.slice(0, 60) || "unknown type"}).` });
    }
    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_BYTES) {
      return Response.json({ fetched: false, reason: "Page too large to audit." });
    }
    const html = new TextDecoder().decode(buf);
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "(no title)";
    const desc =
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] ??
      html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)?.[1] ??
      "(no meta description)";
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "(no h1)";
    const viewport = /name=["']viewport["']/i.test(html) ? "present" : "missing";
    const imgs = html.match(/<img\b[^>]*>/gi)?.length ?? 0;
    const imgsNoAlt = html.match(/<img\b(?![^>]*\balt=)[^>]*>/gi)?.length ?? 0;
    return Response.json({
      fetched: true,
      status: String(res.status),
      title: title.slice(0, 180),
      description: desc.slice(0, 240),
      h1: h1.slice(0, 180),
      viewport,
      images: String(imgs),
      imagesMissingAlt: String(imgsNoAlt),
      note: "Surface signals only. Not a complete audit, performance lab, or accessibility certification.",
    });
  } catch {
    return Response.json({
      fetched: false,
      reason: "Could not fetch that URL from this environment. Use the human checklist.",
    });
  }
}
