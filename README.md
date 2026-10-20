# ThatTechStore

Premium tech storefront for Lusaka — cooling, power backup, storm gear, and IMEI-checked phones.

**Phase 2** (current): Supabase catalog schema + RLS + seed (12 products), `/products` filters & search, product detail pages, and a client cart (localStorage + optional guest sync). Dark-first blue theme from Phase 1 is preserved.

Later phases: checkout & payments, owner/delivery dashboards, Flutterwave, Vercel deploy.

See `docs/PHASE2.md` for SQL seed steps.

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
```

Optional seasonal hero override: `NEXT_PUBLIC_FORCE_SEASON=heat` (`heat` | `storms` | `outages`).

### 4. Apply catalog SQL (once)

In Supabase Dashboard → **SQL Editor**:

1. Run `supabase/migrations/20261020100000_phase2_catalog.sql`
2. Run `supabase/seed.sql`

Until seed runs, the app falls back to a built-in demo catalog of the same 12 products.

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
- [ ] Add to cart → `/cart` + header badge
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
