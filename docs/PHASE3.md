# Phase 3 — Checkout, orders, mock payments, track

Checkout (Lusaka free-text area + phone + payment method), orders + confirmation, mock payment provider (MTN MoMo / Airtel / Zamtel / card / COD), webhook-trusted paid status, order tracking, and pre-order deposits.

## Apply SQL (Windows — Supabase Dashboard)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → **ThatTechStore**
2. **SQL Editor** → New query → paste `supabase/migrations/20261020200000_phase3_orders.sql` → **Run**
3. New query → set webhook secret (must match `.env.local`):

```sql
insert into public.app_config (key, value)
values ('mock_webhook_secret', 'thattechstore-mock-webhook-dev')
on conflict (key) do update
  set value = excluded.value, updated_at = now();
```

4. Optional: re-run `supabase/seed.sql` for pre-order flags on Portable AC + Lithium Battery

Without this SQL, the app still works using an in-memory mock order store (resets when the Node process restarts).

## Env

```bat
copy .env.example .env.local
```

Set Supabase URL/anon key plus:

```
PAYMENT_PROVIDER=mock
MOCK_WEBHOOK_SECRET=thattechstore-mock-webhook-dev
```

## Run

```bat
npm install
npm run dev
```

## Click-test

- [ ] Cart → **Checkout**
- [ ] Place order with MoMo → mock pay → **Pay** → confirmation shows **Paid** (via webhook)
- [ ] COD order stays **Pending**
- [ ] `/track` with order # + phone → timeline
- [ ] `/pre-order` → deposit items → cart/checkout charge deposit

Full Windows guide: cloud store `docs/phase-3-run.md`.
