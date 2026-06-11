/**
 * Conselho Digital — Analytics Worker
 * Rota: analytics.conselhodigital.com
 *
 * GET  /?days=N    — Retorna dados do Cloudflare Analytics + eventos KV
 * POST /event      — Registra evento da landing page (wa, photo, time) no KV
 *
 * ── Variáveis de ambiente (Settings → Variables and Secrets) ──
 *   CF_API_TOKEN  (secret) — Cloudflare API token com permissão Zone:Analytics:Read
 *   CF_ZONE_ID    (secret) — Zone ID de conselhodigital.com
 *
 * ── KV Binding ──
 *   KVconselhodigital — KV namespace para eventos customizados (wa, photo, time)
 *
 * ── CORS ──
 *   Aceita requisições de conselhodigital.com (admin e landing page)
 */

const ALLOWED_ORIGINS = [
  'https://conselhodigital.com',
  'https://www.conselhodigital.com',
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const path = url.pathname.replace(/\/$/, '') || '/';

    if (request.method === 'OPTIONS') {
      return corsResp(null, 200, origin);
    }

    try {
      if (request.method === 'GET' && path === '/') {
        const days = Math.min(parseInt(url.searchParams.get('days') || '30', 10), 365);
        const data = await fetchAnalytics(env, days);
        return corsResp(JSON.stringify(data), 200, origin);
      }

      if (request.method === 'POST' && path === '/event') {
        const body = await request.json();
        await recordEvent(env, body.type, body.value);
        return corsResp(JSON.stringify({ ok: true }), 200, origin);
      }

      return corsResp(JSON.stringify({ error: 'Not found' }), 404, origin);
    } catch (e) {
      return corsResp(JSON.stringify({ error: e.message || String(e) }), 500, origin);
    }
  },
};

/* ── Cloudflare GraphQL Analytics ── */
async function fetchAnalytics(env, days) {
  if (!env.CF_API_TOKEN || !env.CF_ZONE_ID) {
    throw new Error('CF_API_TOKEN ou CF_ZONE_ID não configurados no Worker');
  }

  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - days);
  const since = start.toISOString().split('T')[0];
  const until = now.toISOString().split('T')[0];

  // Dois aliases para httpRequestsAdaptiveGroups: um por país, outro por página
  const query = `{
    viewer {
      zones(filter: { zoneTag: "${env.CF_ZONE_ID}" }) {
        httpRequests1dGroups(
          limit: 365
          filter: { date_geq: "${since}", date_leq: "${until}" }
          orderBy: [date_ASC]
        ) {
          dimensions { date }
          sum { requests pageViews bytes }
          uniq { uniques }
        }
        byCountry: httpRequestsAdaptiveGroups(
          limit: 20
          filter: { date_geq: "${since}", date_leq: "${until}" }
          orderBy: [count_DESC]
        ) {
          dimensions { clientCountryName }
          count
        }
        byPage: httpRequestsAdaptiveGroups(
          limit: 20
          filter: { date_geq: "${since}", date_leq: "${until}" }
          orderBy: [count_DESC]
        ) {
          dimensions { clientRequestPath }
          count
        }
      }
    }
  }`;

  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) throw new Error(`Cloudflare GraphQL HTTP ${res.status}`);

  const cfJson = await res.json();
  if (cfJson.errors?.length) throw new Error(cfJson.errors[0].message);

  // Remapeia os aliases para os nomes que o painel admin espera
  const rawZones = cfJson.data?.viewer?.zones || [];
  const zones = rawZones.map(zone => ({
    httpRequests1dGroups: zone.httpRequests1dGroups || [],
    httpRequestsAdaptiveGroups: zone.byCountry || [],
    webAnalyticsRumPageloadEventsAdaptiveGroups: (zone.byPage || []).map(g => ({
      dimensions: { url: g.dimensions?.clientRequestPath || '/' },
      count: g.count,
    })),
  }));

  const events = await readEvents(env);

  return {
    data: { viewer: { zones } },
    events,
  };
}

/* ── KV: eventos customizados da landing page ── */
async function recordEvent(env, type, value) {
  if (!env.KVconselhodigital) return;
  if (!['wa', 'photo', 'time'].includes(type)) return;

  if (type === 'time') {
    // Guarda soma e contagem para calcular média
    const [rawSum, rawCnt] = await Promise.all([
      env.KVconselhodigital.get('time_sum'),
      env.KVconselhodigital.get('time_count'),
    ]);
    const sum = parseFloat(rawSum || '0') + Math.max(0, parseFloat(value) || 0);
    const cnt = parseInt(rawCnt || '0', 10) + 1;
    await Promise.all([
      env.KVconselhodigital.put('time_sum', String(sum)),
      env.KVconselhodigital.put('time_count', String(cnt)),
    ]);
  } else {
    const key = `evt_${type}`;
    const cur = parseInt(await env.KVconselhodigital.get(key) || '0', 10);
    await env.KVconselhodigital.put(key, String(cur + 1));
  }
}

async function readEvents(env) {
  if (!env.KVconselhodigital) return { wa: 0, photo: 0, avg_time: 0 };

  const [wa, photo, timeSum, timeCnt] = await Promise.all([
    env.KVconselhodigital.get('evt_wa'),
    env.KVconselhodigital.get('evt_photo'),
    env.KVconselhodigital.get('time_sum'),
    env.KVconselhodigital.get('time_count'),
  ]);

  const cnt = parseInt(timeCnt || '0', 10);
  const avg = cnt > 0 ? Math.round(parseFloat(timeSum || '0') / cnt) : 0;

  return {
    wa: parseInt(wa || '0', 10),
    photo: parseInt(photo || '0', 10),
    avg_time: avg,
  };
}

/* ── CORS ── */
function corsResp(body, status, origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allow,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
