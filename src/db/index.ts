import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

function createPool() {
  if (!databaseUrl) return null;
  if (globalForDb.__arenaNextJsPostgresqlPool) return globalForDb.__arenaNextJsPostgresqlPool;
  const pool = new Pool({ connectionString: databaseUrl });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }
  return pool;
}

export const pool = databaseUrl ? createPool() : null;

/** Null when DATABASE_URL is missing (build / static export / local demo). */
export const db = pool ? drizzle(pool, { schema }) : null;

export function isDbConfigured() {
  return db !== null;
}

export function requireDb() {
  if (!db) throw new Error("DATABASE_URL is not configured");
  return db;
}
