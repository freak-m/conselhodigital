# Configuração do Worker de Publicação

O painel `/admin` abre direto após o login do **Cloudflare Access** (código por e-mail).
Para que o botão **Publicar** funcione, é preciso criar um **Cloudflare Worker** que guarda
o token do GitHub em segredo e faz os commits por você. Nenhum token fica no navegador
nem no código público.

Faça isto **uma vez**:

---

## 1. Criar o token do GitHub

1. Acesse https://github.com/settings/tokens?type=beta (Fine-grained tokens)
2. **Generate new token**
3. Em **Repository access** → **Only select repositories** → `freak-m/conselhodigital`
4. Em **Permissions** → **Repository permissions** → **Contents** → **Read and write**
5. Gere e **copie** o token (começa com `github_pat_...`)

---

## 2. Criar o Worker

1. No painel da Cloudflare → **Workers & Pages** → **Create** → **Create Worker**
2. Dê o nome `conselho-cms`
3. Clique em **Deploy** (com o código padrão mesmo)
4. Depois **Edit code** e cole o conteúdo de `worker/publish-worker.js` deste repositório
5. **Deploy** novamente

---

## 3. Configurar as variáveis

No Worker → **Settings** → **Variables and Secrets** → **Add**:

| Nome | Tipo | Valor |
|---|---|---|
| `GITHUB_TOKEN` | **Secret** (encrypt) | o token do passo 1 |
| `REPO` | Text | `freak-m/conselhodigital` |
| `ALLOWED_EMAIL` | Text | `Felipepmoraes1a@gmail.com` |

Salve.

---

## 4. Apontar a rota `/admin-api`

No Worker → **Settings** → **Domains & Routes** → **Add** → **Route**:

- **Route:** `conselhodigital.com/admin-api/*`
- **Zone:** `conselhodigital.com`

Salve.

---

## 5. Proteger o Worker com o MESMO Access

No **Zero Trust** → **Access** → **Applications** → edite a aplicação **Admin CMS**
(ou crie uma nova self-hosted) e garanta que o caminho `admin-api` também esteja coberto:

- Adicione um destino: **Domain** `conselhodigital.com` · **Path** `admin-api`
- Use a mesma política **"Só eu"** (seu e-mail)

Assim, tanto `/admin` quanto `/admin-api` exigem o login por e-mail, e o Cloudflare
injeta o cabeçalho de identidade que o Worker confere.

---

## Pronto!

Agora ao abrir `conselhodigital.com/admin`:

1. Cloudflare pede seu e-mail e envia o código
2. Você confirma → o painel abre direto
3. Edita o conteúdo com preview ao vivo
4. Clica em **Publicar** → o Worker faz o commit no GitHub → o site atualiza em ~30s

Enquanto o Worker não estiver configurado, o painel **abre e mostra tudo normalmente**,
mas o botão Publicar exibirá um aviso de erro.
