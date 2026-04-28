-- RLS hardening for Neighborhood Guru Property Management
-- Safe to run on existing databases.

alter table if exists public.properties enable row level security;
alter table if exists public.property_bookings enable row level security;
alter table if exists public.tenant_registrations enable row level security;

alter table if exists public.properties force row level security;
alter table if exists public.property_bookings force row level security;
alter table if exists public.tenant_registrations force row level security;

-- Lock down table grants, then grant only what app needs for anon/authenticated.
revoke all on table public.properties from public, anon, authenticated;
revoke all on table public.property_bookings from public, anon, authenticated;
revoke all on table public.tenant_registrations from public, anon, authenticated;

grant select on table public.properties to anon, authenticated;
grant insert on table public.property_bookings to anon, authenticated;
grant insert on table public.tenant_registrations to anon, authenticated;
grant execute on function public.get_unavailable_ranges() to anon, authenticated, service_role;
grant execute on function public.get_tenant_portal_bookings(text, text) to anon, authenticated, service_role;

drop policy if exists "properties_select_public" on public.properties;
create policy "properties_select_public"
  on public.properties for select
  to anon, authenticated
  using (true);

drop policy if exists "bookings_insert_public" on public.property_bookings;
create policy "bookings_insert_public"
  on public.property_bookings for insert
  to anon, authenticated
  with check (true);

drop policy if exists "tenant_reg_insert_public" on public.tenant_registrations;
create policy "tenant_reg_insert_public"
  on public.tenant_registrations for insert
  to anon, authenticated
  with check (true);

-- Internal/admin access through Supabase service role.
drop policy if exists "properties_service_role_all" on public.properties;
create policy "properties_service_role_all"
  on public.properties for all
  to service_role
  using (true)
  with check (true);

drop policy if exists "bookings_service_role_all" on public.property_bookings;
create policy "bookings_service_role_all"
  on public.property_bookings for all
  to service_role
  using (true)
  with check (true);

drop policy if exists "tenant_reg_service_role_all" on public.tenant_registrations;
create policy "tenant_reg_service_role_all"
  on public.tenant_registrations for all
  to service_role
  using (true)
  with check (true);
