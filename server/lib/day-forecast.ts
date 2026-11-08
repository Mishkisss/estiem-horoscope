// Read-side access to the source's general day forecast (the week-ahead
// batch), used by the public `get-day-forecast` action to power the
// "Forecast of the day" block on the home page.
//
// The source is a third-party API, so the result is cached per server
// instance: one upstream fetch per TTL window no matter how many readers
// arrive, and a failed fetch keeps serving the last good payload for the
// same day instead of dropping the block. Nothing here writes to the
// database — the forecast is read-only content.
import {
  fetchCosmyDayWeekAhead,
  kyivToday,
  pickDayForecast,
  type DayForecast,
} from "./horoscope.ts";

// The source regenerates the batch once a day; 10 minutes keeps the block
// fresh across the day rollover without hammering the API.
const FORECAST_TTL_MS = 10 * 60_000;

type CacheEntry = {
  at: number;
  date: string;
  forecast: DayForecast | null;
};

let cache: CacheEntry | null = null;

/** Today's (Europe/Kyiv) general day forecast, or null when the source has none. */
export async function getDayForecast(date = kyivToday()): Promise<DayForecast | null> {
  const now = Date.now();
  if (cache && cache.date === date && now - cache.at < FORECAST_TTL_MS) {
    return cache.forecast;
  }

  try {
    const forecast = pickDayForecast(await fetchCosmyDayWeekAhead(), date);
    cache = { at: now, date, forecast };
    return forecast;
  } catch {
    // Source unreachable: keep the previous payload when it is still for the
    // requested day, otherwise report "no forecast" for this read.
    if (cache && cache.date === date) return cache.forecast;
    return null;
  }
}
