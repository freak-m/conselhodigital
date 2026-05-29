# Hafeng Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-file HTML landing page for Hafeng (hidrosemeadura, Campinas) with editorial split hero, gallery, about, and contact sections.

**Architecture:** Single `hafeng/index.html` file with embedded CSS and JS. No build tools, no frameworks. Elementor-compatible via clean semantic HTML structure.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flexbox), vanilla JS (IntersectionObserver, scroll parallax), Google Fonts (Playfair Display + DM Sans)

---

### Task 1: Scaffold HTML + Base CSS

**Files:**
- Create: `hafeng/index.html`

- [ ] **Step 1: Create directory and file**

```
hafeng/index.html
```

- [ ] **Step 2: Write base HTML structure with CSS variables and reset**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hafeng — Hidrosemeadura em Campinas</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }

    :root {
      --green-dark:  #1B3A2A;
      --green-mid:   #4A9B5F;
      --green-light: #A8D5A2;
      --white:       #FFFFFF;
      --text-muted:  rgba(255,255,255,0.65);
      --radius:      12px;
    }

    body {
      background: var(--white);
      color: var(--green-dark);
      font-family: 'DM Sans', sans-serif;
      font-size: 16px;
      line-height: 1.7;
      overflow-x: hidden;
    }
  </style>
</head>
<body>
  <!-- NAV -->
  <!-- HERO -->
  <!-- GALLERY -->
  <!-- ABOUT -->
  <!-- CONTACT -->
  <!-- FOOTER -->
  <script></script>
</body>
</html>
```

- [ ] **Step 3: Open in browser, verify blank white page loads without errors**

Open `hafeng/index.html` in browser. DevTools console must show zero errors.

- [ ] **Step 4: Commit**

```bash
git add hafeng/index.html
git commit -m "feat: scaffold hafeng landing page"
```

---

### Task 2: Nav

**Files:**
- Modify: `hafeng/index.html`

- [ ] **Step 1: Add nav HTML inside `<body>`**

```html
<nav id="nav">
  <div class="nav-logo">Hafeng</div>
  <ul class="nav-links">
    <li><a href="#galeria">Galeria</a></li>
    <li><a href="#sobre">Sobre</a></li>
    <li><a href="#contato">Contato</a></li>
  </ul>
</nav>
```

- [ ] **Step 2: Add nav CSS inside `<style>`**

```css
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 20px 64px;
  display: flex; align-items: center; justify-content: space-between;
  background: transparent;
  transition: background .3s, padding .3s;
}
nav.scrolled {
  background: rgba(27,58,42,0.95);
  backdrop-filter: blur(20px);
  padding: 14px 64px;
}
.nav-logo {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--white);
  letter-spacing: 0.04em;
}
.nav-links {
  list-style: none;
  display: flex; gap: 36px;
}
.nav-links a {
  color: var(--white);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.85;
  transition: opacity .2s;
}
.nav-links a:hover { opacity: 1; }
@media (max-width: 768px) {
  nav { padding: 16px 24px; }
  nav.scrolled { padding: 12px 24px; }
  .nav-links { gap: 20px; }
}
```

- [ ] **Step 3: Add nav scroll JS inside `<script>`**

```js
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});
```

- [ ] **Step 4: Open in browser — nav must be transparent at top, dark green on scroll**

- [ ] **Step 5: Commit**

```bash
git add hafeng/index.html
git commit -m "feat: add hafeng nav with scroll transition"
```

---

### Task 3: Hero — Split Editorial

**Files:**
- Modify: `hafeng/index.html`

- [ ] **Step 1: Add hero HTML (replace `<!-- HERO -->` comment)**

```html
<section id="hero">
  <div class="hero-left">
    <span class="hero-tag fade-up">Hidrosemeadura · Campinas, SP</span>
    <h1 class="hero-title fade-up">Mais que<br><em>plantar,</em><br>projetar a<br>natureza.</h1>
    <p class="hero-sub fade-up">Soluções em revegetação e controle de erosão para obras, taludes e áreas degradadas.</p>
    <a href="#contato" class="hero-cta fade-up">Solicite um Orçamento</a>
  </div>
  <div class="hero-right">
    <div class="hero-img-wrap" id="heroImgWrap">
      <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80" alt="Natureza Hafeng" class="hero-img">
      <div class="hero-overlay"></div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add hero CSS**

