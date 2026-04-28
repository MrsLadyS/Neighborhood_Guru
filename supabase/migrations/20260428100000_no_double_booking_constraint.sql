create extension if not exists "btree_gist";

do $$
begin
  if exists (
    select 1
    from pg_tables
    where schemaname = 'public'
      and tablename = 'property_bookings'
  ) and not exists (
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
