-- Phase 3: orders, order_items, payments + RLS / track RPCs
-- Apply via Supabase Dashboard → SQL Editor after Phase 2 migration.
-- No service role required: guest checkout + track use security-definer RPCs;
-- payment confirmation uses confirm_payment_webhook(secret, ...).

create extension if not exists "pgcrypto";

-- ── Orders ───────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_phone text not null,
  delivery_area text not null,
  address text not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'out_for_delivery', 'delivered', 'returned')),
  payment_method text not null
    check (payment_method in ('mtn_momo', 'airtel', 'zamtel', 'card', 'cod')),
  subtotal_zmw numeric(12, 2) not null check (subtotal_zmw >= 0),
  deposit_zmw numeric(12, 2) not null default 0 check (deposit_zmw >= 0),
  amount_due_zmw numeric(12, 2) not null check (amount_due_zmw >= 0),
  notes text,
  paid_at timestamptz,
  out_for_delivery_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_order_number_idx on public.orders (order_number);
create index if not exists orders_phone_idx on public.orders (customer_phone);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- ── Order items ──────────────────────────────────────────────────────────────
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  product_slug text not null,
  unit_price_zmw numeric(12, 2) not null check (unit_price_zmw >= 0),
  quantity int not null check (quantity > 0),
  is_preorder boolean not null default false,
  deposit_zmw numeric(12, 2),
  unit_id uuid references public.product_units (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- ── Payments ─────────────────────────────────────────────────────────────────
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  provider text not null default 'mock',
  method text not null
    check (method in ('mtn_momo', 'airtel', 'zamtel', 'card', 'cod')),
  amount_zmw numeric(12, 2) not null check (amount_zmw >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'succeeded', 'failed')),
  provider_ref text not null unique,
  raw_webhook jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_order_id_idx on public.payments (order_id);
create index if not exists payments_provider_ref_idx on public.payments (provider_ref);
create index if not exists payments_status_idx on public.payments (status);

-- updated_at triggers (set_updated_at from Phase 2)
drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- ── RLS: no direct client reads/writes; use RPCs below ───────────────────────
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

-- Deny-all by default (no policies). Service role / security definer bypasses RLS.

-- ── Helpers ──────────────────────────────────────────────────────────────────
create or replace function public.generate_order_number()
returns text
language plpgsql
as $$
declare
  candidate text;
begin
  loop
    candidate := 'TTS-' || to_char(now(), 'YYMMDD') || '-' ||
      upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    exit when not exists (
      select 1 from public.orders o where o.order_number = candidate
    );
  end loop;
  return candidate;
end;
$$;

