# ThatTechStore

Premium tech storefront for Lusaka — cooling, power backup, storm gear, and IMEI-checked phones.

**Phase 3** (this branch): checkout (Lusaka free-text area + phone + payment method), mock payments (MoMo / Airtel / Zamtel / card / COD) with webhook-trusted paid status, `/order/[orderNumber]`, `/track`, and pre-order deposits. Phase 2 catalog + cart remain.

Later phases: owner/delivery dashboards, real Flutterwave, Vercel deploy.

See `docs/PHASE3.md` (and `docs/PHASE2.md` for catalog SQL).

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

## Project layout (Phase 2)

```
app/(shop)/products/   # listing + PDP
app/(shop)/cart/       # cart UI
components/product/    # card, filters, gallery, specs
components/cart/       # provider + cart view
lib/catalog/           # Supabase queries + mock fallback
supabase/migrations/   # schema + RLS
supabase/seed.sql      # 12 products
docs/PHASE2.md         # SQL + checklist
```
