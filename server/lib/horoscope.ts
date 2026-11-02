// Horoscope source helpers. Pure logic lives here (no database access), so it
// is unit-testable. `sync-horoscope` fetches up to 12 rows per run from the
// CosmyDay daily endpoint; the row shape matches the `horoscopes` table.
import { z } from "zod";

export const ZODIAC_SLUGS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

export type ZodiacSlug = (typeof ZODIAC_SLUGS)[number];

// CosmyDay returns title-case English names ("Virgo"); we store slugs.
function toSlug(signName: string): ZodiacSlug | null {
  const slug = signName.trim().toLowerCase() as ZodiacSlug;
  return (ZODIAC_SLUGS as readonly string[]).includes(slug) ? slug : null;
}

export function kyivToday(): string {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function stripMarkup(value: string): string {
  return value.replace(/\*\*/g, "").replace(/^[*✨]+/, "").trim();
}

/**
 * Parse a CosmyDay reading into labeled sections. Headings arrive as lines
 * like "🪐 Overview: …" (text after the colon) or as a heading-only line whose
 * body follows; everything before the first section is the title line.
 */
export function parseCosmyDayContent(content: string): {
  overview: string;
  work: string;
  love: string;
  mood: string;
  advice: string;
} {
  const sections = { overview: "", work: "", love: "", mood: "", advice: "" };
  const HEADINGS: Array<[keyof typeof sections, RegExp]> = [
    ["overview", /Overview\s*:\s*(.*)$/iu],
    ["work", /Work\s*(?:&|and)\s*goals\s*:\s*(.*)$/iu],
    ["love", /Relationships\s*:\s*(.*)$/iu],
    ["mood", /Energy\s*(?:&|and)\s*mood\s*:\s*(.*)$/iu],
    ["advice", /Today(?:'s|’s)\s*(?:tip|advice)\s*:\s*(.*)$/iu],
  ];

  let current: keyof typeof sections | null = null;
  for (const rawLine of content.split(/\r?\n/)) {
    const line = stripMarkup(rawLine).replace(/\s+/g, " ").trim();
    if (!line) continue;

    const heading = HEADINGS.find(([, re]) => re.test(line));
    if (heading) {
      const [key, re] = heading;
      current = key;
      const rest = line.match(re)![1]?.trim() ?? "";
      if (rest) sections[key] = sections[key] ? `${sections[key]}\n${rest}` : rest;
      continue;
    }
    if (current) {
      sections[current] = `${sections[current]}\n${line}`;
    }
  }

  for (const key of Object.keys(sections) as Array<keyof typeof sections>) {
    sections[key] = sections[key].trim();
  }
  return sections;
}

// --- Deterministic fun-of-the-day extras -----------------------------------
// Lucky numbers/colors/compatibility are entertainment fillers; generate them
// deterministically from (sign, date) so a re-sync never rewrites them.

const LUCKY_COLORS = [
  "Gold",
  "Mustard Yellow",
  "Forest Green",
  "Sea Green",
  "Olive",
  "Terracotta",
  "Coral",
  "Cobalt Blue",
  "Lavender",
  "Plum",
  "Emerald",
  "Charcoal",
] as const;

const ELEMENTS = {
  fire: ["aries", "leo", "sagittarius"],
  earth: ["taurus", "virgo", "capricorn"],
  air: ["gemini", "libra", "aquarius"],
  water: ["cancer", "scorpio", "pisces"],
} as const satisfies Record<string, readonly ZodiacSlug[]>;

const OPPOSITE: Record<ZodiacSlug, ZodiacSlug> = {
  aries: "libra",
  libra: "aries",
  taurus: "scorpio",
  scorpio: "taurus",
  gemini: "sagittarius",
  sagittarius: "gemini",
  cancer: "capricorn",
  capricorn: "cancer",
  leo: "aquarius",
  aquarius: "leo",
  virgo: "pisces",
  pisces: "virgo",
};

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededPick<T>(items: readonly T[], seed: string): T {
  return items[hashSeed(seed) % items.length]!;
}

const signForElement = new Map<ZodiacSlug, keyof typeof ELEMENTS>();
for (const [element, members] of Object.entries(ELEMENTS)) {
  for (const member of members) signForElement.set(member, element as keyof typeof ELEMENTS);
}

export function luckyExtrasFor(sign: ZodiacSlug, date: string): {
  luckyNumber: number;
  luckyColor: string;
  compatibility: ZodiacSlug;
} {
  const element = signForElement.get(sign)!;
  const candidates = ELEMENTS[element]
    .filter((s) => s !== sign)
    .concat(OPPOSITE[sign]);
  return {
    luckyNumber: (hashSeed(`${sign}:${date}:number`) % 99) + 1,
    luckyColor: seededPick(LUCKY_COLORS, `${sign}:${date}:color`),
    compatibility: seededPick(candidates, `${sign}:${date}:compat`),
  };
}

// --- CosmyDay source --------------------------------------------------------
const COSMYDAY_DAILY_URL = "https://api.cosmyday.com/content/daily";
const SOURCE_NAME = "cosmyday";
const FETCH_TIMEOUT_MS = 15_000;

export const horoscopeRowSchema = z.object({
  id: z.string(),
  sign: z.string(),
  date: z.string(),
  language: z.string(),
  overview: z.string(),
  work: z.string(),
  love: z.string(),
  mood: z.string(),
  advice: z.string(),
  closing: z.string(),
  leadEvent: z.string(),
  luckyNumber: z.number().int().nullable(),
  luckyColor: z.string().nullable(),
  compatibility: z.string().nullable(),
  relevanceScore: z.number().int().nullable(),
  source: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type HoroscopeRow = z.infer<typeof horoscopeRowSchema>;

type CosmyDayDaily = {
  date?: string;
  horoscopes?: Record<
    string,
    {
      sign?: string;
      content?: string;
      closing?: string;
      lead_event?: string;
      relevance_score?: number;
    }
  >;
};

type ParsedHoroscope = {
  sign: ZodiacSlug;
  date: string; // publication day we store the reading under, YYYY-MM-DD
  overview: string;
  work: string;
  love: string;
  mood: string;
  advice: string;
  closing: string;
  leadEvent: string;
  relevanceScore: number | null;
  luckyNumber: number;
  luckyColor: string;
  compatibility: ZodiacSlug;
  source: string;
};

export async function fetchCosmyDayDaily(): Promise<CosmyDayDaily> {
  const res = await fetch(COSMYDAY_DAILY_URL, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) {
    throw new Error(`CosmyDay API responded ${res.status}`);
  }
  return (await res.json()) as CosmyDayDaily;
}

export function buildHoroscopeRecords(
  daily: CosmyDayDaily,
  publishDate: string,
): ParsedHoroscope[] {
  const records: ParsedHoroscope[] = [];
  for (const entry of Object.values(daily.horoscopes ?? {})) {
    const sign = toSlug(entry.sign ?? "");
    if (!sign || !entry.content) continue;
    const extras = luckyExtrasFor(sign, publishDate);
    records.push({
      sign,
      date: publishDate,
      ...parseCosmyDayContent(entry.content),
      closing: stripMarkup(entry.closing ?? ""),
      leadEvent: (entry.lead_event ?? "").trim(),
      relevanceScore: typeof entry.relevance_score === "number" ? entry.relevance_score : null,
      luckyNumber: extras.luckyNumber,
      luckyColor: extras.luckyColor,
      compatibility: extras.compatibility,
      source: SOURCE_NAME,
    });
  }
  return records;
}
