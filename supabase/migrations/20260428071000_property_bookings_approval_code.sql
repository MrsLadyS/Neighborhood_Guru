-- Add tenant approval code for scheduling requests.
alter table public.property_bookings add column if not exists tenant_approval_code text;

comment on column public.property_bookings.tenant_approval_code is 'Approval code issued to approved tenants; required for /schedule submissions.';
