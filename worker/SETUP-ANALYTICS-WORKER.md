# Configuração do Worker de Analytics

Worker em `analytics.conselhodigital.com` que serve dados ao painel `/admin` (Dashboard).

Você já fez a maior parte. Estes são os passos finais:

---

## 1. Criar o Worker

1. Cloudflare → **Workers & Pages** → **Create** → **Create Worker**
2. Nome: `conselho-analytics`
3. Clique em **Deploy**
4. Depois **Edit code** → cole o conteúdo de `worker/analytics-worker.js`
5. **Deploy** novamente

---

## 2. Variáveis de ambiente

No Worker → **Settings** → **Variables and Secrets**:

| Nome | Tipo | Valor |
|---|---|---|
| `CF_API_TOKEN` | **Secret** | Token da Cloudflare com permissão **Zone:Analytics:Read** |
| `CF_ZONE_ID` | **Secret** | Zone ID de `conselhodigital.com` (painel CF → seu domínio → lado direito) |

> Você já criou esses secrets — confirme que os nomes estão exatos.

---

## 3. KV Binding

No Worker → **Bindings** → **Add binding** → **KV namespace**:

| Variable name | KV Namespace |
|---|---|
| `analytics` | `KVconselhodigital` |

> ✅ Já está configurado: o **Variable name** é `analytics` e aponta para o namespace `KVconselhodigital`.
> O código usa `env.analytics`.

---

## 4. Domínio personalizado

No Worker → **Settings** → **Domains & Routes** → **Add** → **Custom Domain**:

- Domínio: `analytics.conselhodigital.com`

Salve. O Cloudflare cuida do certificado automaticamente.

---

## 5. Token da Cloudflare (se ainda não criou)

1. Cloudflare → **My Profile** → **API Tokens** → **Create Token**
2. Use o template **"Read analytics"** ou crie personalizado:
   - **Permissions:** Zone → Analytics → Read
   - **Zone Resources:** Include → Specific zone → `conselhodigital.com`
3. Copie o token e cole no secret `CF_API_TOKEN` do Worker

---

## Como funciona

| Endpoint | Quem chama | O que faz |
|---|---|---|
| `GET /?days=30` | Painel Admin (Dashboard) | Retorna dados do CF Analytics + contadores KV |
| `POST /event` | Landing page (`index.html`) | Registra clique no WhatsApp, visualização de foto, tempo na página |

---

## Pronto!

No painel Admin → Dashboard → cole `https://analytics.conselhodigital.com/` no campo
"URL do Worker de Analytics" → clique **Importar dados**.
