# Hafeng — Landing Page Design Spec
**Date:** 2026-05-21  
**Type:** HTML estático (Elementor-ready)

## Empresa
- **Nome:** Hafeng
- **Serviço:** Hidrosemeadura — Campinas, SP
- **Slogan:** "Mais que plantar, projetar a natureza."

## Abordagem: Editorial/Split (B)
Hero dividido: texto esquerda com animação fade+stagger, imagem natureza direita com parallax.

## Seções

### 1. Nav
- Fixo, fundo verde escuro semitransparente com blur
- Logo esquerda, links direita
- Smooth scroll para âncoras

### 2. Hero
- Split 50/50 em desktop, stack em mobile
- Esquerda: slogan grande (Playfair Display), subtítulo, CTA button
- Direita: imagem natureza/hidrosemeadura com overlay verde + parallax no scroll
- Animação: fade + slide-up com stagger nos elementos de texto

### 3. Galeria
- Grid masonry 3 colunas
- Fundo branco, imagens com hover zoom
- Placeholder images (unsplash landscape/nature)

### 4. Sobre
- Layout assimétrico: texto esquerda, visual direita
- Fundo verde claro
- Descrição da empresa + diferenciais

### 5. Contato
- Formulário: nome, email, mensagem, botão enviar
- Fundo branco
- Endereço: Campinas, SP

## Paleta
| Variável | Cor |
|----------|-----|
| `--green-dark` | `#1B3A2A` |
| `--green-mid` | `#4A9B5F` |
| `--green-light` | `#A8D5A2` |
| `--white` | `#FFFFFF` |

## Tipografia
- Display: Playfair Display (headings)
- Body: DM Sans (texto corrido)

## Implementação
- HTML/CSS/JS puro — sem frameworks
- Elementor-compatible: estrutura semântica limpa, sem dependências externas problemáticas
- Responsivo (mobile-first)
- Imagens: placeholders Unsplash via URL
