# ThatTechStore

Premium tech storefront for Lusaka — cooling, power backup, storm gear, and IMEI-checked phones.

**Phase 1** (this branch): Next.js App Router + TypeScript + Tailwind design system, dark-first blue theme with light mode, Motion + Lenis (desktop), and an animated home page with seasonal hero + mock content.

Later phases: Supabase catalog/auth, cart & checkout, owner/delivery dashboards, payments (mock → Flutterwave), Vercel deploy.

---

## Windows setup (Phase 1)

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

### 3. Env file (optional for Phase 1)

```bat
copy .env.example .env.local
```

To force a seasonal hero regardless of date, set in `.env.local`:

```
NEXT_PUBLIC_FORCE_SEASON=heat
```

Valid values: `heat` | `storms` | `outages`

### 4. Run the dev server

```bat
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. What to check visually

- [ ] **Brand** “ThatTechStore” is large in the hero (not only in the nav)
- [ ] **Seasonal hero** matches date (or `NEXT_PUBLIC_FORCE_SEASON`) — heat / storms / outages
- [ ] **Dark mode** by default; **theme toggle** switches light/dark
- [ ] **Shop by problem** — Too hot, Power cuts, Storms, Phones
- [ ] **Best sellers** strip (6 mock products)
- [ ] **Trust** — warranty, IMEI checked, delivery across Lusaka
- [ ] **Reviews** — mock quotes
- [ ] **No WhatsApp CTA** on the home page
- [ ] **Motion** — page fade/slide, section reveals, button hover (desktop)
- [ ] **Smooth scroll** on desktop; normal scroll on phone
- [ ] Mobile layout OK at ~360px width

### Scripts

| Command           | Purpose                |
| ----------------- | ---------------------- |
| `npm run dev`     | Local development      |
| `npm run build`   | Production build       |
| `npm run start`   | Serve production build |
| `npm run lint`    | ESLint                 |

---

## Project layout (Phase 1)

```
app/(shop)/          # home + product placeholders
components/ui/       # Button, Container, Skeleton, ThemeToggle…
components/home/     # Hero, categories, best sellers, trust, reviews
components/motion/   # Page transition, reveal, Lenis
lib/mock/            # Seasonal hero, products, reviews (no DB yet)
docs/PHASE1.md       # Phase 1 checklist
```

See `docs/PHASE1.md` for the handoff checklist.
