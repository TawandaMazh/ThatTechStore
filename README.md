# ThatTechStore

Premium tech storefront for Lusaka — cooling, power backup, storm gear, and IMEI-checked phones.

**This repo (`main`) is the functioning website source** — Phases 1–3:

| Phase | What’s included |
| ----- | --------------- |
| 1 | Design system + animated home |
| 2 | Catalog, PDP, cart (Supabase + mock fallback) |
| 3 | Checkout, mock payments (MoMo / Airtel / Zamtel / card / COD), `/order/[orderNumber]`, `/track`, pre-order deposits |

Later: owner/delivery dashboards, real Flutterwave, production deploy polish.

See `docs/PHASE1.md`, `docs/PHASE2.md`, `docs/PHASE3.md`, and `docs/SUPABASE.md`.

---

## Open the site

| Where | Status |
| ----- | ------ |
| **Local** | `npm run dev` → [http://localhost:3000](http://localhost:3000) |
| **GitHub** | Source only — GitHub does **not** host this Next.js app |
| **Live URL** | Deploy on **Vercel** by importing this repo (see below). There is no working public URL until that succeeds. |

If GitHub’s repo **About → Website** still shows `https://thattechstore.vercel.app`, clear it: that link 404s and is not a real deploy.

---

## Windows setup

### 1. Install Node.js (if needed)

1. Download the **LTS** installer from [https://nodejs.org](https://nodejs.org)
2. Run the installer (accept defaults; ensure “Add to PATH” is checked)
3. Open a **new** PowerShell or Command Prompt and verify:

```bat
node -v
npm -v
```

### 2. Clone and install

```bat
git clone https://github.com/TawandaMazh/ThatTechStore.git
cd ThatTechStore
npm install
```

### 3. Env file

```bat
copy .env.example .env.local
notepad .env.local
```

Set:

```
NEXT_PUBLIC_SUPABASE_URL=https://xvsblrksjycreicjvuui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-anon-jwt-here
PAYMENT_PROVIDER=mock
MOCK_WEBHOOK_SECRET=thattechstore-mock-webhook-dev
```

Optional seasonal hero override: `NEXT_PUBLIC_FORCE_SEASON=heat` (`heat` | `storms` | `outages`).

### 4. Apply SQL (once)

In Supabase Dashboard → **SQL Editor**:

1. Run `supabase/migrations/20261020100000_phase2_catalog.sql`
2. Run `supabase/seed.sql`
3. Run `supabase/migrations/20261020200000_phase3_orders.sql`
4. Insert `app_config` webhook secret (see `docs/PHASE3.md`)

Until Phase 2 seed runs, the catalog falls back to a built-in demo. Until Phase 3 SQL runs, orders use an in-memory mock store (resets when the server stops).

### 5. Run the dev server

```bat
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. What to check visually

- [ ] Home best sellers + category links open real `/products` filters
- [ ] `/products` — search, category, min/max price, in-stock filter
- [ ] PDP — gallery, price, stock, specs, “what problem it solves”, related
- [ ] Phone PDPs — battery health + IMEI/warranty panel
- [ ] Add to cart → `/cart` → `/checkout`
- [ ] MoMo mock pay → confirmation **Paid** (via webhook)
- [ ] `/track` with order # + phone
- [ ] `/pre-order` deposit items
- [ ] **No WhatsApp** “Ask a question” (number not configured)
- [ ] Delivery copy: all Lusaka areas
- [ ] Dark-first blue theme; motion + reduced-motion respected

### Scripts

| Command           | Purpose                |
| ----------------- | ---------------------- |
| `npm run dev`     | Local development      |
| `npm run build`   | Production build       |
| `npm run start`   | Serve production build |
| `npm run lint`    | ESLint                 |

---

## Deploy on Vercel (live site)

GitHub stores the code; **Vercel** runs the live Next.js site.

1. Log in at [vercel.com](https://vercel.com) with **GitHub**
2. **Add New… → Project** → import **TawandaMazh/ThatTechStore** (`main`)
3. Framework: Next.js (auto). Root directory: `.`
4. Add env vars (Production + Preview):

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon JWT from Supabase → Settings → API |
| `NEXT_PUBLIC_SITE_URL` | leave blank or `http://localhost:3000` until first deploy; then set to the real `*.vercel.app` URL and redeploy |
| `PAYMENT_PROVIDER` | `mock` |
| `MOCK_WEBHOOK_SECRET` | `thattechstore-mock-webhook-dev` (change later for production) |

5. **Deploy** — use the URL Vercel gives you. Do **not** assume `thattechstore.vercel.app` exists until you create that project.

Do not put service-role keys in `NEXT_PUBLIC_*` vars.

---

## Project layout

```
app/(shop)/            # home, products, cart, checkout, track, orders
components/            # product, cart, home, UI
lib/catalog/           # Supabase queries + mock fallback
lib/orders/            # orders + mock payments
supabase/migrations/   # Phase 2 + Phase 3 schema
supabase/seed.sql      # catalog seed
docs/PHASE*.md         # phase notes + SQL checklists
```
