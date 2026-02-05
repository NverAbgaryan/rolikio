-- Add brief fields to orders (MVP)

alter table public.orders
  add column if not exists brief_want text null,
  add column if not exists brief_avoid text null,
  add column if not exists brief_must_include text null;