```css
#hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--green-dark);
}
.hero-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 140px 64px 80px 64px;
  gap: 28px;
}
.hero-tag {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green-light);
  font-weight: 500;
}
.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 5vw, 5rem);
  font-weight: 900;
  line-height: 1.08;
  color: var(--white);
}
.hero-title em {
  font-style: italic;
  color: var(--green-light);
}
.hero-sub {
  font-size: 1.05rem;
  color: var(--text-muted);
  max-width: 420px;
  line-height: 1.75;
}
.hero-cta {
  display: inline-block;
  padding: 16px 36px;
  background: var(--green-mid);
  color: var(--white);
  text-decoration: none;
  border-radius: var(--radius);
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  transition: background .2s, transform .2s;
  align-self: flex-start;
}
.hero-cta:hover { background: #3d8a52; transform: translateY(-2px); }

.hero-right {
  position: relative;
  overflow: hidden;
}
.hero-img-wrap {
  position: absolute;
  inset: 0;
  will-change: transform;
}
.hero-img {
  width: 100%;
  height: 115%;
  object-fit: cover;
  object-position: center;
  display: block;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(27,58,42,0.55) 0%, rgba(74,155,95,0.2) 100%);
}

@media (max-width: 768px) {
  #hero { grid-template-columns: 1fr; grid-template-rows: auto 50vw; }
  .hero-left { padding: 120px 24px 48px; }
  .hero-right { position: relative; height: 50vw; }
  .hero-img-wrap { position: absolute; }
}
```

- [ ] **Step 3: Add fade-up animation CSS**

```css
.fade-up {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}
.fade-up:nth-child(1) { transition-delay: 0.1s; }
.fade-up:nth-child(2) { transition-delay: 0.25s; }
.fade-up:nth-child(3) { transition-delay: 0.4s; }
.fade-up:nth-child(4) { transition-delay: 0.55s; }
```

- [ ] **Step 4: Add parallax + fade-up JS inside `<script>`**

```js
// Parallax hero image
const heroWrap = document.getElementById('heroImgWrap');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroWrap) heroWrap.style.transform = `translateY(${y * 0.18}px)`;
});

// Fade-up observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Trigger hero items immediately
document.querySelectorAll('#hero .fade-up').forEach(el => {
  setTimeout(() => el.classList.add('visible'), 100);
});
```

- [ ] **Step 5: Open in browser — verify split layout, text stagger animation on load, parallax on scroll**

- [ ] **Step 6: Commit**

```bash
git add hafeng/index.html
git commit -m "feat: add hafeng hero with split layout and parallax"
```

---

### Task 4: Galeria

**Files:**
- Modify: `hafeng/index.html`

- [ ] **Step 1: Add gallery HTML (replace `<!-- GALLERY -->` comment)**

```html
<section id="galeria">
  <div class="section-header fade-up">
    <span class="section-tag">Nossos Projetos</span>
    <h2>Natureza que<br><em>transformamos</em></h2>
  </div>
  <div class="gallery-grid">
    <div class="gallery-item fade-up">
      <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80" alt="Projeto 1">
    </div>
    <div class="gallery-item fade-up">
      <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80" alt="Projeto 2">
    </div>
    <div class="gallery-item fade-up">
      <img src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80" alt="Projeto 3">
    </div>
    <div class="gallery-item fade-up">
      <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80" alt="Projeto 4">
    </div>
    <div class="gallery-item fade-up">
      <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80" alt="Projeto 5">
    </div>
    <div class="gallery-item fade-up">
      <img src="https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=800&q=80" alt="Projeto 6">
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add gallery CSS**

```css
#galeria {
  padding: 120px 64px;
  background: var(--white);
}
.section-header {
  margin-bottom: 64px;
}
.section-tag {
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green-mid);
  font-weight: 500;
  margin-bottom: 16px;
}
.section-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.2rem, 4vw, 3.5rem);
  font-weight: 700;
  line-height: 1.15;
  color: var(--green-dark);
}
.section-header h2 em {
  font-style: italic;
  color: var(--green-mid);
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 16px;
}
.gallery-item {
  overflow: hidden;
  border-radius: var(--radius);
  aspect-ratio: 4/3;
}
.gallery-item:first-child {
  grid-column: span 2;
  aspect-ratio: 16/9;
}
.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}
.gallery-item:hover img { transform: scale(1.06); }

