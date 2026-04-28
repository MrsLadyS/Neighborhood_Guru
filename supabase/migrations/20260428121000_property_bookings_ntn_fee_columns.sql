-- Manual Marina Grande compliance flags.
-- No auto-approval; all flags default to false until staff confirms.

alter table if exists public.property_bookings
  add column if not exists ntn_completed boolean not null default false,
  add column if not exists ntn_completed_at timestamptz,
  add column if not exists ntn_completed_by text,
  add column if not exists ntn_fee_paid boolean not null default false,
  add column if not exists ntn_fee_paid_at timestamptz,
  add column if not exists ntn_fee_paid_by text;

comment on column public.property_bookings.ntn_completed is
  'Manual flag set by staff when NTN screening is completed (Marina Grande requirement).';
comment on column public.property_bookings.ntn_completed_at is
  'Timestamp when NTN completion was manually confirmed.';
comment on column public.property_bookings.ntn_completed_by is
  'Staff identifier/email for manual NTN completion confirmation.';

comment on column public.property_bookings.ntn_fee_paid is
  'Manual flag set by staff when the Marina Grande NTN application fee is paid.';
comment on column public.property_bookings.ntn_fee_paid_at is
  'Timestamp when NTN application fee payment was manually confirmed.';
comment on column public.property_bookings.ntn_fee_paid_by is
  'Staff identifier/email for manual NTN fee payment confirmation.';
