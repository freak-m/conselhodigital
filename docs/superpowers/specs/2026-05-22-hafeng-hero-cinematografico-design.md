# Hafeng — Hero Cinematográfico (02)
**Date:** 2026-05-22
**Scope:** Substituição do `#hero` atual por versão fullscreen cinematográfica

## Objetivo
Substituir o hero split-layout existente por um hero fullscreen com vídeo em loop no background, reveal de tipografia com tensão via GSAP, e scroll indicator que some ao descer.

## Vídeo
- Intro (toca uma vez): `fotos/Ilha.mp4` — `autoplay muted playsinline`
- Loop (após `ended`): `fotos/ilha loop.mp4` com `loop = true`
- `object-fit: cover`, preenche 100% do viewport

## Layout
- `height: 100vh`, `position: relative`, `overflow: hidden`
- Conteúdo centralizado vertical e horizontalmente
- Dark overlay: `linear-gradient(to bottom, rgba(5,15,8,0.55) top → rgba(5,15,8,0.82) bottom)`

## Sequência de animação (GSAP)
Ordem e timings — todos com `ease: power3.out` ou `cubic-bezier(0.16,1,0.3,1)`:

| t (s) | Elemento | Ação |
|-------|----------|------|
| 0.3 | Tag "Hidrosemeadura em Campinas" | fade + translateY(10px→0), 0.6s |
| **silêncio** | — | tensão antes do título |
| 1.1 | "Mais" | sobe de dentro do clip, 0.6s |
| 1.3 | "que" | idem |
| 1.5 | "plantar," | idem |
| 1.7 | "projetar" | idem |
| 1.9 | "a" | idem |
| 2.1 | "natureza." (em itálico verde) | idem |
| 2.55 | Subtítulo | fade + translateY, 0.7s |
| 2.95 | Botões CTA | fade + translateY, 0.7s |
| 3.5 | Scroll indicator | fade in, 0.8s |

**Técnica word reveal:** cada palavra em `<span class="word-clip">` (overflow: hidden) wrapping `<span class="word-inner">` que anima de `translateY(105%) opacity:0` → `translateY(0) opacity:1`. Espaço entre palavras via `margin-right: 0.28em` no `.word-clip`.

## Tipografia
- Tag: DM Sans, 0.65rem, letter-spacing 0.28em, uppercase, `rgba(168,213,162,0.8)`
- Título: Playfair Display, `clamp(2.4rem, 6vw, 4.4rem)`, weight 900, branco
- "natureza." em `<em>`: itálico, cor `#A8D5A2`
- Subtítulo: DM Sans, 0.95rem, `rgba(255,255,255,0.5)`

## CTAs
- Primário: bg `#4A9B5F`, branco, border-radius 99px, âncora `#contato`
- Ghost: bg `rgba(255,255,255,0.09)`, border `rgba(255,255,255,0.22)`, âncora `#galeria`

## Scroll Indicator
- Posição: `absolute bottom:32px left:50%`
- Texto "SCROLL" + chevron animado (bounce)
- Fade out via `window.addEventListener('scroll')`: `opacity = max(0, 1 - scrollY/100)`

## Nav
- Transparente sobre o vídeo, texto branco
- Transição para `.light` (fundo branco, blur) ao sair do hero — lógica existente mantida

## Implementação
- GSAP via CDN: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
- Sem SplitText plugin — words split manualmente no HTML
- Remove: CSS antigo do `#hero` split-layout, `.hero-left`, `.hero-right`, `.hero-video-wrap`, `.hero-float-badge`
- Mantém: resto do `index.html` intacto (galeria, sobre, esp-track, contato, footer)
