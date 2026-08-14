-- LaunchBharat platform schema.
-- Public submissions are exposed only through a narrow RPC. Administrative
-- reads and writes require an explicit role stored in public.user_roles.

create extension if not exists pgcrypto with schema extensions;

create type public.app_role as enum ('admin', 'reviewer', 'event_manager', 'support');
create type public.application_status as enum ('pending', 'in_review', 'approved', 'rejected');
create type public.event_status as enum ('draft', 'upcoming', 'completed', 'cancelled');
create type public.registration_status as enum ('pending', 'confirmed', 'waitlisted', 'cancelled');
create type public.ticket_status as enum ('confirmed', 'checked_in', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  mobile text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  primary key (user_id, role)
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  application_no text not null unique default (
    'LB-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))
  ),
  full_name text not null,
  email text not null,
  mobile text not null,
  state text not null,
  city text not null,
  college text not null,
  course text,
  graduation_year text,
  idea_title text not null,
  stage text not null,
  category text not null,
  description text not null,
  participant_role text not null,
  linkedin_url text,
  website_url text,
  pitch_deck_url text,
  additional_info text,
  consented_at timestamptz not null,
  status public.application_status not null default 'pending',
  review_notes text,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applications_email_valid check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  constraint applications_mobile_valid check (mobile ~ '^[6-9][0-9]{9}$'),
  constraint applications_description_length check (char_length(description) between 1 and 1200)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  description text not null default '',
  category text not null,
  status public.event_status not null default 'draft',
  is_published boolean not null default false,
  registration_open boolean not null default false,
  venue text not null,
  location text,
  city text,
  state text,
  date_start date not null,
  date_end date,
  highlights text[] not null default '{}',
  max_capacity integer,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_date_order check (date_end is null or date_end >= date_start),
  constraint events_capacity_positive check (max_capacity is null or max_capacity > 0)
);

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  application_id uuid references public.applications(id) on delete set null,
  full_name text not null,
  email text not null,
  mobile text,
  status public.registration_status not null default 'pending',
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, email)
);

