# Phase 2 — Catalog, PDP, cart

Supabase schema + RLS + seed (12 products), product listing with filters/search, product detail pages, and a client cart with optional guest sync.

## Apply SQL (Windows — Supabase Dashboard)

Service role is not in the repo. Run SQL in the dashboard:

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → project **ThatTechStore**
2. **SQL Editor** → New query
3. Paste contents of `supabase/migrations/20261020100000_phase2_catalog.sql` → **Run**
4. New query → paste `supabase/seed.sql` → **Run**

## Env

```bat
copy .env.example .env.local
notepad .env.local
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon JWT from Project Settings → API).

## Run

```bat
npm install
npm run dev
```

Open [http://localhost:3000/products](http://localhost:3000/products)

Full Windows checklist: see the cloud store guide `docs/phase-2-run.md` (mirrored for the team) or the steps below.

## Click-test

- [ ] `/products` — filters (category, price, in stock) + search
- [ ] `/products/[slug]` — gallery, price, stock, specs, problem solved, related
- [ ] Phones — battery health + IMEI/warranty panel
- [ ] Add to cart → `/cart` updates; header badge counts
- [ ] No WhatsApp “Ask a question” (number not set)
- [ ] Delivery copy mentions all Lusaka areas
- [ ] Home best sellers / categories link to real catalog (mock fallback if seed not run)

## Out of scope

Checkout, payments, order tracking, owner/delivery dashboards.
