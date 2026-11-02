import { sql } from "drizzle-orm";
import { integer, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

// One row per zodiac sign per day. Filled by `sync-horoscope` from the
// CosmyDay source; read publicly by `get-today-horoscope` and
// `get-sign-horoscope`. Horoscopes are public content — no per-user access.
export const horoscopes = pgTable(
  "horoscopes",
  {
    id: text("id").primaryKey(),
    // Zodiac sign slug, one of ZODIAC_SLUGS in server/lib/horoscope.ts
    sign: text("sign").notNull(),
    // Publication day as YYYY-MM-DD (Europe/Kyiv calendar day)
    date: text("date").notNull(),
    // Content language ("en" until Ukrainian texts land)
    language: text("language").notNull().default("en"),
    // Parsed sections of the daily reading
    overview: text("overview").notNull().default(""),
    work: text("work").notNull().default(""),
    love: text("love").notNull().default(""),
    mood: text("mood").notNull().default(""),
    advice: text("advice").notNull().default(""),
    closing: text("closing").notNull().default(""),
    // Optional astrological context from the source
    leadEvent: text("lead_event").notNull().default(""),
    // Fun-of-the-day extras (generated deterministically per sign + date)
    luckyNumber: integer("lucky_number"),
    luckyColor: text("lucky_color"),
    compatibility: text("compatibility"),
    relevanceScore: integer("relevance_score"),
    source: text("source").notNull().default("cosmyday"),
    createdAt: text("created_at").notNull().default(sql`now()`),
    updatedAt: text("updated_at").notNull().default(sql`now()`),
  },
  (t) => [uniqueIndex("horoscopes_sign_date_idx").on(t.sign, t.date)],
);
