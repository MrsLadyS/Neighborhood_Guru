-- Neighborhood Guru Property Management — run in Supabase SQL Editor
-- Enables scheduling, tenant applications, and optional property listings.

create extension if not exists "pgcrypto";
create extension if not exists "btree_gist";

-- Optional: properties you show on the booking form
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  address_line text,
  city text,
  region text,
  postal_code text,
  monthly_rent_cents integer,
  bedrooms smallint,
  bathrooms numeric(3,1),
  is_featured boolean not null default false,
  image_url text,
  description text,
  floor_plan_url text,
  gallery_urls jsonb not null default '[]'::jsonb,
  unit_label text,
  created_at timestamptz not null default now()
);

-- Rental scheduling requests (marketing site — general inquiry + optional rental period window)
create table if not exists public.property_bookings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties (id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  requested_date date not null,
  requested_end_date date,
  tenant_approval_code text,
  time_slot text not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'property_bookings_no_overlap'
  ) then
    alter table public.property_bookings
      add constraint property_bookings_no_overlap
      exclude using gist (
        property_id with =,
        daterange(requested_date, requested_end_date + 1, '[)') with &&
      )
      where (
        status in ('pending', 'confirmed')
        and property_id is not null
        and requested_end_date is not null
      );
  end if;
end
$$;

-- Tenant intake
create table if not exists public.tenant_registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  date_of_birth date,
  current_address text,
  employer text,
  monthly_income_range text,
  desired_move_in date,
  property_interest text,
  occupants_count smallint,
  has_pets boolean,
  pet_details text,
  emergency_contact_name text,
  emergency_contact_phone text,
  additional_notes text,
  created_at timestamptz not null default now()
);

create or replace function public.get_unavailable_ranges()
returns table (
  property_id uuid,
  requested_date date,
  requested_end_date date
)
language sql
security definer
set search_path = public
as $$
  select
    b.property_id,
    b.requested_date,
    b.requested_end_date
  from public.property_bookings b
  where b.status in ('pending', 'confirmed')
    and b.property_id is not null
    and b.requested_end_date is not null;
$$;

create or replace function public.get_tenant_portal_bookings(p_email text, p_code text)
returns table (
  property_id uuid,
  requested_date date,
  requested_end_date date,
  status text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    b.property_id,
    b.requested_date,
    b.requested_end_date,
    b.status,
    b.created_at
  from public.property_bookings b
  where lower(b.email) = lower(p_email)
    and lower(coalesce(b.tenant_approval_code, '')) = lower(p_code)
  order by b.created_at desc;
$$;

alter table public.properties enable row level security;
alter table public.property_bookings enable row level security;
alter table public.tenant_registrations enable row level security;
alter table public.properties force row level security;
alter table public.property_bookings force row level security;
alter table public.tenant_registrations force row level security;

revoke all on table public.properties from public, anon, authenticated;
revoke all on table public.property_bookings from public, anon, authenticated;
revoke all on table public.tenant_registrations from public, anon, authenticated;

grant select on table public.properties to anon, authenticated;
grant insert on table public.property_bookings to anon, authenticated;
grant insert on table public.tenant_registrations to anon, authenticated;
grant execute on function public.get_unavailable_ranges() to anon, authenticated, service_role;
grant execute on function public.get_tenant_portal_bookings(text, text) to anon, authenticated, service_role;

-- Public read for featured listings (optional). Restrict if you only use service role in dashboard.
create policy "properties_select_public"
  on public.properties for select
  to anon, authenticated
  using (true);

create policy "bookings_insert_public"
  on public.property_bookings for insert
  to anon, authenticated
  with check (true);

create policy "tenant_reg_insert_public"
  on public.tenant_registrations for insert
  to anon, authenticated
  with check (true);

create policy "properties_service_role_all"
  on public.properties for all
  to service_role
  using (true)
  with check (true);

create policy "bookings_service_role_all"
  on public.property_bookings for all
  to service_role
  using (true)
  with check (true);

create policy "tenant_reg_service_role_all"
  on public.tenant_registrations for all
  to service_role
  using (true)
  with check (true);

-- No public read on submissions (admin views via Supabase dashboard or service role in internal tools)

comment on column public.property_bookings.requested_end_date is 'Desired rental/stay end date when tenant schedules a period on /schedule';
comment on column public.property_bookings.tenant_approval_code is 'Approval code issued to approved tenants; required for /schedule submissions.';
comment on table public.property_bookings is 'Rental inquiry and scheduling requests from the marketing site';
comment on table public.tenant_registrations is 'Tenant application / registration submissions';
