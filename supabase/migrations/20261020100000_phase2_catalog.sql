-- Phase 2: catalog schema + RLS (public read for active catalog; writes locked down)
-- Apply via Supabase Dashboard → SQL Editor, or `supabase db push` with a linked project.

create extension if not exists "pgcrypto";

-- ── Categories (problem-based) ───────────────────────────────────────────────
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ── Products ─────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  name text not null,
  slug text not null unique,
  price_zmw numeric(12, 2) not null check (price_zmw >= 0),
  description text not null default '',
  problem_solved text not null default '',
  stock_qty int not null default 0 check (stock_qty >= 0),
  is_preorder boolean not null default false,
  preorder_deposit numeric(12, 2),
  images text[] not null default '{}',
  specs jsonb not null default '{}'::jsonb,
  badge text,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_active_idx on public.products (active);
create index if not exists products_featured_idx on public.products (featured) where featured = true;
create index if not exists products_price_idx on public.products (price_zmw);
create index if not exists products_name_search_idx on public.products using gin (
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(problem_solved, ''))
);

-- ── Product units (IMEI / serial / battery for phones) ───────────────────────
create table if not exists public.product_units (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  serial_or_imei text,
  battery_health int check (battery_health is null or (battery_health >= 0 and battery_health <= 100)),
  imei_checked boolean not null default false,
  warranty_months int not null default 0 check (warranty_months >= 0),
  status text not null default 'available'
    check (status in ('available', 'reserved', 'sold', 'returned')),
  created_at timestamptz not null default now()
);

create index if not exists product_units_product_id_idx on public.product_units (product_id);
create index if not exists product_units_status_idx on public.product_units (status);

-- ── Reviews (PDP) ────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete cascade,
  author text not null,
  rating int not null check (rating between 1 and 5),
  body text not null,
  location text not null default 'Lusaka',
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_id_idx on public.reviews (product_id);
create index if not exists reviews_approved_idx on public.reviews (approved) where approved = true;

-- ── Guest carts (optional client sync via guest_token) ───────────────────────
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  guest_token uuid not null unique,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (cart_id, product_id)
);

create index if not exists cart_items_cart_id_idx on public.cart_items (cart_id);

-- ── updated_at helper ────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists carts_set_updated_at on public.carts;
create trigger carts_set_updated_at
  before update on public.carts
  for each row execute function public.set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_units enable row level security;
alter table public.reviews enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;

-- Public read: categories
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories for select
  to anon, authenticated
  using (true);

-- Public read: active products only
drop policy if exists "products_public_read_active" on public.products;
create policy "products_public_read_active"
  on public.products for select
  to anon, authenticated
  using (active = true);

-- Public read: available units for active products (battery/warranty on PDP)
drop policy if exists "product_units_public_read_available" on public.product_units;
create policy "product_units_public_read_available"
  on public.product_units for select
  to anon, authenticated
  using (
    status = 'available'
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.active = true
    )
  );

-- Public read: approved reviews
drop policy if exists "reviews_public_read_approved" on public.reviews;
create policy "reviews_public_read_approved"
  on public.reviews for select
  to anon, authenticated
  using (approved = true);

-- Guest cart: clients pass guest_token; no auth yet.
-- Allow insert/select/update/delete on carts by anyone (guest_token is the secret).
-- Owners will tighten this in Phase 4.
drop policy if exists "carts_guest_all" on public.carts;
create policy "carts_guest_all"
  on public.carts for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "cart_items_guest_all" on public.cart_items;
create policy "cart_items_guest_all"
  on public.cart_items for all
  to anon, authenticated
  using (true)
  with check (true);

-- Writes on catalog tables: locked down (no policies for insert/update/delete).
-- Owner role policies land in Phase 4. Seed/migrations run as postgres/service role.
