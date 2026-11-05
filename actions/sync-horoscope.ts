// Pull today's readings from the CosmyDay source and upsert them into the
// `horoscopes` table (one row per sign, keyed by sign + date).
//
// Public site content is readable without auth, but overwriting it should not
// be. In production set HOROSCOPE_SYNC_TOKEN (deploy-level secret) and pass it
// as `token`; when the env var is unset (local dev) writes are allowed.
import { defineAction, fail } from "@agent-native/core/action";
import { z } from "zod";

import {
  fetchTodayRecords,
  upsertHoroscopeRecords,
} from "../server/lib/horoscope-sync.ts";

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

    let today;
    try {
      today = await fetchTodayRecords();
    } catch {
      fail("Horoscope source (CosmyDay) is unavailable, try again later", { statusCode: 503 });
    }

    if (today.records.length === 0) {
      fail("CosmyDay returned no readable horoscopes", { statusCode: 502 });
    }

    if (!today.publishable) {
      // The source has not rolled over to the current Kyiv day yet: write
      // nothing rather than label older content as today. Readers keep the
      // fallback day until the source publishes (self-heal will pick it up).
      return {
        date: today.date,
        synced: 0,
        signs: [],
        sourceDate: today.sourceDate,
        _receipt: {
          changed: false,
          verified: true,
          summary: `Source still publishes ${today.sourceDate ?? "an unpublished day"}; nothing stored for ${today.date}.`,
        },
      };
    }

    await upsertHoroscopeRecords(today.records);

    return {
      date: today.date,
      synced: today.records.length,
      signs: today.records.map((r) => r.sign),
      sourceDate: today.sourceDate,
      _receipt: {
        changed: true,
        verified: true,
        summary: `Upserted ${today.records.length} horoscope rows for ${today.date}.`,
      },
    };
  },
});