create table public.event_tickets (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null unique references public.event_registrations(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  ticket_code text not null unique default (
    'LBT-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))
  ),
  status public.ticket_status not null default 'confirmed',
  checked_in_at timestamptz,
  checked_in_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create table public.notification_outbox (
  id bigint generated always as identity primary key,
  channel text not null default 'email',
  recipient text not null,
  template text not null,
  payload jsonb not null default '{}',
  status text not null default 'pending',
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  processed_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  constraint notification_outbox_status check (status in ('pending', 'processing', 'sent', 'failed'))
);

create index applications_status_created_idx on public.applications (status, created_at desc);
create index applications_email_idx on public.applications (lower(email));
create index events_status_date_idx on public.events (status, date_start);
create index event_registrations_event_status_idx on public.event_registrations (event_id, status);
create index event_tickets_event_status_idx on public.event_tickets (event_id, status);
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id, created_at desc);
create index notification_outbox_pending_idx on public.notification_outbox (status, available_at) where status = 'pending';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger applications_set_updated_at before update on public.applications
for each row execute function public.set_updated_at();
create trigger events_set_updated_at before update on public.events
for each row execute function public.set_updated_at();
create trigger event_registrations_set_updated_at before update on public.event_registrations
for each row execute function public.set_updated_at();
create trigger event_tickets_set_updated_at before update on public.event_tickets
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.has_role(required_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and (role = required_role or role = 'admin')
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
  );
$$;

create or replace function public.submit_application(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  created public.applications;
  normalized_email text := lower(trim(coalesce(payload ->> 'email', '')));
  normalized_mobile text := regexp_replace(coalesce(payload ->> 'mobile', ''), '[^0-9]', '', 'g');
begin
  if coalesce((payload ->> 'consent')::boolean, false) is not true then
    raise exception 'Consent is required.' using errcode = '22023';
  end if;
  if trim(coalesce(payload ->> 'fullName', '')) = ''
    or trim(coalesce(payload ->> 'state', '')) = ''
    or trim(coalesce(payload ->> 'city', '')) = ''
    or trim(coalesce(payload ->> 'college', '')) = ''
    or trim(coalesce(payload ->> 'ideaTitle', '')) = ''
    or trim(coalesce(payload ->> 'stage', '')) = ''
    or trim(coalesce(payload ->> 'category', '')) = ''
    or trim(coalesce(payload ->> 'description', '')) = ''
    or trim(coalesce(payload ->> 'role', '')) = '' then
    raise exception 'Required application fields are missing.' using errcode = '22023';
  end if;

  insert into public.applications (
    full_name, email, mobile, state, city, college, course, graduation_year,
    idea_title, stage, category, description, participant_role, linkedin_url,
    website_url, pitch_deck_url, additional_info, consented_at
  ) values (
    trim(payload ->> 'fullName'), normalized_email, normalized_mobile,
    trim(payload ->> 'state'), trim(payload ->> 'city'), trim(payload ->> 'college'),
    nullif(trim(payload ->> 'course'), ''), nullif(trim(payload ->> 'graduationYear'), ''),
    trim(payload ->> 'ideaTitle'), trim(payload ->> 'stage'), trim(payload ->> 'category'),
    trim(payload ->> 'description'), trim(payload ->> 'role'),
    nullif(trim(payload ->> 'linkedin'), ''), nullif(trim(payload ->> 'website'), ''),
    nullif(trim(payload ->> 'pitchDeck'), ''), nullif(trim(payload ->> 'additionalInfo'), ''),
    now()
  ) returning * into created;

  insert into public.notification_outbox (recipient, template, payload)
  values (created.email, 'application_received', jsonb_build_object(
    'application_id', created.id,
    'application_no', created.application_no,
    'full_name', created.full_name
  ));

  return jsonb_build_object('id', created.application_no);
end;
$$;

create or replace function public.review_application(
  application_id uuid,
  decision public.application_status,
  notes text default null
)
returns public.applications
language plpgsql
security definer
set search_path = ''
as $$
declare
  previous public.applications;
  reviewed public.applications;
begin
  if not (public.has_role('reviewer') or public.has_role('admin')) then
    raise exception 'Forbidden.' using errcode = '42501';
  end if;
  if decision not in ('approved', 'rejected', 'in_review') then
    raise exception 'Invalid review decision.' using errcode = '22023';
  end if;

  select * into previous from public.applications where id = application_id for update;
  if previous.id is null then
    raise exception 'Application not found.' using errcode = 'P0002';
  end if;

  update public.applications
  set status = decision,
      review_notes = nullif(trim(notes), ''),
      reviewed_at = case when decision in ('approved', 'rejected') then now() else null end,
      reviewed_by = auth.uid()
  where id = application_id
  returning * into reviewed;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, before_data, after_data)
  values (auth.uid(), 'application.' || decision::text, 'application', reviewed.id, to_jsonb(previous), to_jsonb(reviewed));

  if decision in ('approved', 'rejected') then
    insert into public.notification_outbox (recipient, template, payload)
    values (reviewed.email, 'application_' || decision::text, jsonb_build_object(
      'application_id', reviewed.id,
      'application_no', reviewed.application_no,
      'full_name', reviewed.full_name,
      'notes', reviewed.review_notes
    ));
  end if;

  return reviewed;
end;
$$;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.applications enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.event_tickets enable row level security;
alter table public.audit_logs enable row level security;
alter table public.notification_outbox enable row level security;

create policy "profiles_read_own_or_staff" on public.profiles for select to authenticated
using (id = auth.uid() or public.is_staff());
create policy "profiles_update_own_or_admin" on public.profiles for update to authenticated
using (id = auth.uid() or public.has_role('admin'))
with check (id = auth.uid() or public.has_role('admin'));

create policy "roles_read_own_or_admin" on public.user_roles for select to authenticated
using (user_id = auth.uid() or public.has_role('admin'));
create policy "roles_admin_all" on public.user_roles for all to authenticated
using (public.has_role('admin')) with check (public.has_role('admin'));

create policy "applications_staff_read" on public.applications for select to authenticated
using (public.is_staff());
create policy "applications_reviewers_update" on public.applications for update to authenticated
using (public.has_role('reviewer')) with check (public.has_role('reviewer'));

create policy "events_public_read" on public.events for select to anon, authenticated
using (is_published or public.is_staff());
create policy "events_managers_insert" on public.events for insert to authenticated
with check (public.has_role('event_manager'));
create policy "events_managers_update" on public.events for update to authenticated
using (public.has_role('event_manager')) with check (public.has_role('event_manager'));
create policy "events_admin_delete" on public.events for delete to authenticated
using (public.has_role('admin'));

create policy "event_registrations_read_own_or_staff" on public.event_registrations for select to authenticated
using (user_id = auth.uid() or public.is_staff());
create policy "event_registrations_staff_manage" on public.event_registrations for all to authenticated
using (public.has_role('event_manager')) with check (public.has_role('event_manager'));

create policy "tickets_read_own_or_staff" on public.event_tickets for select to authenticated
using (user_id = auth.uid() or public.is_staff());
create policy "tickets_staff_manage" on public.event_tickets for all to authenticated
using (public.has_role('event_manager')) with check (public.has_role('event_manager'));

create policy "audit_admin_read" on public.audit_logs for select to authenticated
using (public.has_role('admin'));
create policy "outbox_admin_read" on public.notification_outbox for select to authenticated
using (public.has_role('admin'));

revoke all on all tables in schema public from anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.user_roles to authenticated;
grant select, update on public.applications to authenticated;
grant select on public.events to anon, authenticated;
grant insert, update, delete on public.events to authenticated;
grant select, insert, update, delete on public.event_registrations to authenticated;
grant select, insert, update, delete on public.event_tickets to authenticated;
grant select on public.audit_logs, public.notification_outbox to authenticated;

revoke all on function public.submit_application(jsonb) from public;
grant execute on function public.submit_application(jsonb) to anon, authenticated;
revoke all on function public.review_application(uuid, public.application_status, text) from public;
grant execute on function public.review_application(uuid, public.application_status, text) to authenticated;
revoke all on function public.has_role(public.app_role) from public;
grant execute on function public.has_role(public.app_role) to authenticated;
revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to authenticated;

comment on table public.user_roles is 'Application roles. Bootstrap the first admin with a one-time SQL insert after creating their Auth user.';
comment on table public.notification_outbox is 'Durable queue for a future email/notification worker; business transactions never depend on SMTP availability.';
