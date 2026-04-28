create table if not exists public.insurance_documents (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  approval_code text not null,
  policy_number text,
  file_name text not null,
  file_path text not null,
  created_at timestamptz not null default now()
);

alter table public.insurance_documents enable row level security;
alter table public.insurance_documents force row level security;

revoke all on table public.insurance_documents from public, anon, authenticated;
grant insert on table public.insurance_documents to anon, authenticated;

drop policy if exists "insurance_documents_insert_public" on public.insurance_documents;
create policy "insurance_documents_insert_public"
  on public.insurance_documents for insert
  to anon, authenticated
  with check (true);

drop policy if exists "insurance_documents_service_role_all" on public.insurance_documents;
create policy "insurance_documents_service_role_all"
  on public.insurance_documents for all
  to service_role
  using (true)
  with check (true);

drop policy if exists "insurance_documents_select_by_email_code" on public.insurance_documents;
create policy "insurance_documents_select_by_email_code"
  on public.insurance_documents for select
  to anon, authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('tenant-documents', 'tenant-documents', false)
on conflict (id) do nothing;

drop policy if exists "tenant_documents_insert" on storage.objects;
create policy "tenant_documents_insert"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'tenant-documents');

drop policy if exists "tenant_documents_select" on storage.objects;
create policy "tenant_documents_select"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'tenant-documents');
