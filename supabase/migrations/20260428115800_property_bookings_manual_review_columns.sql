-- Manual review tracking for tenant completion workflow.
-- This migration adds explicit approval/confirmation columns and does not
-- auto-approve any records.

alter table if exists public.property_bookings
  add column if not exists schedule_approved boolean not null default false,
  add column if not exists schedule_approved_at timestamptz,
  add column if not exists schedule_approved_by text,
  add column if not exists payment_received boolean not null default false,
  add column if not exists payment_received_at timestamptz,
  add column if not exists payment_received_by text,
  add column if not exists insurance_verified boolean not null default false,
  add column if not exists insurance_verified_at timestamptz,
  add column if not exists insurance_verified_by text,
  add column if not exists waivers_verified boolean not null default false,
  add column if not exists waivers_verified_at timestamptz,
  add column if not exists waivers_verified_by text,
  add column if not exists admin_review_notes text;

comment on column public.property_bookings.schedule_approved is
  'Manual flag set by staff when rental schedule request is approved.';
comment on column public.property_bookings.schedule_approved_at is
  'Timestamp when schedule_approved was manually confirmed.';
comment on column public.property_bookings.schedule_approved_by is
  'Staff identifier/email for manual schedule approval.';

comment on column public.property_bookings.payment_received is
  'Manual flag set by staff after payment is received/confirmed.';
comment on column public.property_bookings.payment_received_at is
  'Timestamp when payment_received was manually confirmed.';
comment on column public.property_bookings.payment_received_by is
  'Staff identifier/email for manual payment confirmation.';

comment on column public.property_bookings.insurance_verified is
  'Manual flag set by staff after required insurance documentation is verified.';
comment on column public.property_bookings.insurance_verified_at is
  'Timestamp when insurance_verified was manually confirmed.';
comment on column public.property_bookings.insurance_verified_by is
  'Staff identifier/email for manual insurance verification.';

comment on column public.property_bookings.waivers_verified is
  'Manual flag set by staff after applicable waiver acknowledgements are verified.';
comment on column public.property_bookings.waivers_verified_at is
  'Timestamp when waivers_verified was manually confirmed.';
comment on column public.property_bookings.waivers_verified_by is
  'Staff identifier/email for manual waiver verification.';

comment on column public.property_bookings.admin_review_notes is
  'Optional internal notes entered by staff during manual review.';
