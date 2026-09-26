import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  making: text("making"),
  needs: text("needs"),
  feel: text("feel"),
  idea: text("idea"),
  budget: text("budget"),
  matters: text("matters"),
  motion: text("motion"),
  brief: text("brief"),
  source: text("source").default("site"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const casaReservations = pgTable("casa_reservations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  date: text("date").notNull(),
  time: text("time").notNull(),
  party: integer("party").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const toolReports = pgTable("tool_reports", {
  id: serial("id").primaryKey(),
  tool: text("tool").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const noirOrders = pgTable("noir_orders", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  items: jsonb("items").$type<unknown>().notNull(),
  total: integer("total").notNull(),
  status: text("status").default("simulated"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const objectOrders = pgTable("object_orders", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  items: jsonb("items").$type<unknown>().notNull(),
  total: integer("total").notNull(),
  status: text("status").default("simulated"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  props: jsonb("props").$type<Record<string, string>>().notNull().default({}),
  path: text("path").notNull().default("/"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
