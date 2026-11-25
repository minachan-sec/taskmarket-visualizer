// Taskmarket Live Market Visualizer — Cloudflare Worker
// Server-side fetch + cache of the public Taskmarket API (the API does not
// allow browser calls from other origins), serving a single-page dashboard.
// MIT licence. Made for a paid Taskmarket bounty; not an official product.

import { HTML } from "./page.js";
import { OG_PNG_BASE64 } from "./og.js";

const API = "https://api.taskmarket.dev";
const CHAINS = { tempo: 4217, base: 8453 };

function jsonResponse(obj, status = 200, cacheControl = "public, max-age=60") {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": cacheControl },
  });
}

async function cachedJson(ctx, cacheKey, ttlSeconds, producer) {
  const cache = caches.default;
  const key = new Request(cacheKey);
  let hit = await cache.match(key);
  if (hit) return hit;
  const body = await producer();
  const res = new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${ttlSeconds}`,
    },
  });
  ctx.waitUntil(cache.put(key, res.clone()));
  return res;
}

async function upstream(path) {
  const r = await fetch(API + path, { headers: { accept: "application/json" } });
  if (!r.ok) throw new Error("upstream " + r.status + " " + path);
  return r.json();
}

function chainId(url) {
  const c = (url.searchParams.get("chain") || "tempo").toLowerCase();
  return CHAINS[c] || CHAINS.tempo;
}

// Distinct task posters per ISO week, computed from the public task list.
// Pages through newest tasks (max 10 pages x 100) per chain.
async function computePosters(chain) {
  const byWeek = new Map(); // weekStartISO -> { posters:Set, tasks:n }
  const perPoster = new Map();
  let cursor = null;
  let sampled = 0;
  const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 7 * 16; // 16 weeks
  for (let page = 0; page < 10; page++) {
    const q = new URLSearchParams({ chainId: String(chain), sort: "newest", limit: "100" });
    if (cursor) q.set("cursor", cursor);
    const data = await upstream("/api/tasks?" + q.toString());
    const tasks = data.tasks || [];
    if (!tasks.length) break;
    let oldest = Infinity;
    for (const t of tasks) {
      const ts = Date.parse(t.createdAt || "");
      if (!isFinite(ts)) continue;
      oldest = Math.min(oldest, ts);
      sampled++;
      perPoster.set(t.requester, (perPoster.get(t.requester) || 0) + 1);
      const d = new Date(ts);
      const day = (d.getUTCDay() + 6) % 7; // Monday = 0
      const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day));
      const wk = monday.toISOString().slice(0, 10);
      if (!byWeek.has(wk)) byWeek.set(wk, { posters: new Set(), tasks: 0 });
      const rec = byWeek.get(wk);
      rec.posters.add(t.requester);
      rec.tasks++;
    }
    if (!data.hasMore || !data.nextCursor || oldest < cutoff) break;
    cursor = data.nextCursor;
  }
  const weeks = [...byWeek.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([week, v]) => ({ week, posters: v.posters.size, tasks: v.tasks }));
  const counts = [...perPoster.values()].sort((a, b) => b - a);
  const top5 = counts.slice(0, 5).reduce((a, b) => a + b, 0);
  return {
    weeks,
    sampledTasks: sampled,
    distinctPostersInSample: perPoster.size,
    top5PosterSharePct: sampled ? Math.round((top5 / sampled) * 1000) / 10 : 0,
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const p = url.pathname;

    if (p === "/" || p === "/index.html") {
      return new Response(HTML, {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" },
      });
    }
    if (p === "/og.png") {
      const bytes = Uint8Array.from(atob(OG_PNG_BASE64), (c) => c.charCodeAt(0));
      return new Response(bytes, {
        headers: { "content-type": "image/png", "cache-control": "public, max-age=86400" },
      });
    }
    if (!p.startsWith("/api/")) return new Response("Not found", { status: 404 });

    const chain = chainId(url);
    try {
      if (p === "/api/stats") {
        return await cachedJson(ctx, `https://cache.local/stats/${chain}`, 120, async () => ({
          dataAsOf: new Date().toISOString(),
          data: await upstream(`/api/market/stats?chainId=${chain}`),
        }));
      }
      if (p === "/api/breakdowns") {
        return await cachedJson(ctx, `https://cache.local/breakdowns/${chain}`, 300, async () => ({
          dataAsOf: new Date().toISOString(),
          data: await upstream(`/api/stats/breakdowns?chainId=${chain}`),
        }));
      }
      if (p === "/api/series") {
        const range = ["7d", "30d", "90d", "all"].includes(url.searchParams.get("range")) ? url.searchParams.get("range") : "30d";
        const bucket = url.searchParams.get("bucket") === "week" ? "week" : "day";
        return await cachedJson(ctx, `https://cache.local/series/${chain}/${range}/${bucket}`, 300, async () => ({
          dataAsOf: new Date().toISOString(),
          data: await upstream(`/api/stats/platform-time-series?chainId=${chain}&range=${range}&bucket=${bucket}`),
        }));
      }
      if (p === "/api/heatmap") {
        const range = ["7d", "30d", "90d", "all"].includes(url.searchParams.get("range")) ? url.searchParams.get("range") : "30d";
        const dimension = url.searchParams.get("dimension") === "hourOfWeek" ? "hourOfWeek" : "mode";
        return await cachedJson(ctx, `https://cache.local/heatmap/${chain}/${range}/${dimension}`, 300, async () => ({
          dataAsOf: new Date().toISOString(),
          data: await upstream(`/api/stats/activity-heatmap?chainId=${chain}&range=${range}&dimension=${dimension}`),
        }));
      }
      if (p === "/api/feed") {
        return await cachedJson(ctx, `https://cache.local/feed/${chain}`, 60, async () => ({
          dataAsOf: new Date().toISOString(),
          data: await upstream(`/api/stats/activity-feed?chainId=${chain}&limit=20`),
        }));
      }
      if (p === "/api/posters") {
        return await cachedJson(ctx, `https://cache.local/posters/${chain}`, 900, async () => ({
          dataAsOf: new Date().toISOString(),
          data: await computePosters(chain),
        }));
      }
      return jsonResponse({ error: "unknown endpoint" }, 404);
    } catch (e) {
      return jsonResponse({ error: String(e && e.message || e) }, 502);
    }
  },
};
