-- rolik.io MVP schema (Supabase Postgres)

create extension if not exists pgcrypto;

do $$ begin
  create type public.order_status as enum (
    'DRAFT',
    'QUOTE_REQUESTED',
    'QUOTED',
    'AWAITING_PAYMENT',
    'PAID',
    'IN_REVIEW',
    'IN_PROGRESS',
    'DELIVERED',
    'REVISION_REQUESTED',
    'REVISION_IN_PROGRESS',
    'COMPLETED',
    'CANCELED',
    'REFUNDED'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.editing_level as enum ('basic', 'enhanced', 'pro');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.asset_kind as enum ('video', 'image', 'voice', 'logo');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.message_sender as enum ('client', 'admin', 'editor');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.actor_type as enum ('client', 'admin', 'editor', 'system');
exception when duplicate_object then null; end $$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  email text not null,

  tier text not null check (tier in ('A','B','C')),
  platform text not null check (platform in ('instagram','tiktok','youtube')),
  vibe text not null,
  editing_level public.editing_level not null default 'basic',
  add_ons jsonb not null default '{}'::jsonb,

  status public.order_status not null default 'DRAFT',
  price_cents integer null,
  currency text not null default 'USD',

  raw_limit_seconds integer not null,
  raw_used_seconds integer not null default 0,
  revisions_included integer not null,
  revisions_used integer not null default 0,
  due_at timestamptz null,

  -- Stripe
  stripe_checkout_session_id text null,
  stripe_payment_intent_id text null,

  -- Pro quote-only path
  quote_requested_at timestamptz null,
  quoted_price_cents integer null,
  quoted_due_at timestamptz null,
  quoted_at timestamptz null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_due_at_idx on public.orders(due_at);
create index if not exists orders_email_idx on public.orders(email);

create table if not exists public.order_assets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  kind public.asset_kind not null,
  storage_key text not null,
  filename text not null,
  mime_type text not null,
  size_bytes bigint not null,
  duration_seconds integer null,
  created_at timestamptz not null default now()
);
create index if not exists order_assets_order_id_idx on public.order_assets(order_id);

create table if not exists public.order_references (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  url text not null,
  created_at timestamptz not null default now()
);
create index if not exists order_references_order_id_idx on public.order_references(order_id);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  sender public.message_sender not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_order_id_idx on public.messages(order_id);
create index if not exists messages_created_at_idx on public.messages(created_at);

create table if not exists public.deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  version_number integer not null,
  storage_key text not null,
  filename text not null,
  duration_seconds integer null,
  created_at timestamptz not null default now(),
  unique(order_id, version_number)
);
create index if not exists deliveries_order_id_idx on public.deliveries(order_id);

create table if not exists public.status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  from_status public.order_status null,
  to_status public.order_status not null,
  actor public.actor_type not null default 'system',
  created_at timestamptz not null default now()
);
create index if not exists status_history_order_id_idx on public.status_history(order_id);
create index if not exists status_history_created_at_idx on public.status_history(created_at);

create table if not exists public.stripe_events (
  event_id text primary key,
  type text not null,
  payload jsonb not null,
  processed_at timestamptz null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_orders_set_updated_at on public.orders;
create trigger trg_orders_set_updated_at
before update on public.orders
for each row
execute procedure public.set_updated_at();

