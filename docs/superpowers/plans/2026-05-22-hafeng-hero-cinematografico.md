# Hafeng Hero Cinematográfico — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o hero split-layout do `hafeng/index.html` por hero fullscreen com vídeo BG em loop, reveal de tipografia word-by-word via GSAP, e scroll indicator que some ao descer.

**Architecture:** Modificação única em `hafeng/index.html` — remove CSS/HTML do hero antigo, injeta novo CSS + HTML + GSAP CDN + script de animação. Nenhum arquivo novo criado.

**Tech Stack:** HTML/CSS/JS puro, GSAP 3.12.5 via CDN

---

## Files

- Modify: `hafeng/index.html`
  - Remove: CSS do hero split (`.hero-left`, `.hero-right`, `.hero-video-wrap`, `.hero-float-badge`, `.hero-announce`, `.hero-cta`, `.hero-cta-ghost`, regras `#hero` antigas)
  - Add: GSAP CDN `<script>` no `<head>`
  - Add: novo CSS do hero fullscreen + nav branco + word-clip + scroll indicator
  - Replace: bloco `<section id="hero">` completo
  - Replace: script de animação do hero (remove stagger fade-up antigo, adiciona GSAP timeline)
  - Modify: script de scroll — adiciona fade do scroll indicator

---

### Task 1: Adicionar GSAP CDN no `<head>`

**Files:**
- Modify: `hafeng/index.html` (antes do `</head>`, linha ~10)

- [ ] **Step 1: Inserir script GSAP antes de `</head>`**

Localizar a linha `</head>` e inserir antes:

```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
```

- [ ] **Step 2: Verificar no browser**

Abrir `hafeng/index.html` no browser. No console JS verificar:
```
typeof gsap  // deve retornar "object"
```

- [ ] **Step 3: Commit**

```bash
git add hafeng/index.html
git commit -m "feat: add GSAP 3.12.5 CDN to hafeng"
```

---

### Task 2: Remover CSS antigo do hero split-layout

**Files:**
- Modify: `hafeng/index.html` — remover bloco `/* ── HERO ── */` completo

- [ ] **Step 1: Localizar e deletar CSS do hero antigo**

No `<style>`, remover tudo entre os comentários `/* ── HERO ── */` e `/* ── FADE-UP ── */` (exclusive). Inclui os seguintes seletores:
`#hero`, `.hero-left`, `.hero-announce`, `.hero-title`, `.hero-sub`, `.hero-actions`, `.hero-cta`, `.hero-cta-ghost`, `.hero-right`, `.hero-video-wrap`, `.hero-right::after`, `.hero-float-badge`, `.hero-float-badge-num`, `.hero-float-badge-label`, e o `@media (max-width: 900px) { #hero ... }`.

Após remoção, o CSS de `/* ── FADE-UP ── */` deve vir direto após `/* ── NAV ── */`.

- [ ] **Step 2: Verificar — sem erros de console, resto da página intacto**

Abrir `hafeng/index.html`. Galeria, Sobre, Especialistas, Contato devem renderizar normalmente.

- [ ] **Step 3: Commit**

```bash
git add hafeng/index.html
git commit -m "refactor: remove hero split-layout CSS"
```

---

### Task 3: Adicionar CSS do hero cinematográfico + nav branco + scroll indicator

**Files:**
- Modify: `hafeng/index.html` — inserir bloco CSS após `/* ── NAV ── */` block e antes de `/* ── FADE-UP ── */`

- [ ] **Step 1: Inserir novo bloco CSS**

Após o bloco `/* ── NAV ── */` (após o `@media (max-width: 768px) { nav ... }`), inserir:

