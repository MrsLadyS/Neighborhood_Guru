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

grant execute on function public.get_unavailable_ranges() to anon, authenticated, service_role;
