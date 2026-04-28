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

grant execute on function public.get_tenant_portal_bookings(text, text) to anon, authenticated, service_role;
