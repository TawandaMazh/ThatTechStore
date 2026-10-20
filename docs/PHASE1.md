# Phase 1 handoff — ThatTechStore

## Goal

Scaffold + design system + animated home page. No cart, checkout, or dashboards.

## Design choices

| Token / choice | Value |
| -------------- | ----- |
| Accent (dark)  | `#3D8BFF` electric blue |
| Accent (light) | `#2563EB` |
| Base (dark)    | `#070B12` navy charcoal |
| Display font   | **Syne** |
| Body font      | **Outfit** |
| Theme          | Dark-first + light toggle (`localStorage` key `tts-theme`) |

## Season keys

| Key       | Months (date default) | Hero focus        |
| --------- | --------------------- | ----------------- |
| `heat`    | Sep–Nov               | Cooling           |
| `storms`  | Dec–Apr               | Surge / storms    |
| `outages` | May–Aug               | Inverters / power |

Override with `NEXT_PUBLIC_FORCE_SEASON` or `lib/mock/site-settings.ts` → `activeSeason`.

## Windows run commands

```bat
npm install
copy .env.example .env.local
npm run dev
```

Open http://localhost:3000

## Verify checklist

1. Home loads without console errors
2. Hero brand + one headline + one line + CTAs; full-bleed visual; no cards/stats in hero
3. Theme toggle works
4. Categories link to `/products?category=…` (placeholder page OK)
5. Best sellers, trust (Lusaka delivery), reviews visible
6. No WhatsApp button
7. `prefers-reduced-motion`: animations effectively off
8. `npm run build` succeeds

## Out of scope (later)

- Supabase schema, RLS, seed
- Cart / checkout / payments
- Owner & delivery dashboards
- Real WhatsApp number CTA
- Vercel deploy