-- Create guest order + items + payment row. Returns json payload.
create or replace function public.create_guest_order(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_payment_ref text;
  v_item jsonb;
  v_method text;
  v_amount numeric;
begin
  v_method := payload->>'payment_method';
  if v_method is null or v_method not in ('mtn_momo', 'airtel', 'zamtel', 'card', 'cod') then
    raise exception 'invalid payment_method';
  end if;

  if coalesce(payload->>'customer_name', '') = '' then
    raise exception 'customer_name required';
  end if;
  if coalesce(payload->>'customer_phone', '') = '' then
    raise exception 'customer_phone required';
  end if;
  if coalesce(payload->>'delivery_area', '') = '' then
    raise exception 'delivery_area required';
  end if;
  if coalesce(payload->>'address', '') = '' then
    raise exception 'address required';
  end if;
  if jsonb_typeof(payload->'items') <> 'array' or jsonb_array_length(payload->'items') < 1 then
    raise exception 'items required';
  end if;

  v_order_number := public.generate_order_number();
  v_payment_ref := 'mock_' || replace(gen_random_uuid()::text, '-', '');
  v_amount := coalesce((payload->>'amount_due_zmw')::numeric, 0);

  insert into public.orders (
    order_number, customer_name, customer_phone, delivery_area, address,
    status, payment_method, subtotal_zmw, deposit_zmw, amount_due_zmw, notes
  ) values (
    v_order_number,
    trim(payload->>'customer_name'),
    regexp_replace(trim(payload->>'customer_phone'), '\s+', '', 'g'),
    trim(payload->>'delivery_area'),
    trim(payload->>'address'),
    case when v_method = 'cod' then 'pending' else 'pending' end,
    v_method,
    coalesce((payload->>'subtotal_zmw')::numeric, 0),
    coalesce((payload->>'deposit_zmw')::numeric, 0),
    v_amount,
    nullif(trim(coalesce(payload->>'notes', '')), '')
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(payload->'items')
  loop
    insert into public.order_items (
      order_id, product_id, product_name, product_slug,
      unit_price_zmw, quantity, is_preorder, deposit_zmw
    ) values (
      v_order_id,
      nullif(v_item->>'product_id', '')::uuid,
      v_item->>'product_name',
      v_item->>'product_slug',
      coalesce((v_item->>'unit_price_zmw')::numeric, 0),
      coalesce((v_item->>'quantity')::int, 1),
      coalesce((v_item->>'is_preorder')::boolean, false),
      nullif(v_item->>'deposit_zmw', '')::numeric
    );
  end loop;

  insert into public.payments (
    order_id, provider, method, amount_zmw, status, provider_ref
  ) values (
    v_order_id,
    'mock',
    v_method,
    v_amount,
    case when v_method = 'cod' then 'pending' else 'pending' end,
    v_payment_ref
  );

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'payment_ref', v_payment_ref,
    'status', 'pending',
    'payment_method', v_method,
    'amount_due_zmw', v_amount
  );
end;
$$;

revoke all on function public.create_guest_order(jsonb) from public;
grant execute on function public.create_guest_order(jsonb) to anon, authenticated;

-- Track by order number + phone (normalised digits)
create or replace function public.track_order_by_phone(
  p_order_number text,
  p_phone text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_phone text;
  v_items jsonb;
  v_payment jsonb;
begin
  v_phone := regexp_replace(coalesce(p_phone, ''), '\s+', '', 'g');

  select * into v_order
  from public.orders o
  where upper(o.order_number) = upper(trim(coalesce(p_order_number, '')))
    and regexp_replace(o.customer_phone, '\s+', '', 'g') = v_phone;

  if not found then
    return null;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id,
    'product_id', i.product_id,
    'product_name', i.product_name,
    'product_slug', i.product_slug,
    'unit_price_zmw', i.unit_price_zmw,
    'quantity', i.quantity,
    'is_preorder', i.is_preorder,
    'deposit_zmw', i.deposit_zmw
  ) order by i.created_at), '[]'::jsonb)
  into v_items
  from public.order_items i
  where i.order_id = v_order.id;

  select jsonb_build_object(
    'id', p.id,
    'provider', p.provider,
    'method', p.method,
    'amount_zmw', p.amount_zmw,
    'status', p.status,
    'provider_ref', p.provider_ref
  )
  into v_payment
  from public.payments p
  where p.order_id = v_order.id
  order by p.created_at desc
  limit 1;

  return jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'customer_name', v_order.customer_name,
    'customer_phone', v_order.customer_phone,
    'delivery_area', v_order.delivery_area,
    'address', v_order.address,
    'status', v_order.status,
    'payment_method', v_order.payment_method,
    'subtotal_zmw', v_order.subtotal_zmw,
    'deposit_zmw', v_order.deposit_zmw,
    'amount_due_zmw', v_order.amount_due_zmw,
    'notes', v_order.notes,
    'paid_at', v_order.paid_at,
    'out_for_delivery_at', v_order.out_for_delivery_at,
    'delivered_at', v_order.delivered_at,
    'created_at', v_order.created_at,
    'items', v_items,
    'payment', v_payment
  );
end;
$$;

revoke all on function public.track_order_by_phone(text, text) from public;
grant execute on function public.track_order_by_phone(text, text) to anon, authenticated;

-- App config for webhook secret (set via SQL Editor — see phase-3-run.md)
create table if not exists public.app_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.app_config enable row level security;
-- No public policies: only security definer / service role can read.

