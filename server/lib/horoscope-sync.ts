// Shared database writes for the `horoscopes` table. Two callers:
//
// - `actions/sync-horoscope` — token-gated refresh (GitHub Actions cron);
// - `ensureTodayStored` — a throttled self-heal called by the read actions:
//   when today's rows are still missing (the scheduled run was delayed or
//   failed), the first reader pulls the source once per cooldown window so the
//   site serves the current Kyiv day instead of the fallback day. The self-heal
//   only ever writes source-derived content for the current day — it accepts no
//   caller input, so it needs no token of its own.
//
// Both paths refuse to write when the source has not published the current
// Kyiv day yet (`publishable: false`): labeling older content as today is
// exactly the stale-date bug readers noticed. Until the source rolls over,
// readers keep the honest fallback day.
import { sql } from "drizzle-orm";

import { getDb, schema } from "../db.ts";
import {
  buildHoroscopeRecords,
  fetchCosmyDayDaily,
  kyivToday,
  type ParsedHoroscope,
} from "./horoscope.ts";

// One source fetch per server instance per window; concurrent readers that
// lose the race simply serve the fallback day instead of stampeding.
const SELF_HEAL_COOLDOWN_MS = 5 * 60_000;
let lastSelfHealAttemptAt = 0;

export type TodayRecords = {
  /** Kyiv day the rows are stored under, YYYY-MM-DD. */
  date: string;
  records: ParsedHoroscope[];
  /** Publication day declared by the source; null when it sends none. */
  sourceDate: string | null;
  /** False while the source still publishes a day other than today. */
  publishable: boolean;
};

/** Fetch the source and build today's (Europe/Kyiv) records. Throws when the source is unreachable. */
export async function fetchTodayRecords(): Promise<TodayRecords> {
  const daily = await fetchCosmyDayDaily();
  const date = kyivToday();
  const sourceDate = daily.date?.trim() || null;
  return {
    date,
    sourceDate,
    records: buildHoroscopeRecords(daily, date),
    publishable: sourceDate === null || sourceDate === date,
  };
}

/** Upsert one row per sign, keyed by (sign, date). */
export async function upsertHoroscopeRecords(records: ParsedHoroscope[]): Promise<void> {
  if (records.length === 0) return;
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
}

/**
 * Make sure today's rows exist, pulling the source at most once per cooldown
 * window per server instance. Never throws and returns whether new rows were
 * written; on source failure or a not-yet-published day the caller keeps
 * serving the fallback.
 */
export async function ensureTodayStored(): Promise<boolean> {
  const now = Date.now();
  if (now - lastSelfHealAttemptAt < SELF_HEAL_COOLDOWN_MS) return false;
  // Stamp before fetching so concurrent readers back off too.
  lastSelfHealAttemptAt = now;
  try {
    const { records, publishable } = await fetchTodayRecords();
    if (!publishable || records.length === 0) return false;
    await upsertHoroscopeRecords(records);
    return true;
  } catch {
    return false;
  }
}
