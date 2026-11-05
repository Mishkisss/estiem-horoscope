// Public read of one zodiac sign's horoscope: today (Europe/Kyiv) by default,
// an exact date when passed, or the latest stored day for the sign as fallback.
import { defineAction } from "@agent-native/core/action";
import { and, eq, max } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.ts";
import { ensureTodayStored } from "../server/lib/horoscope-sync.ts";
import { kyivToday, horoscopeRowSchema, ZODIAC_SLUGS } from "../server/lib/horoscope.ts";

export default defineAction({
  description:
    "Read one horoscope for a zodiac sign. Defaults to today, falls back to the latest stored day for that sign when present.",
  schema: z.object({
    sign: z
      .enum(ZODIAC_SLUGS)
      .describe("Zodiac sign slug, e.g. \"aries\" or \"cancer\""),
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
    sign: z.string(),
    date: z.string(),
    isFallback: z.boolean(),
    horoscope: horoscopeRowSchema.nullable(),
  }),
  run: async ({ sign, date }) => {
    const requested = date ?? kyivToday();
    const db = getDb();

    let [row] = await db
      .select()
      .from(schema.horoscopes)
      .where(
        and(eq(schema.horoscopes.sign, sign), eq(schema.horoscopes.date, requested)),
      )
      .limit(1);

    // Self-heal (throttled): when today's row is missing because the cron was
    // delayed or failed, pull the source once so the sign page shows today.
    if (!row && requested === kyivToday()) {
      if (await ensureTodayStored()) {
        [row] = await db
          .select()
          .from(schema.horoscopes)
          .where(
            and(eq(schema.horoscopes.sign, sign), eq(schema.horoscopes.date, requested)),
          )
          .limit(1);
      }
    }

    if (row) {
      return { sign, date: requested, isFallback: false, horoscope: row };
    }

    const latestRows = await db
      .select({ latest: max(schema.horoscopes.date) })
      .from(schema.horoscopes)
      .where(eq(schema.horoscopes.sign, sign));
    const latest = latestRows[0]?.latest ?? null;
    if (!latest) {
      return { sign, date: requested, isFallback: true, horoscope: null };
    }
    const [fallbackRow] = await db
      .select()
      .from(schema.horoscopes)
      .where(
        and(eq(schema.horoscopes.sign, sign), eq(schema.horoscopes.date, latest)),
      )
      .limit(1);
    return { sign, date: latest, isFallback: true, horoscope: fallbackRow ?? null };
  },
});
