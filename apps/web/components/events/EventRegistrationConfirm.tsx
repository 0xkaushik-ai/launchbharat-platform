"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase-browser";
import TicketQr from "@/components/tickets/TicketQr";

type SavedDetails = {
  fullName: string;
  email: string;
  mobile: string | null;
  city: string | null;
  state: string | null;
  college: string | null;
};

type ProfileValues = {
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  college: string;
};

const MOBILE_RE = /^[6-9]\d{9}$/;

function profileFromDetails(details: SavedDetails): ProfileValues {
  return {
    fullName: details.fullName.trim(),
    email: details.email.trim(),
    mobile: details.mobile?.trim() ?? "",
    city: details.city?.trim() ?? "",
    state: details.state?.trim() ?? "",
    college: details.college?.trim() ?? "",
  };
}

function profileNeedsCompletion(profile: ProfileValues) {
  const mobile = profile.mobile.replace(/\D/g, "");
  return (
    !profile.fullName ||
    !MOBILE_RE.test(mobile) ||
    !profile.city ||
    !profile.state
  );
}

export default function EventRegistrationConfirm({
  eventId,
  eventTitle,
  eventPricePaise,
  details,
}: {
  eventId: string;
  eventTitle: string;
  eventPricePaise: number;
  details: SavedDetails;
}) {
  const [savedProfile, setSavedProfile] = useState(() =>
    profileFromDetails(details),
  );
  const [profile, setProfile] = useState(() => profileFromDetails(details));
  const [editing, setEditing] = useState(() =>
    profileNeedsCompletion(profileFromDetails(details)),
  );
  const [confirmed, setConfirmed] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    status: string;
    ticketCode: string | null;
    alreadyRegistered: boolean;
  } | null>(null);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const normalized: ProfileValues = {
      fullName: profile.fullName.trim(),
      email: profile.email.trim(),
      mobile: profile.mobile.replace(/\D/g, ""),
      city: profile.city.trim(),
      state: profile.state.trim(),
      college: profile.college.trim(),
    };

    if (!normalized.fullName) {
      setError("Please enter your full name.");
      return;
    }
    if (!MOBILE_RE.test(normalized.mobile)) {
      setError("Enter a valid 10-digit Indian mobile number starting with 6–9.");
      return;
    }
    if (!normalized.city || !normalized.state) {
      setError("Please enter your city and state.");
      return;
    }

    setSavingProfile(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Your session has ended. Please sign in again.");
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: normalized.fullName,
          mobile: normalized.mobile,
          city: normalized.city,
          state: normalized.state,
          college: normalized.college || null,
        })
        .eq("id", user.id);

      if (updateError) {
        setError("We could not save your details. Please try again.");
        return;
      }

      setSavedProfile(normalized);
      setProfile(normalized);
      setConfirmed(false);
      setEditing(false);
    } catch {
      setError("We could not save your details. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function register() {
    if (!confirmed) return;
    if (profileNeedsCompletion(savedProfile)) {
      setEditing(true);
      setError("Complete your contact details before registering.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const { data, error: rpcError } = await createClient().rpc(
        "register_for_event",
        { p_event_id: eventId },
      );
      if (rpcError) {
        setError(rpcError.message);
      } else if (data && typeof data === "object") {
        const payload = data as {
          status?: string;
          ticket_code?: string | null;
          already_registered?: boolean;
        };
        setResult({
          status: payload.status ?? "confirmed",
          ticketCode: payload.ticket_code ?? null,
          alreadyRegistered: payload.already_registered === true,
        });
      } else {
        setError("We could not complete your registration. Please try again.");
      }
    } catch {
      setError("We could not complete your registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    const waitlisted = result.status === "waitlisted";
    return (
      <section className="surface p-6 sm:p-8">
        <p className="chip-mono">
          {waitlisted ? "Waitlist confirmed" : "Registration confirmed"}
        </p>
        <h2 className="display-sm mt-3 text-ink-950">
          {waitlisted
            ? "You’re on the waitlist."
            : result.alreadyRegistered
              ? "You’re already registered."
              : "Your place is reserved."}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          {waitlisted
            ? `We will contact you if a place opens for ${eventTitle}.`
            : `Your ${eventTitle} ticket is now available in your applicant portal.`}
        </p>
        {result.ticketCode && (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:text-left">
            <TicketQr ticketCode={result.ticketCode} size={132} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Your unique ticket</p>
              <p className="mt-1 font-mono text-sm font-semibold tracking-wide text-ink-950">{result.ticketCode}</p>
              <p className="mt-2 text-xs leading-relaxed text-ink-500">Keep this QR ready for the admin to scan at entry.</p>
            </div>
          </div>
        )}
        <Link
          href="/portal"
          className="mt-7 inline-flex rounded-full btn-brand px-5 py-3 text-sm font-semibold transition"
        >
          View my portal
        </Link>
      </section>
    );
  }

  if (editing) {
    const inputClass = "field-input mt-2";
    return (
      <section className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <p className="chip-mono">One-time event profile</p>
        <h2 className="display-sm mt-3 text-ink-950">
          Complete your contact details.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          This is not another programme application. We save these details once
          and reuse them for future LaunchBharat event bookings.
        </p>

        <form className="mt-7 grid gap-5 sm:grid-cols-2" onSubmit={saveProfile}>
          <label className="block text-sm font-medium text-ink-800 sm:col-span-2">
            Full name
            <input
              required
              value={profile.fullName}
              onChange={(event) =>
                setProfile({ ...profile, fullName: event.target.value })
              }
              autoComplete="name"
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium text-ink-800">
            Email address
            <input
              readOnly
              value={profile.email}
              className={`${inputClass} cursor-not-allowed bg-slate-50 text-ink-500`}
            />
          </label>
          <label className="block text-sm font-medium text-ink-800">
            Mobile number
            <input
              required
              value={profile.mobile}
              onChange={(event) =>
                setProfile({ ...profile, mobile: event.target.value })
              }
              inputMode="numeric"
              autoComplete="tel-national"
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium text-ink-800">
            State
            <input
              required
              value={profile.state}
              onChange={(event) =>
                setProfile({ ...profile, state: event.target.value })
              }
              autoComplete="address-level1"
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium text-ink-800">
            City
            <input
              required
              value={profile.city}
              onChange={(event) =>
                setProfile({ ...profile, city: event.target.value })
              }
              autoComplete="address-level2"
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium text-ink-800 sm:col-span-2">
            College or organisation <span className="font-normal text-ink-400">(optional)</span>
            <input
              value={profile.college}
              onChange={(event) =>
                setProfile({ ...profile, college: event.target.value })
              }
              className={inputClass}
            />
          </label>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5 sm:col-span-2">
            <button
              disabled={savingProfile}
              className="rounded-full btn-brand px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingProfile ? "Saving…" : "Save and continue"}
            </button>
            {!profileNeedsCompletion(savedProfile) && (
              <button
                type="button"
                onClick={() => {
                  setProfile(savedProfile);
                  setError(null);
                  setEditing(false);
                }}
                className="rounded-full px-4 py-3 text-sm font-semibold text-ink-600 hover:text-iris-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>
    );
  }

  const rows = [
    ["Name", savedProfile.fullName],
    ["Email", savedProfile.email],
    ["Mobile", savedProfile.mobile],
    [
      "Location",
      [savedProfile.city, savedProfile.state].filter(Boolean).join(", "),
    ],
    ["College / organisation", savedProfile.college || "Not added"],
    [
      "Ticket value",
      eventPricePaise > 0
        ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(eventPricePaise / 100)
        : "Free",
    ],
  ];

  return (
    <section className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
      <p className="chip-mono">Confirm registration</p>
      <h2 className="display-sm mt-3 text-ink-950">
        Your saved details are ready.
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-600">
        No application form is required. Review the details that will be used
        for <span className="font-semibold text-ink-800">{eventTitle}</span>,
        then confirm your registration.
      </p>
      <dl className="mt-7 divide-y divide-line rounded-xl border border-line">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <dt className="text-sm text-ink-500">{label}</dt>
            <dd className="text-sm font-medium text-ink-950">{value}</dd>
          </div>
        ))}
      </dl>
      {eventPricePaise > 0 && (
        <p className="mt-3 text-xs leading-relaxed text-amber-700">
          This records the event&apos;s booking value. Online payment collection is not enabled in this flow yet.
        </p>
      )}
      <button
        type="button"
        onClick={() => {
          setError(null);
          setProfile(savedProfile);
          setEditing(true);
        }}
        className="mt-4 inline-flex text-sm font-semibold text-iris-600 hover:text-iris-500"
      >
        Edit these details
      </button>
      <label className="mt-7 flex items-start gap-3 text-sm leading-relaxed text-ink-700">
        <input
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-line text-iris-600 focus:ring-iris-500"
        />
        <span>
          I confirm that these details are correct and I want to register for
          this event.
        </span>
      </label>
      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="button"
        disabled={!confirmed || submitting}
        onClick={register}
        className="mt-6 rounded-full btn-brand px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Confirming…" : eventPricePaise > 0 ? "Confirm registration" : "Confirm free registration"}
      </button>
    </section>
  );
}