@media (max-width: 768px) {
  #galeria { padding: 80px 24px; }
  .gallery-grid { grid-template-columns: 1fr 1fr; }
  .gallery-item:first-child { grid-column: span 2; }
}
```

- [ ] **Step 3: Open in browser — verify 3-col grid, first item spans 2 cols, hover zoom works**

- [ ] **Step 4: Commit**

```bash
git add hafeng/index.html
git commit -m "feat: add hafeng gallery section"
```

---

### Task 5: Sobre

**Files:**
- Modify: `hafeng/index.html`

- [ ] **Step 1: Add about HTML (replace `<!-- ABOUT -->` comment)**

```html
<section id="sobre">
  <div class="about-inner">
    <div class="about-text">
      <span class="section-tag fade-up">Sobre a Hafeng</span>
      <h2 class="fade-up">Especialistas em<br><em>revegetação</em></h2>
      <p class="fade-up">A Hafeng é referência em hidrosemeadura e controle de erosão na região de Campinas. Atuamos em taludes, margens de rodovias, áreas de preservação permanente e terrenos pós-obra.</p>
      <p class="fade-up">Nossa tecnologia garante cobertura vegetal uniforme, rápida germinação e fixação do solo — mesmo em áreas de difícil acesso.</p>
      <ul class="about-list fade-up">
        <li>Projetos residenciais e industriais</li>
        <li>Controle de erosão e taludes</li>
        <li>Áreas de preservação permanente</li>
        <li>Revegetação pós-obras viárias</li>
      </ul>
    </div>
    <div class="about-visual fade-up">
      <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=900&q=80" alt="Sobre Hafeng">
      <div class="about-badge">
        <span class="badge-num">+200</span>
        <span class="badge-label">projetos<br>realizados</span>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add about CSS**

```css
#sobre {
  background: #EEF7EC;
  padding: 120px 64px;
}
.about-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}
.about-text { display: flex; flex-direction: column; gap: 24px; }
.about-text h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 700;
  line-height: 1.15;
  color: var(--green-dark);
}
.about-text h2 em { font-style: italic; color: var(--green-mid); }
.about-text p { color: #3a5a47; line-height: 1.8; }
.about-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.about-list li {
  display: flex; align-items: center; gap: 12px;
  color: var(--green-dark);
  font-weight: 500;
}
.about-list li::before {
  content: '';
  width: 8px; height: 8px;
  background: var(--green-mid);
  border-radius: 50%;
  flex-shrink: 0;
}
.about-visual {
  position: relative;
  border-radius: 20px;
  overflow: visible;
}
.about-visual img {
  width: 100%;
  border-radius: 20px;
  display: block;
  aspect-ratio: 4/5;
  object-fit: cover;
}
.about-badge {
  position: absolute;
  bottom: -24px; left: -24px;
  background: var(--green-dark);
  color: var(--white);
  border-radius: var(--radius);
  padding: 20px 24px;
  display: flex; align-items: center; gap: 12px;
}
.badge-num {
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem;
  font-weight: 900;
  color: var(--green-light);
}
.badge-label { font-size: 0.85rem; line-height: 1.4; opacity: 0.8; }

@media (max-width: 768px) {
  #sobre { padding: 80px 24px; }
  .about-inner { grid-template-columns: 1fr; gap: 48px; }
  .about-badge { bottom: -16px; left: 16px; }
}
```

- [ ] **Step 3: Open in browser — verify 2-col layout, badge positioned on image corner**

- [ ] **Step 4: Commit**

```bash
git add hafeng/index.html
git commit -m "feat: add hafeng about section"
```

---

