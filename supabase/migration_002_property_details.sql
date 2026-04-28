-- Run in Supabase SQL Editor if you already applied schema.sql before these columns existed.

alter table public.properties
  add column if not exists description text,
  add column if not exists floor_plan_url text,
  add column if not exists gallery_urls jsonb not null default '[]'::jsonb,
  add column if not exists unit_label text;
