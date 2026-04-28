create table if not exists public.tenant_portal_profiles (
  email text not null,
  approval_code text not null,
  full_name text,
  phone text,
  mailing_address text,
  preferred_contact text,
  emergency_contact_name text,
  emergency_contact_phone text,
  notes text,
  updated_at timestamptz not null default now(),
  primary key (email, approval_code)
);

alter table public.tenant_portal_profiles enable row level security;
alter table public.tenant_portal_profiles force row level security;

revoke all on table public.tenant_portal_profiles from public, anon, authenticated;
grant select, insert, update on table public.tenant_portal_profiles to anon, authenticated;

drop policy if exists "tenant_portal_profiles_select_public" on public.tenant_portal_profiles;
create policy "tenant_portal_profiles_select_public"
  on public.tenant_portal_profiles for select
  to anon, authenticated
  using (true);

drop policy if exists "tenant_portal_profiles_insert_public" on public.tenant_portal_profiles;
create policy "tenant_portal_profiles_insert_public"
  on public.tenant_portal_profiles for insert
  to anon, authenticated
  with check (true);

drop policy if exists "tenant_portal_profiles_update_public" on public.tenant_portal_profiles;
create policy "tenant_portal_profiles_update_public"
  on public.tenant_portal_profiles for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "tenant_portal_profiles_service_role_all" on public.tenant_portal_profiles;
create policy "tenant_portal_profiles_service_role_all"
  on public.tenant_portal_profiles for all
  to service_role
  using (true)
  with check (true);

create or replace function public.get_tenant_portal_profile(p_email text, p_code text)
returns table (
  full_name text,
  phone text,
  mailing_address text,
  preferred_contact text,
  emergency_contact_name text,
  emergency_contact_phone text,
  notes text
)
language sql
security definer
set search_path = public
as $$
  select
    p.full_name,
    p.phone,
    p.mailing_address,
    p.preferred_contact,
    p.emergency_contact_name,
    p.emergency_contact_phone,
    p.notes
  from public.tenant_portal_profiles p
  where lower(p.email) = lower(p_email)
    and lower(p.approval_code) = lower(p_code)
  limit 1;
$$;

grant execute on function public.get_tenant_portal_profile(text, text) to anon, authenticated, service_role;
