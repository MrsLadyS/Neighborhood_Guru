create table if not exists public.waiver_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  waiver_key text not null,
  waiver_version text not null,
  signer_name text not null,
  signer_email text not null,
  approval_code text not null,
  property_id uuid references public.properties (id) on delete set null,
  accepted_at timestamptz not null default now()
);

create table if not exists public.waiver_invites (
  id uuid primary key default gen_random_uuid(),
  invited_email text not null,
  invited_by_email text not null,
  approval_code text not null,
  property_id uuid references public.properties (id) on delete set null,
  invitation_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.waiver_acknowledgements enable row level security;
alter table public.waiver_invites enable row level security;
alter table public.waiver_acknowledgements force row level security;
alter table public.waiver_invites force row level security;

revoke all on table public.waiver_acknowledgements from public, anon, authenticated;
revoke all on table public.waiver_invites from public, anon, authenticated;
grant select, insert on table public.waiver_acknowledgements to anon, authenticated;
grant select, insert on table public.waiver_invites to anon, authenticated;

drop policy if exists "waiver_ack_select_public" on public.waiver_acknowledgements;
create policy "waiver_ack_select_public"
  on public.waiver_acknowledgements for select
  to anon, authenticated
  using (true);

drop policy if exists "waiver_ack_insert_public" on public.waiver_acknowledgements;
create policy "waiver_ack_insert_public"
  on public.waiver_acknowledgements for insert
  to anon, authenticated
  with check (true);

drop policy if exists "waiver_invites_select_public" on public.waiver_invites;
create policy "waiver_invites_select_public"
  on public.waiver_invites for select
  to anon, authenticated
  using (true);

drop policy if exists "waiver_invites_insert_public" on public.waiver_invites;
create policy "waiver_invites_insert_public"
  on public.waiver_invites for insert
  to anon, authenticated
  with check (true);

drop policy if exists "waiver_ack_service_role_all" on public.waiver_acknowledgements;
create policy "waiver_ack_service_role_all"
  on public.waiver_acknowledgements for all
  to service_role
  using (true)
  with check (true);

drop policy if exists "waiver_invites_service_role_all" on public.waiver_invites;
create policy "waiver_invites_service_role_all"
  on public.waiver_invites for all
  to service_role
  using (true)
  with check (true);
