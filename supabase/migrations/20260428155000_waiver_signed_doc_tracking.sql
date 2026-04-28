-- Track signed waiver artifacts (drawn signature + waiver text snapshot).
-- This preserves what was signed, not just that a signature occurred.

alter table if exists public.waiver_acknowledgements
  add column if not exists signature_data_url text,
  add column if not exists waiver_body_snapshot text;

comment on column public.waiver_acknowledgements.signature_data_url is
  'Base64 data URL (PNG) captured from the in-app signature pad at signing time.';
comment on column public.waiver_acknowledgements.waiver_body_snapshot is
  'Exact waiver body text shown to signer at acknowledgment time.';
