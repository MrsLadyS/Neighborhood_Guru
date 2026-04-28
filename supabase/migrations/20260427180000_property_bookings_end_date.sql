-- Existing deployments: add optional rental-period end date for /schedule submissions.
alter table public.property_bookings add column if not exists requested_end_date date;

comment on column public.property_bookings.requested_end_date is 'Desired rental/stay end date when tenant schedules a period on /schedule';
