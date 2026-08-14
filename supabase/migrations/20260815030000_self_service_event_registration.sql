-- A signed-in applicant confirms their saved profile once to register for a
-- complimentary event. The transaction serialises capacity checks and never
-- issues more than one ticket for the same person and event.

create index if not exists event_registrations_user_event_idx
  on public.event_registrations (user_id, event_id);

create or replace function public.register_for_event(p_event_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  applicant_id uuid := auth.uid();
  applicant_email text := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  attendee public.profiles;
  selected_event public.events;
  existing_registration public.event_registrations;
  created_registration public.event_registrations;
  created_ticket public.event_tickets;
  reserved_count integer;
begin
  if applicant_id is null or applicant_email = '' then
    raise exception 'Please sign in before registering for an event.' using errcode = '42501';
  end if;

  select * into attendee from public.profiles where id = applicant_id;
  if attendee.id is null or trim(coalesce(attendee.full_name, '')) = '' then
    raise exception 'Please complete your profile before registering for an event.' using errcode = '22023';
  end if;

  -- Lock the event row so capacity cannot be exceeded by concurrent requests.
  select * into selected_event from public.events where id = p_event_id for update;
  if selected_event.id is null then
    raise exception 'Event not found.' using errcode = 'P0002';
  end if;
  if not selected_event.is_published
    or not selected_event.registration_open
    or selected_event.status <> 'upcoming'
    or selected_event.date_start < current_date then
    raise exception 'Registration is not open for this event.' using errcode = '22023';
  end if;

  select * into existing_registration
  from public.event_registrations
  where event_id = p_event_id
    and (user_id = applicant_id or lower(email) = applicant_email)
  order by created_at desc
  limit 1
  for update;

  if existing_registration.id is not null then
    select * into created_ticket from public.event_tickets where registration_id = existing_registration.id;
    return jsonb_build_object(
      'registration_id', existing_registration.id,
      'status', existing_registration.status,
      'ticket_code', created_ticket.ticket_code,
      'already_registered', true
    );
  end if;

  select count(*) into reserved_count
  from public.event_registrations
  where event_id = selected_event.id
    and status in ('pending', 'confirmed');

  if selected_event.max_capacity is not null and reserved_count >= selected_event.max_capacity then
    insert into public.event_registrations (
      event_id, user_id, full_name, email, mobile, status
    ) values (
      selected_event.id, applicant_id, attendee.full_name, applicant_email,
      attendee.mobile, 'waitlisted'
    ) returning * into created_registration;

    return jsonb_build_object(
      'registration_id', created_registration.id,
      'status', created_registration.status,
      'ticket_code', null,
      'already_registered', false
    );
  end if;

  insert into public.event_registrations (
    event_id, user_id, application_id, full_name, email, mobile, status
  ) values (
    selected_event.id,
    applicant_id,
    (select id from public.applications where user_id = applicant_id order by created_at desc limit 1),
    attendee.full_name,
    applicant_email,
    attendee.mobile,
    'confirmed'
  ) returning * into created_registration;

  insert into public.event_tickets (registration_id, event_id, user_id, status)
  values (created_registration.id, selected_event.id, applicant_id, 'confirmed')
  returning * into created_ticket;

  insert into public.notification_outbox (recipient, template, payload)
  values (applicant_email, 'event_registration_confirmed', jsonb_build_object(
    'event_id', selected_event.id,
    'event_title', selected_event.title,
    'registration_id', created_registration.id,
    'ticket_code', created_ticket.ticket_code
  ));

  return jsonb_build_object(
    'registration_id', created_registration.id,
    'status', created_registration.status,
    'ticket_code', created_ticket.ticket_code,
    'already_registered', false
  );
end;
$$;

revoke all on function public.register_for_event(uuid) from public;
grant execute on function public.register_for_event(uuid) to authenticated;
