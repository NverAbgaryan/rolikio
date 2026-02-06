-- 0003: Payment fields + subscription + content piece tables

-- Add payment fields to orders (Ruul.io checkout link approach)
alter table public.orders
  add column if not exists content_type text not null default 'reel' check (content_type in ('reel','photo','carousel','story')),
  add column if not exists ruul_checkout_url text null,
  add column if not exists payment_status text not null default 'unpaid' check (payment_status in ('unpaid','pending','paid','failed')),
  add column if not exists paid_at timestamptz null;

-- Subscriptions table
do $$ begin
  create type public.subscription_plan as enum ('starter', 'growth');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.subscription_status as enum ('active', 'past_due', 'canceled');
exception when duplicate_object then null; end $$;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  email text not null,
  plan public.subscription_plan not null,
  status public.subscription_status not null default 'active',
  pieces_per_month integer not null,
  pieces_used_this_period integer not null default 0,
  revisions_per_piece integer not null default 1,
  shared_folder_url text null,
  ruul_checkout_url text null,
  ruul_payment_status text not null default 'unpaid',
  current_period_start timestamptz null,
  current_period_end timestamptz null,
  canceled_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);
create index if not exists subscriptions_email_idx on public.subscriptions(email);

-- Auto-update updated_at on subscriptions
drop trigger if exists trg_subscriptions_set_updated_at on public.subscriptions;
create trigger trg_subscriptions_set_updated_at
before update on public.subscriptions
for each row
execute procedure public.set_updated_at();

-- Content pieces table
do $$ begin
  create type public.content_piece_status as enum (
    'raw_received',
    'in_review',
    'in_progress',
    'delivered',
    'revision_requested',
    'revision_in_progress',
    'approved',
    'ready_to_post',
    'skipped'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.content_type_enum as enum ('reel', 'photo', 'carousel', 'story');
exception when duplicate_object then null; end $$;

create table if not exists public.content_pieces (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  user_id uuid null references auth.users(id) on delete set null,
  email text not null,
  type public.content_type_enum not null default 'reel',
  status public.content_piece_status not null default 'raw_received',
  revisions_included integer not null default 1,
  revisions_used integer not null default 0,
  suggested_caption text null,
  suggested_song_name text null,
  suggested_song_artist text null,
  suggested_song_url text null,
  suggested_post_date date null,
  due_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_pieces_subscription_id_idx on public.content_pieces(subscription_id);
create index if not exists content_pieces_status_idx on public.content_pieces(status);
create index if not exists content_pieces_due_at_idx on public.content_pieces(due_at);
create index if not exists content_pieces_user_id_idx on public.content_pieces(user_id);

drop trigger if exists trg_content_pieces_set_updated_at on public.content_pieces;
create trigger trg_content_pieces_set_updated_at
before update on public.content_pieces
for each row
execute procedure public.set_updated_at();

-- Content piece assets
create table if not exists public.content_piece_assets (
  id uuid primary key default gen_random_uuid(),
  content_piece_id uuid not null references public.content_pieces(id) on delete cascade,
  kind public.asset_kind not null,
  storage_key text not null,
  filename text not null,
  mime_type text not null,
  size_bytes bigint not null,
  duration_seconds integer null,
  created_at timestamptz not null default now()
);
create index if not exists content_piece_assets_piece_id_idx on public.content_piece_assets(content_piece_id);

-- Content piece deliveries
create table if not exists public.content_piece_deliveries (
  id uuid primary key default gen_random_uuid(),
  content_piece_id uuid not null references public.content_pieces(id) on delete cascade,
  version_number integer not null,
  storage_key text not null,
  filename text not null,
  duration_seconds integer null,
  created_at timestamptz not null default now(),
  unique(content_piece_id, version_number)
);
create index if not exists content_piece_deliveries_piece_id_idx on public.content_piece_deliveries(content_piece_id);
