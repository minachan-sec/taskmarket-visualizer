# Taskmarket — The Market, Live

A public, hosted, live dashboard of Taskmarket market data: headline numbers,
activity over time, tasks by mode and status, an activity heatmap, distinct
posters per week, and the live activity feed — for both Tempo (chainId 4217)
and Base (chainId 8453).

Every number is reproduced from the public Taskmarket API. Data is fetched on
the server (the API does not allow browser calls from other origins), cached
for at least 60 seconds, and refreshed at least hourly. The page shows a
visible "data as of" time and a methods note.

## Deploy (one command)

You need a Cloudflare account and Wrangler:

```
npx wrangler deploy
```

That is the whole deploy. The Worker serves the page and its own `/api/*`
endpoints; there is no database, no build step, and no environment variable
to set.

## Stack

- Cloudflare Worker (single deployment unit): `worker.js` (routing,
  server-side fetch + Cache API caching, distinct-posters computation),
  `page.js` (the self-contained dashboard: no external scripts, no tracking,
  no wallet), `og.js` (share image, base64 PNG generated offline).
- Data source: `https://api.taskmarket.dev` — `/api/market/stats`,
  `/api/stats/breakdowns`, `/api/stats/platform-time-series`,
  `/api/stats/activity-heatmap`, `/api/stats/activity-feed`, `/api/tasks`.
- Refresh: per-endpoint server cache of 60–900 seconds; the live feed view
  re-requests every 60 seconds in the browser (served from the server cache).

## Rules this build follows

- Read-only. No wallet connection. No analytics or tracking.
- No names or identities attached to wallet addresses; posters are counted,
  never labelled.
- Every displayed number can be reproduced from the API responses.
- Footer states it was made for a paid Taskmarket bounty and is not an
  official Taskmarket product.

## Licence

MIT — see `LICENSE`.
