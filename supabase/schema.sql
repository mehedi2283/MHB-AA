create extension if not exists pgcrypto;

create table if not exists public.cms_documents (
  id uuid primary key default gen_random_uuid(),
  collection text not null,
  data jsonb not null default '{}'::jsonb,
  sort_order integer not null default 999,
  status text not null default 'published',
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cms_documents_collection_order_idx
  on public.cms_documents (collection, sort_order, created_at desc);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'cms_documents_collection_not_blank'
      and conrelid = 'public.cms_documents'::regclass
  ) then
    alter table public.cms_documents
      add constraint cms_documents_collection_not_blank
      check (btrim(collection) <> '');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'cms_documents_status_check'
      and conrelid = 'public.cms_documents'::regclass
  ) then
    alter table public.cms_documents
      add constraint cms_documents_status_check
      check (status in ('draft', 'published', 'archived', 'complete'));
  end if;
end $$;

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_by text,
  updated_at timestamptz not null default now()
);

create table if not exists public.admins (
  email text primary key,
  full_name text not null default '',
  password_hash text not null,
  role text not null default 'admin',
  created_by text,
  created_at timestamptz not null default now(),
  last_login timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.admins add column if not exists full_name text not null default '';
alter table public.admins add column if not exists created_by text;
alter table public.admins add column if not exists created_at timestamptz not null default now();

create unique index if not exists admins_email_lower_idx
  on public.admins (lower(email));

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'admins_role_check'
      and conrelid = 'public.admins'::regclass
  ) then
    alter table public.admins
      add constraint admins_role_check check (role in ('owner', 'admin'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'admins_email_lowercase_check'
      and conrelid = 'public.admins'::regclass
  ) then
    alter table public.admins
      add constraint admins_email_lowercase_check check (email = lower(email));
  end if;
end $$;

create table if not exists public.app_settings (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id text not null,
  action text not null,
  entity text not null,
  entity_id text,
  created_at timestamptz not null default now()
);

create index if not exists activity_logs_created_at_idx
  on public.activity_logs (created_at desc);

alter table public.cms_documents enable row level security;
alter table public.site_content enable row level security;
alter table public.admins enable row level security;
alter table public.app_settings enable row level security;
alter table public.activity_logs enable row level security;

revoke all on table public.cms_documents from public, anon, authenticated;
revoke all on table public.site_content from public, anon, authenticated;
revoke all on table public.admins from public, anon, authenticated;
revoke all on table public.app_settings from public, anon, authenticated;
revoke all on table public.activity_logs from public, anon, authenticated;

grant usage on schema public to service_role;
grant select, insert, update, delete on table
  public.cms_documents,
  public.site_content,
  public.admins,
  public.app_settings,
  public.activity_logs
to service_role;

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;

notify pgrst, 'reload schema';
