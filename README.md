# Shepherd

Next.js 14 app: marketing site, **Shepherd** dashboard, and **Wayfind** (dark map + AI chat prototype).

## Routes

| Path | What it is |
| --- | --- |
| `/` | Marketing homepage — **Variant C (Signal)**: dark ops console layout, live storm-path canvas over `public/images/gulf-satellite.png` with Ida track and animated hurricane icon (`components/designs/variant-signal.tsx`) |
| `/app` | Dashboard shell (monitor, feed, chat) |
| `/wayfind` | Map + directions + floating chat (`components/wayfind-app.tsx`) |
| `/sign-in`, `/sign-up` | Auth entry routes |

## Design exports

The `design-exports/` folder holds extra Claude design-canvas files for reference (not bundled). The live site uses the satellite at `public/images/gulf-satellite.png` for the storm-path card.

## Wayfind

- **Mapbox:** set `NEXT_PUBLIC_MAPBOX_TOKEN` (or replace `YOUR_MAPBOX_TOKEN` in `components/wayfind-app.tsx`).
- **Build:** `transpilePackages: ["mapbox-gl"]` in `next.config.mjs`.

## Stack

Next.js 14, React 18, TypeScript, Tailwind, Framer Motion, Mapbox GL, Google Maps (dashboard), Mantine, Radix, lucide-react.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port Next prints if 3000 is busy).

## Environment

Create `.env.local` as needed, e.g. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=…` for the dashboard map.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |

## Layout

```
app/                 App Router
components/
  app/               Dashboard
  designs/
    variant-signal.tsx  Homepage (Signal)
    shepherd-data.ts    Shared copy + mock data for Signal
  wayfind-app.tsx    Map prototype
design-exports/      Design-canvas references (not bundled)
lib/                 Context, theme, mock data
public/images/       gulf-satellite.png (Gulf basemap for storm path)
```
