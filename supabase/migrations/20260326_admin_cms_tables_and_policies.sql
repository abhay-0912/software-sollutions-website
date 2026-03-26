-- Admin CMS supporting tables and policies

create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_image text,
  tags text[] default '{}',
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  message text not null,
  rating int not null default 5,
  avatar_url text,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint testimonials_rating_range check (rating >= 1 and rating <= 5)
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Timestamp triggers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row
execute function public.set_updated_at();

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
before update on public.testimonials
for each row
execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

-- RLS
alter table public.blog_posts enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;

-- Public read access for published website content
create policy if not exists "Public can read published blog posts"
on public.blog_posts
for select
using (published = true);

create policy if not exists "Public can read visible testimonials"
on public.testimonials
for select
using (visible = true);

-- Authenticated admin full access (single-admin setup)
create policy if not exists "Authenticated full blog access"
on public.blog_posts
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy if not exists "Authenticated full testimonials access"
on public.testimonials
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy if not exists "Authenticated full settings access"
on public.site_settings
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Storage bucket for admin uploads
insert into storage.buckets (id, name, public)
values ('admin-media', 'admin-media', true)
on conflict (id) do nothing;

-- Public read on media, authenticated write
create policy if not exists "Public read admin media"
on storage.objects
for select
using (bucket_id = 'admin-media');

create policy if not exists "Authenticated write admin media"
on storage.objects
for all
using (bucket_id = 'admin-media' and auth.role() = 'authenticated')
with check (bucket_id = 'admin-media' and auth.role() = 'authenticated');
