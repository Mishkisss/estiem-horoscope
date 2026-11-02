// Public read of today's horoscope for all 12 signs. When today (Europe/Kyiv)
// has not been synced yet, falls back to the most recent stored day and marks
// the response as `isFallback` so the UI can show the date it is reusing.
import { defineAction } from "@agent-native/core/action";
import { eq, max } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.ts";
import { kyivToday, ZODIAC_SLUGS, horoscopeRowSchema } from "../server/lib/horoscope.ts";

export default defineAction({
  description:
    "Read today's horoscope for every zodiac sign, ordered canonically. Falls back to the most recent stored day when today is not synced yet.",
  schema: z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
      .optional()
      .describe("Calendar day (YYYY-MM-DD); defaults to today in Europe/Kyiv"),
  }),
  http: { method: "GET" },
  // Site reads horoscopes without login; the framework registers this GET
  // route as an auth-public path and runs it anonymously.
  requiresAuth: false,
  outputSchema: z.object({
    date: z.string(),
    isFallback: z.boolean(),
    horoscopes: z.array(horoscopeRowSchema),
  }),
  run: async ({ date }) => {
    const requested = date ?? kyivToday();
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.horoscopes)
      .where(eq(schema.horoscopes.date, requested));

    if (rows.length > 0) {
      return {
        date: requested,
        isFallback: false,
        horoscopes: sortByZodiac(rows),
      };
    }

    const latestRows = await db
      .select({ latest: max(schema.horoscopes.date) })
      .from(schema.horoscopes);
    const latest = latestRows[0]?.latest ?? null;
    if (!latest) {
      return { date: requested, isFallback: true, horoscopes: [] };
    }
    const fallbackRows = await db
      .select()
      .from(schema.horoscopes)
      .where(eq(schema.horoscopes.date, latest));
    return { date: latest, isFallback: true, horoscopes: sortByZodiac(fallbackRows) };
  },
});

function sortByZodiac<T extends { sign: string }>(rows: T[]): T[] {
  return [...rows].sort(
    (a, b) =>
      ZODIAC_SLUGS.indexOf(a.sign as never) - ZODIAC_SLUGS.indexOf(b.sign as never),
  );
}
