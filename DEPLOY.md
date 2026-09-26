# Deploy checklist — wasp-work

## 1. Environment (host dashboard → Environment Variables)

| Key | Value | Notes |
|---|---|---|
| `DATABASE_URL` | pooled Neon string | App 503s on all forms without it |
| `SITE_URL` | `https://your-domain` | No trailing slash. Sitemap, robots, OG |
| `ADMIN_KEY` | long random string | Gates `/analytics?key=…`. Generate: `openssl rand -hex 24` |

`.env.local` holds these locally. Never commit it (already gitignored).

## 2. Database

```bash
npx drizzle-kit push
```

Creates: inquiries, casa_reservations, tool_reports, noir_orders,
object_orders, events. Verify: `GET /api/health` → `{"ok":true,"db":true}`.

## 3. Smoke test (after deploy)

1. `GET /api/health` → db true
2. Submit `/start` brief → row in `inquiries`, event in `events`
3. Book CASA table → row in `casa_reservations`
4. Visit `/analytics?key=ADMIN_KEY` → counts move
5. View source on any page → no `localhost` URLs

## 4. Vercel (recommended)

Push to GitHub → Import project → add the 3 env vars → Deploy.
`npm run build` is the build command. No adapter needed.

## 5. Custom domain

Vercel → Settings → Domains → add domain → set `SITE_URL` to it →
redeploy (bakes OG/sitemap URLs). Update `metadataBase` automatically
follows `SITE_URL`.