```css
    /* ── NAV sobre hero escuro ── */
    .nav-logo { color: rgba(255,255,255,0.92) !important; }
    .nav-links a { color: rgba(255,255,255,0.55) !important; }
    nav.light .nav-logo { color: var(--green-dark) !important; }
    nav.light .nav-links a { color: #444 !important; }
    .nav-cta {
      background: rgba(255,255,255,0.12) !important;
      border: 1px solid rgba(255,255,255,0.25) !important;
      color: #fff !important;
    }
    nav.light .nav-cta {
      background: var(--green-dark) !important;
      border-color: transparent !important;
      color: #fff !important;
    }

    /* ── HERO CINEMATOGRÁFICO ── */
    #hero {
      position: relative; width: 100%; height: 100vh;
      overflow: hidden;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center;
    }
    #hero-vid {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover; z-index: 0;
    }
    .hero-overlay {
      position: absolute; inset: 0; z-index: 1;
      background: linear-gradient(
        to bottom,
        rgba(5,15,8,0.55) 0%,
        rgba(5,15,8,0.28) 45%,
        rgba(5,15,8,0.52) 80%,
        rgba(5,15,8,0.82) 100%
      );
    }
    .hero-content {
      position: relative; z-index: 5;
      display: flex; flex-direction: column;
      align-items: center; padding: 0 24px;
    }
    .hero-tag {
      font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase;
      color: rgba(168,213,162,0.8); margin-bottom: 24px;
      opacity: 0;
    }
    .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.4rem, 6vw, 4.4rem);
      font-weight: 900; line-height: 1.12; color: #fff;
      letter-spacing: -0.01em; margin-bottom: 22px;
    }
    .hero-title em { font-style: italic; color: #A8D5A2; }
    .word-clip {
      display: inline-block;
      overflow: hidden;
      vertical-align: bottom;
      margin-right: 0.28em;
    }
    .word-clip:last-child { margin-right: 0; }
    .word-inner {
      display: inline-block;
      opacity: 0; transform: translateY(105%);
    }
    .hero-sub {
      font-size: 0.95rem; color: rgba(255,255,255,0.5);
      margin-bottom: 32px; opacity: 0;
    }
    .hero-actions {
      display: flex; gap: 14px; align-items: center;
      opacity: 0;
    }
    .hero-cta-primary {
      padding: 11px 26px; background: #4A9B5F; color: #fff;
      border-radius: 99px; font-size: 0.82rem; font-weight: 500;
      text-decoration: none; transition: background .2s;
    }
    .hero-cta-primary:hover { background: var(--green-mid); }
    .hero-cta-ghost {
      padding: 11px 26px; background: rgba(255,255,255,0.09);
      border: 1px solid rgba(255,255,255,0.22); color: rgba(255,255,255,0.78);
      border-radius: 99px; font-size: 0.82rem; text-decoration: none;
      transition: background .2s;
    }
    .hero-cta-ghost:hover { background: rgba(255,255,255,0.16); }

    /* ── SCROLL INDICATOR ── */
    #scroll-indicator {
      position: absolute; bottom: 32px;
      left: 50%; transform: translateX(-50%);
      z-index: 5; display: flex; flex-direction: column;
      align-items: center; gap: 10px;
      opacity: 0; transition: opacity 0.4s ease;
      pointer-events: none;
    }
    .scroll-text {
      font-size: 0.6rem; letter-spacing: 0.28em; text-transform: uppercase;
      color: rgba(255,255,255,0.3);
    }
    .scroll-arrow {
      width: 12px; height: 12px;
      border-right: 1.5px solid rgba(255,255,255,0.35);
      border-bottom: 1.5px solid rgba(255,255,255,0.35);
      transform: rotate(45deg);
      animation: arrowBounce 1.5s ease-in-out infinite;
    }
    @keyframes arrowBounce {
      0%, 100% { transform: rotate(45deg) translate(0,0); }
      50%       { transform: rotate(45deg) translate(3px,3px); }
    }
    @media (max-width: 768px) {
      .hero-title { font-size: clamp(2rem, 8vw, 3rem); }
      .hero-actions { flex-wrap: wrap; justify-content: center; }
    }
```

- [ ] **Step 2: Verificar — page não quebrou**

Abrir `hafeng/index.html`. Hero deve ocupar 100vh com fundo preto (vídeo ainda não está no HTML). Resto da página intacto.

- [ ] **Step 3: Commit**

```bash
git add hafeng/index.html
git commit -m "feat: add cinematic hero CSS and scroll indicator styles"
```

---

### Task 4: Substituir HTML do `<section id="hero">`

**Files:**
- Modify: `hafeng/index.html` — substituir bloco `<!-- HERO -->` completo

- [ ] **Step 1: Localizar e substituir o bloco hero**

Remover o bloco atual:
```html
  <!-- HERO -->
  <section id="hero">
    ...
  </section>
```

Substituir por:
```html
  <!-- HERO CINEMATOGRÁFICO -->
  <section id="hero">
    <video id="hero-vid" autoplay muted playsinline
      src="fotos/Ilha.mp4"></video>
    <div class="hero-overlay"></div>

    <div class="hero-content">
      <p class="hero-tag" id="hero-tag">Hidrosemeadura em Campinas</p>

      <h1 class="hero-title">
        <span class="word-clip"><span class="word-inner" id="hw1">Mais</span></span><!--
     --><span class="word-clip"><span class="word-inner" id="hw2">que</span></span><!--
     --><span class="word-clip"><span class="word-inner" id="hw3">plantar,</span></span><br>
        <span class="word-clip"><span class="word-inner" id="hw4">projetar</span></span><!--
     --><span class="word-clip"><span class="word-inner" id="hw5">a</span></span><!--
     --><span class="word-clip"><span class="word-inner" id="hw6"><em>natureza.</em></span></span>
      </h1>

      <p class="hero-sub" id="hero-sub">A tecnologia líquida que cobre o seu solo.</p>

      <div class="hero-actions" id="hero-actions">
        <a href="#contato" class="hero-cta-primary">✦ Solicite um Orçamento</a>
        <a href="#galeria" class="hero-cta-ghost">Conhecer Trabalhos →</a>
      </div>
    </div>

    <div id="scroll-indicator">
      <span class="scroll-text">Scroll</span>
      <div class="scroll-arrow"></div>
    </div>
  </section>
```

- [ ] **Step 2: Verificar — hero fullscreen com vídeo visível**

