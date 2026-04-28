create or replace function public.get_tenant_portal_bookings(p_email text, p_code text)
returns table (
  property_id uuid,
  requested_date date,
  requested_end_date date,
  status text,
  schedule_approved boolean,
  payment_received boolean,
  insurance_verified boolean,
  waivers_verified boolean,
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
    coalesce(b.schedule_approved, false) as schedule_approved,
    coalesce(b.payment_received, false) as payment_received,
    coalesce(b.insurance_verified, false) as insurance_verified,
    coalesce(b.waivers_verified, false) as waivers_verified,
    b.created_at
  from public.property_bookings b
  where lower(b.email) = lower(p_email)
    and lower(coalesce(b.tenant_approval_code, '')) = lower(p_code)
  order by b.created_at desc;
$$;

grant execute on function public.get_tenant_portal_bookings(text, text) to anon, authenticated, service_role;