-- Payment confirmation — only via webhook secret (server passes MOCK_WEBHOOK_SECRET)
create or replace function public.confirm_payment_webhook(
  p_provider_ref text,
  p_secret text,
  p_raw jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_expected text;
  v_payment public.payments%rowtype;
  v_order public.orders%rowtype;
begin
  select value into v_expected
  from public.app_config
  where key = 'mock_webhook_secret';

  if v_expected is null or v_expected = '' or p_secret is distinct from v_expected then
    raise exception 'invalid webhook secret';
  end if;

  select * into v_payment
  from public.payments
  where provider_ref = p_provider_ref
  for update;

  if not found then
    raise exception 'payment not found';
  end if;

  if v_payment.status = 'succeeded' then
    select * into v_order from public.orders where id = v_payment.order_id;
    return jsonb_build_object(
      'ok', true,
      'already', true,
      'order_number', v_order.order_number,
      'status', v_order.status
    );
  end if;

  update public.payments
  set status = 'succeeded',
      raw_webhook = coalesce(p_raw, '{}'::jsonb),
      updated_at = now()
  where id = v_payment.id;

  update public.orders
  set status = 'paid',
      paid_at = coalesce(paid_at, now()),
      updated_at = now()
  where id = v_payment.order_id
  returning * into v_order;

  return jsonb_build_object(
    'ok', true,
    'already', false,
    'order_number', v_order.order_number,
    'status', v_order.status,
    'paid_at', v_order.paid_at
  );
end;
$$;

revoke all on function public.confirm_payment_webhook(text, text, jsonb) from public;
grant execute on function public.confirm_payment_webhook(text, text, jsonb) to anon, authenticated;

-- Get order by number alone for confirmation page (limited fields; phone not required)
-- Still gated: only returns non-sensitive summary if order exists.
create or replace function public.get_order_confirmation(p_order_number text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_items jsonb;
  v_payment jsonb;
begin
  select * into v_order
  from public.orders o
  where upper(o.order_number) = upper(trim(coalesce(p_order_number, '')));

  if not found then
    return null;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id,
    'product_name', i.product_name,
    'product_slug', i.product_slug,
    'unit_price_zmw', i.unit_price_zmw,
    'quantity', i.quantity,
    'is_preorder', i.is_preorder,
    'deposit_zmw', i.deposit_zmw
  ) order by i.created_at), '[]'::jsonb)
  into v_items
  from public.order_items i
  where i.order_id = v_order.id;

  select jsonb_build_object(
    'method', p.method,
    'amount_zmw', p.amount_zmw,
    'status', p.status,
    'provider_ref', p.provider_ref
  )
  into v_payment
  from public.payments p
  where p.order_id = v_order.id
  order by p.created_at desc
  limit 1;

  return jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'customer_name', v_order.customer_name,
    'customer_phone', v_order.customer_phone,
    'delivery_area', v_order.delivery_area,
    'address', v_order.address,
    'status', v_order.status,
    'payment_method', v_order.payment_method,
    'subtotal_zmw', v_order.subtotal_zmw,
    'deposit_zmw', v_order.deposit_zmw,
    'amount_due_zmw', v_order.amount_due_zmw,
    'paid_at', v_order.paid_at,
    'out_for_delivery_at', v_order.out_for_delivery_at,
    'delivered_at', v_order.delivered_at,
    'created_at', v_order.created_at,
    'items', v_items,
    'payment', v_payment
  );
end;
$$;

revoke all on function public.get_order_confirmation(text) from public;
grant execute on function public.get_order_confirmation(text) to anon, authenticated;

-- Set webhook secret once (must match MOCK_WEBHOOK_SECRET in .env.local):
--   insert into public.app_config (key, value)
--   values ('mock_webhook_secret', 'thattechstore-mock-webhook-dev')
--   on conflict (key) do update set value = excluded.value, updated_at = now();
-- Next.js webhook route also checks MOCK_WEBHOOK_SECRET before calling this RPC.
