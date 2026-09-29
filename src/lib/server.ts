const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  return arr.length <= limit;
}

export function clientKey(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

const DISPOSABLE = new Set([
  "mailinator.com", "mailinator.net", "tempmail.com", "temp-mail.org", "guerrillamail.com",
  "10minutemail.com", "10minutemail.net", "throwawaymail.com", "yopmail.com", "yopmail.net",
  "fakemail.net", "trashmail.com", "maildrop.cc", "getnada.com", "mohmal.com", "sharklasers.com",
  "spam4.me", "tempmailo.com", "mailnesia.com", "mintemail.com", "mytemp.email", "dispostable.com",
  "emailondeck.com", "trash-mail.com", "fakeinbox.com", "mailcatch.com", "inboxkitten.com",
]);

const RESERVED_HOSTS = new Set(["example.com", "example.net", "example.org", "test.com", "localhost", "invalid"]);

const JUNK_LOCALS = new Set([
  "test", "tester", "testing", "asdf", "asdfg", "asdfgh", "qwerty", "abc", "abc123",
  "fake", "faker", "dummy", "spam", "spammer", "null", "undefined", "none", "sample",
  "xxx", "zzz", "123", "12345",
]);

/** null = acceptable. Otherwise a human-readable reason (safe to show the visitor). */
export function emailError(v: unknown): string | null {
  if (typeof v !== "string") return "Enter a valid email address.";
  const email = v.trim().toLowerCase();
  if (email.length > 254) return "That email is too long.";
  const m = /^([a-z0-9.!#$%&'*+/=?^_`{|}~-]+)@([a-z0-9-]+(?:\.[a-z0-9-]+)+)$/.exec(email);
  if (!m) return "Enter a valid email address.";
  const [, local, host] = m;
  if (local.length > 64 || host.length > 253) return "Enter a valid email address.";
  if (JUNK_LOCALS.has(local)) return "That email doesn't look real — use your actual address.";
  if (local.length < 2 && !/^[a-z0-9]$/i.test(local)) return "Enter a valid email address.";
  if (RESERVED_HOSTS.has(host)) return "That email domain isn't real.";
  if (DISPOSABLE.has(host)) return "Temporary email addresses aren't accepted — use your real one.";
  if (!/\.[a-z]{2,}$/.test(host)) return "Enter a valid email address.";
  return null;
}

/** Human names: letters, at least 2 chars, no links/handles, no keyboard mash. */
export function nameError(v: unknown, field = "Name"): string | null {
  if (typeof v !== "string") return `${field} is required.`;
  const t = v.trim();
  if (t.length < 2) return `${field} needs at least 2 characters.`;
  if (t.length > 100) return `${field} is too long.`;
  if (!/\p{L}/u.test(t)) return `${field} needs actual letters.`;
  if (/@|https?:|www\.|\.com|\.net|\.io\b/i.test(t)) return `${field} shouldn't contain links or handles.`;
  const counts = new Map<string, number>();
  for (const ch of t.toLowerCase()) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  const top = Math.max(...counts.values());
  if (top / t.length > 0.6) return `${field} doesn't look real.`;
  return null;
}

/** Free text with a floor: rejects empty, one-word, and keyboard-mash submissions. */
export function textError(v: unknown, field: string, min = 10, max = 5000): string | null {
  if (typeof v !== "string") return `${field} is required.`;
  const t = v.trim();
  if (t.length < min) return `${field} needs a little more — at least ${min} characters.`;
  if (t.length > max) return `${field} is too long (max ${max}).`;
  const words = t.split(/\s+/);
  if (words.length < 2) return `${field} needs at least a couple of words.`;
  return null;
}

/**
 * Honeypot: real visitors never fill fields named "website" (hidden via CSS).
 * Bots do. Returns true when the submission should be silently accepted
 * (200 + ok:true) WITHOUT storing anything — never tip off the bot.
 */
export function isHoneypot(body: Record<string, unknown>) {
  const v = body.website ?? body.url ?? body.fax;
  return typeof v === "string" && v.trim() !== "";
}

export function str(v: unknown, max = 200) {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t) return null;
  return t.slice(0, max);
}

export function optStr(v: unknown, max = 200) {
  if (v == null || v === "") return null;
  if (typeof v !== "string") return null;
  return v.trim().slice(0, max) || null;
}

export function clampInt(v: unknown, min: number, max: number) {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return null;
  const i = Math.floor(n);
  if (i < min || i > max) return null;
  return i;
}
