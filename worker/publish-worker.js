/**
 * Conselho Digital — CMS Publish Worker
 *
 * Recebe as alterações do painel /admin e faz commit no GitHub usando um
 * token guardado como SECRET no Worker (nunca exposto no navegador ou no código).
 *
 * Segurança: este Worker fica ATRÁS do mesmo Cloudflare Access que protege
 * /admin. O Cloudflare injeta o cabeçalho "Cf-Access-Authenticated-User-Email"
 * em toda requisição autenticada — e ele não pode ser falsificado por quem
 * está fora do Access. O Worker confere se esse e-mail é o permitido.
 *
 * ── Variáveis de ambiente (Settings → Variables and Secrets) ──
 *   GITHUB_TOKEN   (secret)  — Personal Access Token com permissão Contents: read & write
 *   REPO           (text)    — "freak-m/conselhodigital"
 *   ALLOWED_EMAIL  (text)    — "Felipepmoraes1a@gmail.com"
 *
 * ── Rota (Workers Routes) ──
 *   conselhodigital.com/admin-api/*
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/admin-api/, '');

    // CORS / preflight (mesmo domínio, mas deixamos seguro)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    // ── Verificação de identidade via Cloudflare Access ──
    const email = request.headers.get('Cf-Access-Authenticated-User-Email');
    if (!email || (env.ALLOWED_EMAIL && email.toLowerCase() !== env.ALLOWED_EMAIL.toLowerCase())) {
      return json({ error: 'Não autorizado' }, 403);
    }

    const REPO  = env.REPO || 'freak-m/conselhodigital';
    const TOKEN = env.GITHUB_TOKEN;
    if (!TOKEN) return json({ error: 'Worker sem GITHUB_TOKEN configurado' }, 500);

    try {
      if (path === '/publish' && request.method === 'POST') {
        const { content } = await request.json();
        const body = JSON.stringify(content, null, 2);
        await commitFile(REPO, TOKEN, 'content.json', body, 'Update content via Admin CMS', email);
        return json({ ok: true });
      }

      if (path === '/upload' && request.method === 'POST') {
        const { filename, content } = await request.json(); // content = base64
        await commitFile(REPO, TOKEN, filename, content, `Upload image ${filename}`, email, true);
        return json({ ok: true, url: `https://freak-m.github.io/conselhodigital/${filename}` });
      }

      return json({ error: 'Rota não encontrada' }, 404);
    } catch (e) {
      return json({ error: String(e.message || e) }, 500);
    }
  }
};

/* ── Helpers ── */
async function commitFile(repo, token, filepath, content, message, email, alreadyBase64 = false) {
  const api = `https://api.github.com/repos/${repo}/contents/${filepath}`;
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'conselho-cms-worker',
    'Content-Type': 'application/json',
  };

  // Busca o SHA atual (se o arquivo já existe)
  let sha;
  const getRes = await fetch(api, { headers });
  if (getRes.ok) {
    const data = await getRes.json();
    sha = data.sha;
  }

  const encoded = alreadyBase64 ? content : b64(content);
  const putRes = await fetch(api, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `${message} (por ${email})`,
      content: encoded,
      sha,
    }),
  });
  if (!putRes.ok) {
    throw new Error(`GitHub ${putRes.status}: ${await putRes.text()}`);
  }
}

function b64(str) {
  // UTF-8 safe base64
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach(b => bin += String.fromCharCode(b));
  return btoa(bin);
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': 'https://conselhodigital.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  };
}
