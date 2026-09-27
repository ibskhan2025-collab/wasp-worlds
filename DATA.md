# DATA — deletion & access runbook

The privacy page promises: ask what we hold, correct it, delete it — within 30 days.
This is how, in about two minutes, using the Neon dashboard (SQL editor)
or any Postgres client with `DATABASE_URL`.

## 1. Find everything for an email

```sql
SELECT 'inquiries' AS t, id, email, created_at FROM inquiries WHERE email = 'X';
SELECT 'casa_reservations' AS t, id, email, created_at FROM casa_reservations WHERE email = 'X';
SELECT 'noir_orders' AS t, id, email, created_at FROM noir_orders WHERE email = 'X';
SELECT 'object_orders' AS t, id, email, created_at FROM object_orders WHERE email = 'X';
SELECT 'tool_reports' AS t, id, created_at FROM tool_reports; -- no emails stored
```

Replace `X` with the requester's address. Send them the rows (access request)
or proceed to delete.

## 2. Delete everything for an email

```sql
DELETE FROM inquiries WHERE email = 'X';
DELETE FROM casa_reservations WHERE email = 'X';
DELETE FROM noir_orders WHERE email = 'X';
DELETE FROM object_orders WHERE email = 'X';
```

`events` rows carry no emails or identifiers — nothing to delete there.
Browser-local data (carts, prefs, drafts) lives on the visitor's device;
tell them clearing site data wipes it.

## 3. Reply template

> Done — every row tied to X has been deleted from our database as of
> [date]. Anything in your own browser (carts, drafts) clears when you
> clear site data. — WASP

## 4. Notes

- Act within 30 days of the request; same-day is the house standard.
- Never ask for ID beyond the email itself unless abuse is evident.
- Log the request date somewhere you control (calendar is fine).
