"use client";

// Fire-and-forget analytics. Never throws, never blocks rendering.
// Events land in Postgres (events table) — free, yours, no vendor.
export function track(name: "world_visit" | "brief_started" | "inquiry_submitted" | "reservation_submitted" | "preference_set", props?: Record<string, string | number>) {
  try {
    const body = JSON.stringify({ name, props: props ?? {}, path: window.location.pathname });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
  } catch {
    /* analytics must never break the page */
  }
}