### Task 6: Contato + Footer

**Files:**
- Modify: `hafeng/index.html`

- [ ] **Step 1: Add contact HTML (replace `<!-- CONTACT -->` comment)**

```html
<section id="contato">
  <div class="contact-inner">
    <div class="contact-text fade-up">
      <span class="section-tag">Fale Conosco</span>
      <h2>Vamos <em>trabalhar</em><br>juntos?</h2>
      <p>Entre em contato e receba um orçamento sem compromisso.</p>
      <div class="contact-info">
        <span>📍 Campinas, SP</span>
        <span>📞 (19) 9 0000-0000</span>
        <span>✉️ contato@hafeng.com.br</span>
      </div>
    </div>
    <form class="contact-form fade-up" onsubmit="return false;">
      <input type="text" placeholder="Seu nome" required>
      <input type="email" placeholder="Seu e-mail" required>
      <input type="tel" placeholder="WhatsApp">
      <textarea placeholder="Descreva seu projeto" rows="4" required></textarea>
      <button type="submit">Enviar Mensagem</button>
    </form>
  </div>
</section>

<footer>
  <span>© 2026 Hafeng — Hidrosemeadura. Todos os direitos reservados.</span>
</footer>
```

- [ ] **Step 2: Add contact + footer CSS**

```css
#contato {
  background: var(--green-dark);
  padding: 120px 64px;
  color: var(--white);
}
.contact-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
  max-width: 1200px;
  margin: 0 auto;
}
.contact-text { display: flex; flex-direction: column; gap: 24px; }
.contact-text .section-tag { color: var(--green-light); }
.contact-text h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 700;
  line-height: 1.15;
}
.contact-text h2 em { font-style: italic; color: var(--green-light); }
.contact-text p { color: var(--text-muted); }
.contact-info {
  display: flex; flex-direction: column; gap: 10px;
  color: var(--text-muted);
  font-size: 0.95rem;
}
.contact-form {
  display: flex; flex-direction: column; gap: 16px;
}
.contact-form input,
.contact-form textarea {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius);
  padding: 14px 18px;
  color: var(--white);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color .2s;
}
.contact-form input::placeholder,
.contact-form textarea::placeholder { color: rgba(255,255,255,0.4); }
.contact-form input:focus,
.contact-form textarea:focus { border-color: var(--green-light); }
.contact-form textarea { resize: vertical; }
.contact-form button {
  padding: 16px;
  background: var(--green-mid);
  color: var(--white);
  border: none;
  border-radius: var(--radius);
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background .2s, transform .2s;
}
.contact-form button:hover { background: #3d8a52; transform: translateY(-2px); }

footer {
  background: #0f2218;
  color: rgba(255,255,255,0.4);
  text-align: center;
  padding: 24px;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  #contato { padding: 80px 24px; }
  .contact-inner { grid-template-columns: 1fr; gap: 48px; }
}
```

- [ ] **Step 3: Open in browser — verify form renders, inputs focus state, footer shows**

- [ ] **Step 4: Commit**

```bash
git add hafeng/index.html
git commit -m "feat: add hafeng contact form and footer"
```

---

### Task 7: Final Polish + Max-Width Container

**Files:**
- Modify: `hafeng/index.html`

- [ ] **Step 1: Add max-width wrapper to gallery and hero-left**

Add `max-width: 1400px; margin: 0 auto;` wrapper style to `#hero`, and wrap `#galeria` inner content:

In gallery section, wrap content in `<div class="container">` and add CSS:
```css
.container { max-width: 1300px; margin: 0 auto; }
```

- [ ] **Step 2: Add smooth scroll offset for fixed nav**

```css
section { scroll-margin-top: 80px; }
```

- [ ] **Step 3: Final browser check — scroll through all sections, verify:**
  - Nav transitions on scroll
  - Hero animation triggers on load
  - Parallax moves image on scroll
  - Gallery hover zoom works
  - About badge visible
  - Contact form focusable
  - Mobile layout (resize browser to 375px)

- [ ] **Step 4: Commit**

```bash
git add hafeng/index.html
git commit -m "feat: hafeng landing page complete"
```
