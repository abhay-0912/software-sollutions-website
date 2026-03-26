-- Auto-generate unique slugs from project title when slug is not provided.
create extension if not exists unaccent;

create or replace function public.generate_project_slug(input_title text)
returns text
language plpgsql
as $$
declare
  base_slug text;
  candidate_slug text;
  suffix integer := 1;
begin
  base_slug := lower(trim(regexp_replace(unaccent(coalesce(input_title, '')), '[^a-zA-Z0-9\s-]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);

  if base_slug = '' then
    base_slug := 'project';
  end if;

  candidate_slug := base_slug;

  while exists (select 1 from public.projects where slug = candidate_slug) loop
    suffix := suffix + 1;
    candidate_slug := base_slug || '-' || suffix::text;
  end loop;

  return candidate_slug;
end;
$$;

create or replace function public.projects_set_slug()
returns trigger
language plpgsql
as $$
begin
  if new.slug is null or trim(new.slug) = '' then
    new.slug := public.generate_project_slug(new.title);
  end if;

  return new;
end;
$$;

drop trigger if exists trg_projects_set_slug on public.projects;

create trigger trg_projects_set_slug
before insert on public.projects
for each row
execute function public.projects_set_slug();
