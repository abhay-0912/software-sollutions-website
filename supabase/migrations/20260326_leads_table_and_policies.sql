create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  service_interest text not null,
  budget text not null,
  timeline text not null,
  message text not null,
  referral_source text,
  status text not null default 'new' check (status in ('new', 'contacted', 'in_progress', 'closed', 'spam')),
  created_at timestamptz not null default now()
);

create index if not exists idx_leads_created_at_desc on public.leads (created_at desc);

alter table public.leads enable row level security;

drop policy if exists "Public can insert leads" on public.leads;
create policy "Public can insert leads"
on public.leads
for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads"
on public.leads
for select
to authenticated
using ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
on public.leads
for update
to authenticated
using ((auth.jwt() ->> 'role') = 'admin')
with check ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "Admins can delete leads" on public.leads;
create policy "Admins can delete leads"
on public.leads
for delete
to authenticated
using ((auth.jwt() ->> 'role') = 'admin');
