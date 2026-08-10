# Sallee Icy Schaerer — Portfolio Website

A single-page portfolio site for Sallee Icy Schaerer, a Métis artist and designer working across painting, digital design, and handmade craft. Built to work equally well for art/creative opportunities, Indigenous-related opportunities, and general professional opportunities.

This repository is **private**. The site is not currently published anywhere public — see [Running it locally](#running-it-locally) below.

## Tech stack

Plain static site: HTML + CSS + vanilla JS, no build step, no framework, no dependencies to install. Fonts load from Google Fonts via `<link>` tags in `index.html`.

```
index.html            All page markup, one scrolling page with anchor-linked sections
css/
  variables.css        Both color themes (warm default + icy alternate) as CSS custom properties
  base.css              Typography, layout, nav, footer, shared component styles
  sections.css           Per-section layout: hero, about, galleries, handmade, contact, footer
  animations.css          Entrance animation, scroll reveal, flip cards, theme-toggle tumble/rain, AMA modal
js/
  main.js               Nav/scroll behavior, mobile menu, entrance animation trigger, berry rain, Etsy link
  theme.js                Warm/icy palette toggle (the strawberry button) + tumble animation
  search.js                Client-side search overlay
  gallery.js                Flip-card hover/tap logic for the art & handmade galleries
  ama.js                    Ask Me Anything comic-strip modal + question/answer data
  contact.js                 Contact form submission handling (Formspree)
assets/
  images/                Photos, artwork, and decorative illustrations — see assets/images/README.md
  icons/                   Small UI icons (cursor, footprint, theme-toggle icon)
```

## Running it locally

Since this repo is private and not deployed publicly, use a simple local static file server to preview the site — either on your own machine, or on a server on your LAN that you then reach from another device.

**Python (usually already installed):**
```bash
cd sallees_website
python3 -m http.server 8080
```
Then open `http://localhost:8080` on the same machine, or `http://<that-machine's-LAN-IP>:8080` from another device on the same network.

**Node.js, if you have it:**
```bash
cd sallees_website
npx serve -l 8080
```

**Finding the host machine's LAN IP** (needed to reach it from another device):
- macOS: `ipconfig getifaddr en0`
- Linux: `hostname -I` or `ip addr`
- Windows: `ipconfig` (look for "IPv4 Address")

Make sure the host machine's firewall allows inbound connections on the port you chose, and that both devices are on the same Wi-Fi/LAN.

> Note on this Claude session: when Claude is working in a cloud-hosted session (Claude Code on the web), any server it starts runs inside an isolated, ephemeral container — it is **not** reachable from your home LAN, no matter how it's bound. A local dev server only works for LAN access if it's started on a machine that's actually on your network.

## Theming

Two palettes are defined as CSS custom properties in `css/variables.css`: the default warm palette (`:root`) and an alternate icy-blue palette (`:root[data-theme="icy"]`). The strawberry button (bottom-right, fixed) toggles `data-theme` on `<html>`, persists the choice to `localStorage`, and plays a color-wash transition plus a berry-tumble animation. Artwork always sits on a warm milk-white background (`--art-bg`) regardless of the active theme, so images never clash with either palette. Pure white is never used anywhere in the design system.

## Editing content

- **Text**: edit directly in `index.html` — it's plain markup, organized by section with HTML comments marking each one.
- **Images/artwork**: see `assets/images/README.md` for the full list of what each file is used for and its suggested aspect ratio. Replace a file at the same path (or update the `src` in `index.html`) to swap in new art.
- **Ask Me Anything**: questions, answers, and which two of the three comic characters (bird, crocodile, frog) appear for each are defined in `js/ama.js`.

## Contact form + "Ask Me Anything" custom questions

Both the contact form and the AMA "ask your own question" box submit to the same Formspree endpoint, configured in `js/contact.js` (`FORMSPREE_ENDPOINT`) and mirrored in `js/ama.js`. Until a real Formspree form ID is set, both fall back to opening the visitor's email client with the message pre-filled.

**To wire it up**: create a free form at [formspree.io](https://formspree.io), then replace `FORMSPREE_ENDPOINT` in **both** `js/contact.js` and `js/ama.js` with the real endpoint URL.

## Browser support & accessibility

- Custom paintbrush cursor and hover-flip cards are desktop-only (fine-pointer detection); mobile uses tap-to-flip instead.
- All entrance/scroll/tumble/rain animations respect `prefers-reduced-motion`.
- Copyright and AI-training-opt-out language lives in the footer on every page load.

## Development notes

Development happens directly on `main` — no long-lived feature branch. (Earlier rounds used a `claude/sallee-project-website-245om0` branch, merged and deleted once caught up.) This README is kept up to date as the site evolves — if you're reading a stale version, check `main` for the latest.
