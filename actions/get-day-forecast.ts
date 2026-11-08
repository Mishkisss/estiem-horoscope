// Public read of the source's general forecast for a calendar day. The
// per-sign daily batch can be unpublished (or the source briefly down) while
// the week-ahead batch still covers today, so the home page can always show a
// current, honestly-labeled "Forecast of the day" block.
import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { getDayForecast } from "../server/lib/day-forecast.ts";
import { kyivToday } from "../server/lib/horoscope.ts";

export default defineAction({
  description:
    "Read the general (not per-sign) forecast for a calendar day, sourced from the CosmyDay week-ahead batch. Defaults to today in Europe/Kyiv.",
  schema: z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
      .optional()
      .describe("Calendar day (YYYY-MM-DD); defaults to today in Europe/Kyiv"),
  }),
  http: { method: "GET" },
  // Same public-read contract as the other site GETs: no session required.
  requiresAuth: false,
  outputSchema: z.object({
    date: z.string(),
    source: z.string(),
    forecast: z
      .object({
        date: z.string(),
        weekday: z.string().nullable(),
        energyLevel: z.string().nullable(),
        moon: z.string().nullable(),
        content: z.string(),
        generatedAt: z.string().nullable(),
      })
      .nullable(),
  }),
  run: async ({ date }) => {
    const requested = date ?? kyivToday();
    const forecast = await getDayForecast(requested);
    return { date: requested, source: "cosmyday", forecast };
  },
});
