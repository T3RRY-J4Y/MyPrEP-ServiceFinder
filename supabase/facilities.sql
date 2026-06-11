-- ============================================================
-- Service Finder tables — run this ONCE in the Supabase SQL
-- editor (Dashboard → SQL Editor → New query → paste → Run)
-- ============================================================

-- Each CSV upload becomes one "dataset"
create table if not exists public.facility_datasets (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  filename   text,
  services   text[] not null,
  row_count  int  not null default 0,
  skipped    int  not null default 0,
  created_at timestamptz not null default now()
);

-- Individual facilities (rows from the CSVs)
create table if not exists public.facilities (
  id         uuid primary key default gen_random_uuid(),
  dataset_id uuid not null references public.facility_datasets(id) on delete cascade,
  name       text not null,
  address    text not null default '',
  area       text not null default '',
  phone      text not null default '',
  email      text not null default '',
  type       text not null default '',
  lat        double precision not null,
  lng        double precision not null,
  services   text[] not null,
  created_at timestamptz not null default now()
);

create index if not exists facilities_services_idx on public.facilities using gin (services);
create index if not exists facilities_dataset_idx  on public.facilities (dataset_id);

-- ── Row Level Security ──────────────────────────────────────
-- Anyone may READ (the public finder), only signed-in admins may WRITE.
alter table public.facility_datasets enable row level security;
alter table public.facilities        enable row level security;

drop policy if exists "public read datasets"   on public.facility_datasets;
drop policy if exists "admin write datasets"   on public.facility_datasets;
drop policy if exists "admin delete datasets"  on public.facility_datasets;
drop policy if exists "public read facilities" on public.facilities;
drop policy if exists "admin write facilities" on public.facilities;
drop policy if exists "admin delete facilities" on public.facilities;

create policy "public read datasets"
  on public.facility_datasets for select
  to anon, authenticated using (true);

create policy "admin write datasets"
  on public.facility_datasets for insert
  to authenticated with check (true);

create policy "admin delete datasets"
  on public.facility_datasets for delete
  to authenticated using (true);

create policy "public read facilities"
  on public.facilities for select
  to anon, authenticated using (true);

create policy "admin write facilities"
  on public.facilities for insert
  to authenticated with check (true);

create policy "admin delete facilities"
  on public.facilities for delete
  to authenticated using (true);
