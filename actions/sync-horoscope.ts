// Pull today's readings from the CosmyDay source and upsert them into the
// `horoscopes` table (one row per sign, keyed by sign + date).
//
// Public site content is readable without auth, but overwriting it should not
// be. In production set HOROSCOPE_SYNC_TOKEN (deploy-level secret) and pass it
// as `token`; when the env var is unset (local dev) writes are allowed.
import { defineAction, fail } from "@agent-native/core/action";
import { sql } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.ts";
import {
  buildHoroscopeRecords,
  fetchCosmyDayDaily,
  kyivToday,
} from "../server/lib/horoscope.ts";

export default defineAction({
  description:
    "Sync today's horoscopes from the CosmyDay source into the database, upserting one row per zodiac sign.",
  schema: z.object({
    token: z.string().optional().describe("Value of HOROSCOPE_SYNC_TOKEN (required when set)"),
  }),
  http: { method: "POST" },
  // Machine callers (cron) run without a session; overwriting content is
  // protected by the HOROSCOPE_SYNC_TOKEN check inside `run` — set that env in
  // production. Local dev keeps the env unset: writes stay open for smoke tests.
  requiresAuth: false,
  outputSchema: z.object({
    date: z.string(),
    synced: z.number().int(),
    signs: z.array(z.string()),
    sourceDate: z.string().nullable(),
    _receipt: z.unknown().optional(),
  }),
  run: async ({ token }) => {
    // HOROSCOPE_SYNC_TOKEN is a deployment-owned sync token (matches webhook
    // verification secrets: set in deployment config, passed by the cron
    // caller), not a user/organization credential.
    // guard:allow-env-credential — deploy-level sync token owned by the deployment
    const expected = process.env.HOROSCOPE_SYNC_TOKEN;
    if (expected && token !== expected) {
      fail("Sync token is missing or wrong", { statusCode: 401 });
    }

    let daily;
    try {
      daily = await fetchCosmyDayDaily();
    } catch {
      fail("Horoscope source (CosmyDay) is unavailable, try again later", { statusCode: 503 });
    }

    const date = kyivToday();
    const records = buildHoroscopeRecords(daily, date);
    if (records.length === 0) {
      fail("CosmyDay returned no readable horoscopes", { statusCode: 502 });
    }

    const now = new Date().toISOString();
    const db = getDb();
    await db
      .insert(schema.horoscopes)
      .values(
        records.map((r) => ({
          id: crypto.randomUUID(),
          sign: r.sign,
          date: r.date,
          language: "en",
          overview: r.overview,
          work: r.work,
          love: r.love,
          mood: r.mood,
          advice: r.advice,
          closing: r.closing,
          leadEvent: r.leadEvent,
          luckyNumber: r.luckyNumber,
          luckyColor: r.luckyColor,
          compatibility: r.compatibility,
          relevanceScore: r.relevanceScore,
          source: r.source,
          updatedAt: now,
        })),
      )
      .onConflictDoUpdate({
        target: [schema.horoscopes.sign, schema.horoscopes.date],
        set: {
          language: sql`excluded.language`,
          overview: sql`excluded.overview`,
          work: sql`excluded.work`,
          love: sql`excluded.love`,
          mood: sql`excluded.mood`,
          advice: sql`excluded.advice`,
          closing: sql`excluded.closing`,
          leadEvent: sql`excluded.lead_event`,
          luckyNumber: sql`excluded.lucky_number`,
          luckyColor: sql`excluded.lucky_color`,
          compatibility: sql`excluded.compatibility`,
          relevanceScore: sql`excluded.relevance_score`,
          source: sql`excluded.source`,
          updatedAt: sql`excluded.updated_at`,
        },
      });

    return {
      date,
      synced: records.length,
      signs: records.map((r) => r.sign),
      sourceDate: daily.date ?? null,
      _receipt: {
        changed: true,
        verified: true,
        summary: `Upserted ${records.length} horoscope rows for ${date}.`,
      },
    };
  },
});
