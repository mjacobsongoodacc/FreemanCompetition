# Shepherd

Next.js 14 monorepo containing a marketing site, a dashboard app surface, and **Wayfind**, a single-file dark-mode map + AI chat prototype.

## Routes

| Path | What it is |
| --- | --- |
| `/` | Shepherd marketing site (hero, streams, dossier, final CTA) |
| `/app` | Shepherd dashboard shell (monitor panel, feed, chat) |
| `/wayfind` | Standalone map navigation + floating AI chat prototype |
| `/sign-in`, `/sign-up` | Auth entry routes |

## Wayfind prototype

Full-screen dark Mapbox map with a persistent left-side directions panel and a macOS-Claude-style floating chat bar at bottom-center.

- **Liquid glass** — reserved for the top nav, primary CTAs, and the chat frame (`#0A0A0C` fill, gradient border, `backdrop-blur-md` + `backdrop-saturate-150`, inset highlight, outer shadow).
- **Stitch pattern** — barely-visible 48×48 SVG diamond, layered on the page and non-map UI containers only.
- **Directions panel** — 360px floating column, `From` / `To` inputs, 11-step turn-by-turn for a Mission → Ferry Building route, totals, and a `Start` CTA.
- **Chat panel** — 560px wide, 56px collapsed / 480px expanded (280ms ease-out), outside-click and `Escape` collapse, seeded with realistic route context.

Single file: [`components/wayfind-app.tsx`](components/wayfind-app.tsx). Drop-in compatible with any Next.js app that has `framer-motion`, `mapbox-gl`, `lucide-react`, and Tailwind.

### Mapbox token

Wayfind uses a placeholder `YOUR_MAPBOX_TOKEN` — replace it in `components/wayfind-app.tsx` (or wire it to an env var) before the map will load.

## Stack

- Next.js 14 (App Router)
- React 18, TypeScript
- Tailwind CSS
- Framer Motion
- Mapbox GL JS (Wayfind)
- Google Maps JS (Shepherd monitor)
- lucide-react icons
- Mantine + Radix UI primitives (Shepherd)

## Local development

```bash
npm install
npm run dev
```

Then open:
- <http://localhost:3000> — marketing
- <http://localhost:3000/app> — dashboard
- <http://localhost:3000/wayfind> — Wayfind prototype

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Environment

Create `.env.local`:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

Mapbox token is currently inline; move to `NEXT_PUBLIC_MAPBOX_TOKEN` before deploying publicly.

## Project layout

```
app/              App Router routes (marketing, /app, /wayfind, auth)
components/
  app/            Shepherd dashboard surfaces
  marketing/      Marketing sections
  ui/             Radix-based primitives
  wayfind-app.tsx Wayfind single-file prototype
lib/              Shared context, theme, mock data
tailwind.config.ts
```
