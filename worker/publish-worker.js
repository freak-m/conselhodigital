/**
 * Conselho Digital — Analytics + Publish Worker
 *
 * analytics.conselhodigital.com  → Analytics (público)
 *   GET  /?days=N   — Dados do Cloudflare Analytics + eventos KV
 *   POST /event     — Registra evento (wa, photo, time) no KV
 *
 * api.conselhodigital.com        → Publicação (protegido pelo Cloudflare Access)
 *   POST /publish   — Atualiza content.json no GitHub
 *   POST /upload    — Faz upload de imagem no GitHub
 *
 * Secrets: CF_API_TOKEN, CF_ZONE_ID, GITHUB_TOKEN
 * Text:    REPO  (ex: freak-m/conselhodigital)
 * KV:      analytics → namespace KVconselhodigital
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
    const host = url.hostname;

    if (request.method === 'OPTIONS') {
      return corsResp(null, 204, origin);
    }

    try {
      /* ── api.conselhodigital.com — PUBLICAÇÃO (protegido pelo Cloudflare Access) ── */
      if (host === 'api.conselhodigital.com') {
        // Rejeita requests fora do domínio autorizado
        if (!ALLOWED_ORIGINS.includes(origin)) {
          return new Response('NONE', { status: 200 });
        }
        // Zero Trust injeta este header após verificar o usuário.
        // O subdomínio api.conselhodigital.com deve estar na política do Access.
        if (!request.headers.get('Cf-Access-Jwt-Assertion')) {
          return corsResp(JSON.stringify({ error: 'Unauthorized' }), 401, origin);
        }
        if (request.method === 'POST' && path === '/publish') {
          return handlePublish(request, env, origin);
        }
        if (request.method === 'POST' && path === '/upload') {
          return handleUpload(request, env, origin);
        }
        return corsResp(JSON.stringify({ error: 'Not found' }), 404, origin);
      }

      /* ── analytics.conselhodigital.com — ANALYTICS (público) ── */
      if (request.method === 'GET' && path === '/') {
        if (!ALLOWED_ORIGINS.includes(origin)) {
          return new Response('NONE', { status: 200 });
        }
        const days = Math.min(parseInt(url.searchParams.get('days') || '30', 10), 365);
        const data = await fetchAnalytics(env, days);
        return corsResp(JSON.stringify(data), 200, origin);
      }

      if (request.method === 'POST' && path === '/event') {
        if (!ALLOWED_ORIGINS.includes(origin)) {
          return new Response('NONE', { status: 200 });
        }
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

/* ── PUBLICAÇÃO NO GITHUB ── */

async function handlePublish(request, env, origin) {
  try {
    const { content } = await request.json();
    const bodyStr = JSON.stringify(content, null, 2);
    const b64 = btoa(unescape(encodeURIComponent(bodyStr)));
    const api = `https://api.github.com/repos/${env.REPO}/contents/content.json`;
    const headers = ghHeaders(env);

    const getR = await fetch(api, { headers });
    if (!getR.ok) throw new Error('Não foi possível ler o repositório. Verifique GITHUB_TOKEN e REPO.');
    const { sha } = await getR.json();

    const putR = await fetch(api, {
      method: 'PUT', headers,
      body: JSON.stringify({ message: 'CMS: update content.json', content: b64, sha }),
    });
    if (!putR.ok) throw new Error(`GitHub retornou ${putR.status}`);

    return corsResp(JSON.stringify({ ok: true }), 200, origin);
  } catch (e) {
    return corsResp(JSON.stringify({ error: e.message }), 500, origin);
  }
}

async function handleUpload(request, env, origin) {
  try {
    const { filename, data } = await request.json();
    const api = `https://api.github.com/repos/${env.REPO}/contents/${filename}`;
    const headers = ghHeaders(env);

    let sha;
    const chk = await fetch(api, { headers });
    if (chk.ok) { const ex = await chk.json(); sha = ex.sha; }

    const body = { message: `CMS: upload ${filename}`, content: data };
    if (sha) body.sha = sha;

    const putR = await fetch(api, { method: 'PUT', headers, body: JSON.stringify(body) });
    if (!putR.ok) throw new Error(`GitHub retornou ${putR.status}`);

    return corsResp(JSON.stringify({ ok: true, url: `https://freak-m.github.io/conselhodigital/${filename}` }), 200, origin);
  } catch (e) {
    return corsResp(JSON.stringify({ error: e.message }), 500, origin);
  }
}

function ghHeaders(env) {
  return {
    Authorization: `token ${env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'ConselhoDigital-CMS',
  };
}

/* ── CLOUDFLARE GRAPHQL ANALYTICS ── */

async function fetchAnalytics(env, days) {
  if (!env.CF_API_TOKEN || !env.CF_ZONE_ID) {
    throw new Error('CF_API_TOKEN ou CF_ZONE_ID não configurados no Worker');
  }

  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - days);
  const since = start.toISOString().split('T')[0];
  const until = now.toISOString().split('T')[0];

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
  return { data: { viewer: { zones } }, events };
}

/* ── KV: EVENTOS CUSTOMIZADOS ── */

async function recordEvent(env, type, value) {
  if (!env.analytics) return;
  if (!['wa', 'photo', 'time'].includes(type)) return;

  if (type === 'time') {
    const [rawSum, rawCnt] = await Promise.all([
      env.analytics.get('time_sum'),
      env.analytics.get('time_count'),
    ]);
    const sum = parseFloat(rawSum || '0') + Math.max(0, parseFloat(value) || 0);
    const cnt = parseInt(rawCnt || '0', 10) + 1;
    await Promise.all([
      env.analytics.put('time_sum', String(sum)),
      env.analytics.put('time_count', String(cnt)),
    ]);
  } else {
    const key = `evt_${type}`;
    const cur = parseInt(await env.analytics.get(key) || '0', 10);
    await env.analytics.put(key, String(cur + 1));
  }
}

async function readEvents(env) {
  if (!env.analytics) return { wa: 0, photo: 0, avg_time: 0 };

  const [wa, photo, timeSum, timeCnt] = await Promise.all([
    env.analytics.get('evt_wa'),
    env.analytics.get('evt_photo'),
    env.analytics.get('time_sum'),
    env.analytics.get('time_count'),
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
      'Access-Control-Allow-Headers': 'Content-Type, Cf-Access-Jwt-Assertion',
    },
  });
}
