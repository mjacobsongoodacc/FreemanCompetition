# Shepherd

Next.js 14 app: marketing site, **Shepherd** dashboard, and **Wayfind** (dark map + AI chat prototype).

## Routes

| Path | What it is |
| --- | --- |
| `/` | Marketing homepage — **Variant C (Signal)**: dark ops console layout, live storm-path canvas over `public/images/gulf-satellite.png` with Ida track and animated hurricane icon (`components/designs/variant-signal.tsx`) |
| `/app` | Dashboard shell (monitor, feed, chat) |
| `/wayfind` | Map + directions + floating chat (`components/wayfind-app.tsx`) |
| `/admin-test` | Dev-only Supabase insert / realtime / update verification (not a product admin UI) |
| `/sign-in`, `/sign-up` | Auth entry routes |

## Design exports

The `design-exports/` folder holds extra Claude design-canvas files for reference (not bundled). The live site uses the satellite at `public/images/gulf-satellite.png` for the storm-path card.

## Wayfind

- **Mapbox:** set `NEXT_PUBLIC_MAPBOX_TOKEN` (or replace `YOUR_MAPBOX_TOKEN` in `components/wayfind-app.tsx`).
- **Build:** `transpilePackages: ["mapbox-gl"]` in `next.config.mjs`.

## Stack

Next.js 14, React 18, TypeScript, Tailwind, Framer Motion, Mapbox GL, Google Maps (dashboard), Mantine, Radix, lucide-react.

## Supabase

Shepherd uses [Supabase](https://supabase.com/) for Postgres and Realtime. The `supabase/` folder holds migrations. Row Level Security (RLS) is **intentionally disabled** on `sessions` and `turns` for the pitch demo; do not use this mode in production.

**Environment variables (names only):** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — set them in `.env.local` (see `.env.local.example`).

**Apply migrations to the linked remote database:**

```bash
supabase link --project-ref <your-ref>   # once, after `supabase login`
supabase db push
```

**Regenerate TypeScript client types** after any schema change:

```bash
supabase gen types typescript --linked > types/supabase.ts
```

**Dev check:** with env vars set, `npm run dev` and open `/admin-test` to verify inserts, realtime list updates, and response updates. That route is a utilitarian dev tool, not a production admin panel.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port Next prints if 3000 is busy).

## Environment

Create `.env.local` as needed, e.g. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=…` for the dashboard map, `NEXT_PUBLIC_MAPBOX_TOKEN` and `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` for Wayfind and the Supabase data layer.

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