Abrir `hafeng/index.html`. Hero deve:
- Ocupar 100vh
- Vídeo `Ilha.mp4` tocando no fundo
- Texto visível mas sem animação ainda (opacity: 0 em `.hero-tag`, `.word-inner`, `.hero-sub`, `.hero-actions`)
- Nav com texto branco sobre o vídeo

- [ ] **Step 3: Commit**

```bash
git add hafeng/index.html
git commit -m "feat: replace hero HTML with fullscreen video layout"
```

---

### Task 5: Adicionar GSAP animation timeline + video swap + scroll indicator fade

**Files:**
- Modify: `hafeng/index.html` — dentro do `<script>` existente

- [ ] **Step 1: Remover código antigo do hero do script**

No `<script>` existente, remover:
```js
// ── HERO VIDEO: intro once → swap to loop ────────────────────────
const heroVid = document.getElementById('hero-vid');
heroVid.addEventListener('ended', () => { ... });

// Hero immediate stagger
document.querySelectorAll('#hero .fade-up').forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), 100 + i * 140);
});
```

- [ ] **Step 2: Adicionar novo script do hero**

Após a linha `// ── NAV ──` (ou no início do `<script>`), inserir:

```js
    // ── HERO CINEMATOGRÁFICO ──────────────────────────────────────────
    // Video: intro once → loop
    const heroVid = document.getElementById('hero-vid');
    heroVid.addEventListener('ended', () => {
      heroVid.src = 'fotos/ilha loop.mp4';
      heroVid.loop = true;
      heroVid.load();
      heroVid.play();
    });

    // GSAP timeline — tensão tipográfica
    // fromTo garante estado inicial correto independente de CSS
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo('#hero-tag',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 }, 0.3)

      // Silêncio até 1.1s — tensão antes da primeira palavra

      .fromTo('#hw1', { opacity: 0, y: '105%' }, { opacity: 1, y: '0%', duration: 0.6 }, 1.1)
      .fromTo('#hw2', { opacity: 0, y: '105%' }, { opacity: 1, y: '0%', duration: 0.6 }, 1.3)
      .fromTo('#hw3', { opacity: 0, y: '105%' }, { opacity: 1, y: '0%', duration: 0.6 }, 1.5)
      .fromTo('#hw4', { opacity: 0, y: '105%' }, { opacity: 1, y: '0%', duration: 0.6 }, 1.7)
      .fromTo('#hw5', { opacity: 0, y: '105%' }, { opacity: 1, y: '0%', duration: 0.6 }, 1.9)
      .fromTo('#hw6', { opacity: 0, y: '105%' }, { opacity: 1, y: '0%', duration: 0.6 }, 2.1)

      .fromTo('#hero-sub',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7 }, 2.55)

      .fromTo('#hero-actions',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7 }, 2.95)

      .fromTo('#scroll-indicator',
        { opacity: 0 },
        { opacity: 1, duration: 0.8 }, 3.5);

    // Scroll indicator: fade out on scroll
    const scrollIndicator = document.getElementById('scroll-indicator');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      scrollIndicator.style.opacity = Math.max(0, 1 - y / 100);
    }, { passive: true });
```

- [ ] **Step 3: Verificar animação completa**

Abrir `hafeng/index.html`. Verificar sequência:
1. 0s: tela com vídeo, textos invisíveis
2. 0.3s: tag "Hidrosemeadura em Campinas" sobe
3. 1.1s–2.1s: palavras do título sobem uma a uma (cada 0.2s)
4. 2.55s: subtítulo aparece
5. 2.95s: botões aparecem
6. 3.5s: "SCROLL" + chevron aparecem
7. Scroll: chevron some gradualmente ao descer

- [ ] **Step 4: Verificar video swap**

Aguardar o fim do `Ilha.mp4`. Vídeo deve trocar para `ilha loop.mp4` e loopar sem corte visível.

- [ ] **Step 5: Commit**

```bash
git add hafeng/index.html
git commit -m "feat: GSAP word reveal timeline and scroll indicator fade"
```

---

### Task 6: Verificação final e ajustes de nav

**Files:**
- Modify: `hafeng/index.html` (se necessário)

- [ ] **Step 1: Testar nav transition**

Abrir `hafeng/index.html`. Scrollar para além do hero:
- Sobre o hero: nav com texto branco, fundo transparente
- Após o hero: nav deve ter fundo branco/blur (classe `.light`)

Se as cores estiverem erradas, checar que o script de nav usa `heroH = document.getElementById('hero').offsetHeight` e não um valor fixo.

- [ ] **Step 2: Testar responsivo mobile**

Redimensionar browser para 375px. Verificar:
- Título legível (clamp 2rem mínimo)
- Botões não cortados (flex-wrap: wrap)
- Vídeo cobrindo o viewport

- [ ] **Step 3: Testar restante da página**

Scrollar pela página inteira. Verificar que galeria, sobre, especialistas, contato e footer não foram afetados.

- [ ] **Step 4: Commit final se houve ajustes**

```bash
git add hafeng/index.html
git commit -m "fix: hero nav colors and mobile adjustments"
```
