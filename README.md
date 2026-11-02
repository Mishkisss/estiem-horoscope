# ESTIEM Daily Horoscope

The ESTIEM Daily Horoscope website — a Ukrainian-language front end (home,
zodiac signs, seasons, about) backed by a horoscope database. Horoscope texts
are synced daily from the [CosmyDay](https://api.cosmyday.com) source into the
app's PostgreSQL database and served through public read actions; the source
content is currently in English.

## Develop locally

```bash
cp .env.example .env
corepack enable
pnpm install
pnpm dev
```

`.env.example` sets `AUTH_DISABLED=true` as a commented-out option; uncomment it
to skip sign-in while developing. The local database is PGlite at `data/pglite`
(no setup needed); production needs a `DATABASE_URL`.

## Backend

- **Table:** `horoscopes` (`drizzle/schema.ts`) — one row per sign per day.
- **Source:** `server/lib/horoscope.ts` — CosmyDay daily fetch and parsing.
- **Actions:**
  | Action | Method | Who can call it | What it does |
  | --- | --- | --- | --- |
  | `sync-horoscope` | POST | Anyone; overwriting requires `HOROSCOPE_SYNC_TOKEN` env + matching `token` argument | Fetches today's (Kyiv time) readings from CosmyDay and upserts all 12 rows |
  | `get-today-horoscope` | GET | Public (no session) | Today's reading for all 12 signs, falls back to the most recent stored day |
  | `get-sign-horoscope` | GET | Public (no session) | One sign's reading, by `sign` slug (e.g. `cancer`) and optional `date` |

All three declare `requiresAuth: false` — the site works without sign-in, cron
machines included. Content protection for writes comes from the
`HOROSCOPE_SYNC_TOKEN` gate inside `sync-horoscope`.

Classic `defineAction` surface → endpoint `/_agent-native/actions/:name`. The two
GET actions are public reads: they are declared with `requiresAuth: false`, so
the site works without a sign-in and the endpoints answer without a session
cookie (verified with `curl`). `sync-horoscope` stays session-protected.

### Daily sync

Run it once a day (CosmyDay regenerates around 03:03 UTC — Kyiv morning), e.g.
from a cron or GitHub Action against your deployed site:

```bash
curl -X POST https://<your-site>/_agent-native/actions/sync-horoscope \
  -H "Content-Type: application/json" \
  -d '{"token":"<HOROSCOPE_SYNC_TOKEN>"}'
```

or locally: `pnpm action sync-horoscope`. Set `HOROSCOPE_SYNC_TOKEN` in the
deployment so only your cron can rewrite content; leave it unset in dev.

Sources verified alive 2026-11: `api.cosmyday.com` (primary, free, no key),
`freehoroscopeapi.com` (text fallback). Content is English-only for now;
Ukrainian texts can be added later by machine translation or an admin import.

## Project layout

- `app/`: routes and UI components
- `actions/`: operations shared by the UI and the app's agent
- `server/`: server plugins, database client, horoscope source library
- `drizzle/`: schema and migrations; start with `drizzle/START_HERE.md`

## Credits

Horoscope content courtesy of [CosmyDay](https://cosmyday.com) (free astrology
API); daily sync keeps one row per sign per day.
