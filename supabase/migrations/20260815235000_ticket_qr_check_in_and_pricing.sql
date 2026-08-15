-- Event prices are stored in paise to avoid floating-point currency errors.
-- Each ticket snapshots the price at booking time so later event price changes
-- do not rewrite historical booking value.

alter table public.events
  add column ticket_price_paise integer not null default 0
  constraint events_ticket_price_non_negative check (ticket_price_paise >= 0);

alter table public.event_tickets
  add column price_paise integer not null default 0
  constraint event_tickets_price_non_negative check (price_paise >= 0);

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
    select * into created_ticket
    from public.event_tickets
    where registration_id = existing_registration.id;

    return jsonb_build_object(
      'registration_id', existing_registration.id,
      'status', existing_registration.status,
      'ticket_code', created_ticket.ticket_code,
      'price_paise', coalesce(created_ticket.price_paise, selected_event.ticket_price_paise),
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
      'price_paise', selected_event.ticket_price_paise,
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

  insert into public.event_tickets (
    registration_id, event_id, user_id, status, price_paise
  ) values (
    created_registration.id, selected_event.id, applicant_id, 'confirmed',
    selected_event.ticket_price_paise
  ) returning * into created_ticket;

  insert into public.notification_outbox (recipient, template, payload)
  values (applicant_email, 'event_registration_confirmed', jsonb_build_object(
    'event_id', selected_event.id,
    'event_title', selected_event.title,
    'registration_id', created_registration.id,
    'ticket_code', created_ticket.ticket_code,
    'price_paise', created_ticket.price_paise
  ));

  return jsonb_build_object(
    'registration_id', created_registration.id,
    'status', created_registration.status,
    'ticket_code', created_ticket.ticket_code,
    'price_paise', created_ticket.price_paise,
    'already_registered', false
  );
end;
$$;

revoke all on function public.register_for_event(uuid) from public;
grant execute on function public.register_for_event(uuid) to authenticated;

-- Check-in is deliberately an RPC instead of a direct client update. The row
-- lock makes repeated or simultaneous scans idempotent and records who scanned
-- the ticket in both the ticket row and the audit log.
create or replace function public.check_in_ticket(p_ticket_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_code text := upper(regexp_replace(trim(coalesce(p_ticket_code, '')), '^launchbharat:ticket:', '', 'i'));
  selected_ticket public.event_tickets;
  selected_registration public.event_registrations;
  selected_event public.events;
  before_ticket jsonb;
begin
  if auth.uid() is null or not public.has_role('event_manager') then
    raise exception 'Only an event manager or administrator can check in tickets.' using errcode = '42501';
  end if;

  if normalized_code = '' then
    raise exception 'Enter or scan a ticket code.' using errcode = '22023';
  end if;

  select * into selected_ticket
  from public.event_tickets
  where ticket_code = normalized_code
  for update;

  if selected_ticket.id is null then
    raise exception 'Ticket not found.' using errcode = 'P0002';
  end if;

  select * into selected_registration
  from public.event_registrations
  where id = selected_ticket.registration_id;

  select * into selected_event
  from public.events
  where id = selected_ticket.event_id;

  if selected_ticket.status = 'cancelled' then
    raise exception 'This ticket has been cancelled.' using errcode = '22023';
  end if;

  if selected_ticket.status = 'checked_in' then
    return jsonb_build_object(
      'ticket_id', selected_ticket.id,
      'ticket_code', selected_ticket.ticket_code,
      'status', selected_ticket.status,
      'checked_in_at', selected_ticket.checked_in_at,
      'already_checked_in', true,
      'price_paise', selected_ticket.price_paise,
      'attendee_name', selected_registration.full_name,
      'attendee_email', selected_registration.email,
      'event_id', selected_event.id,
      'event_title', selected_event.title
    );
  end if;

  before_ticket := to_jsonb(selected_ticket);

  update public.event_tickets
  set status = 'checked_in',
      checked_in_at = now(),
      checked_in_by = auth.uid()
  where id = selected_ticket.id
  returning * into selected_ticket;

  insert into public.audit_logs (
    actor_id, action, entity_type, entity_id, before_data, after_data
  ) values (
    auth.uid(), 'ticket.checked_in', 'event_ticket', selected_ticket.id,
    before_ticket, to_jsonb(selected_ticket)
  );

  return jsonb_build_object(
    'ticket_id', selected_ticket.id,
    'ticket_code', selected_ticket.ticket_code,
    'status', selected_ticket.status,
    'checked_in_at', selected_ticket.checked_in_at,
    'already_checked_in', false,
    'price_paise', selected_ticket.price_paise,
    'attendee_name', selected_registration.full_name,
    'attendee_email', selected_registration.email,
    'event_id', selected_event.id,
    'event_title', selected_event.title
  );
end;
$$;

revoke all on function public.check_in_ticket(text) from public;
grant execute on function public.check_in_ticket(text) to authenticated;
