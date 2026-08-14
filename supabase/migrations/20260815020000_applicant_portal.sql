-- Make every new application belong to the authenticated applicant.  This
-- replaces anonymous submission with an applicant portal while retaining all
-- historic applications and the staff review workflow.

alter table public.profiles
  add column if not exists state text,
  add column if not exists city text,
  add column if not exists college text,
  add column if not exists course text,
  add column if not exists graduation_year text,
  add column if not exists participant_role text,
  add column if not exists onboarding_completed boolean not null default false;

alter table public.applications
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists applications_user_created_idx
  on public.applications (user_id, created_at desc);

create policy "applications_read_own" on public.applications for select to authenticated
using (user_id = auth.uid());

create or replace function public.submit_application(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  created public.applications;
  applicant_id uuid := auth.uid();
  applicant_email text := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  normalized_mobile text := regexp_replace(coalesce(payload ->> 'mobile', ''), '[^0-9]', '', 'g');
begin
  if applicant_id is null or applicant_email = '' then
    raise exception 'Please sign in before submitting an application.' using errcode = '42501';
  end if;

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

  if exists (
    select 1 from public.applications
    where user_id = applicant_id
      and status in ('pending', 'in_review', 'approved')
  ) then
    raise exception 'You already have an active LaunchBharat application. Open your portal to view its status.'
      using errcode = '23505';
  end if;

  insert into public.applications (
    user_id, full_name, email, mobile, state, city, college, course, graduation_year,
    idea_title, stage, category, description, participant_role, linkedin_url,
    website_url, pitch_deck_url, additional_info, consented_at
  ) values (
    applicant_id, trim(payload ->> 'fullName'), applicant_email, normalized_mobile,
    trim(payload ->> 'state'), trim(payload ->> 'city'), trim(payload ->> 'college'),
    nullif(trim(payload ->> 'course'), ''), nullif(trim(payload ->> 'graduationYear'), ''),
    trim(payload ->> 'ideaTitle'), trim(payload ->> 'stage'), trim(payload ->> 'category'),
    trim(payload ->> 'description'), trim(payload ->> 'role'),
    nullif(trim(payload ->> 'linkedin'), ''), nullif(trim(payload ->> 'website'), ''),
    nullif(trim(payload ->> 'pitchDeck'), ''), nullif(trim(payload ->> 'additionalInfo'), ''),
    now()
  ) returning * into created;

  insert into public.profiles (
    id, full_name, email, mobile, state, city, college, course, graduation_year,
    participant_role, onboarding_completed
  ) values (
    applicant_id, created.full_name, applicant_email, created.mobile, created.state,
    created.city, created.college, created.course, created.graduation_year,
    created.participant_role, true
  ) on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    mobile = excluded.mobile,
    state = excluded.state,
    city = excluded.city,
    college = excluded.college,
    course = excluded.course,
    graduation_year = excluded.graduation_year,
    participant_role = excluded.participant_role,
    onboarding_completed = true;

  insert into public.notification_outbox (recipient, template, payload)
  values (created.email, 'application_received', jsonb_build_object(
    'application_id', created.id,
    'application_no', created.application_no,
    'full_name', created.full_name
  ));

  return jsonb_build_object('id', created.application_no);
end;
$$;

revoke all on function public.submit_application(jsonb) from public;
grant execute on function public.submit_application(jsonb) to authenticated;
