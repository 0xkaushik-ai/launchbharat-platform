"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

type SavedDetails = {
  fullName: string;
  email: string;
  mobile: string | null;
  city: string | null;
  state: string | null;
  college: string | null;
};

export default function EventRegistrationConfirm({ eventId, eventTitle, details }: { eventId: string; eventTitle: string; details: SavedDetails }) {
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ status: string; ticketCode: string | null; alreadyRegistered: boolean } | null>(null);

  async function register() {
    if (!confirmed) return;
    setSubmitting(true);
    setError(null);
    const { data, error: rpcError } = await createClient().rpc("register_for_event", { p_event_id: eventId });
    if (rpcError) {
      setError(rpcError.message);
    } else if (data && typeof data === "object") {
      const payload = data as { status?: string; ticket_code?: string | null; already_registered?: boolean };
      setResult({ status: payload.status ?? "confirmed", ticketCode: payload.ticket_code ?? null, alreadyRegistered: payload.already_registered === true });
    } else {
      setError("We could not complete your registration. Please try again.");
    }
    setSubmitting(false);
  }

  if (result) {
    const waitlisted = result.status === "waitlisted";
    return (
      <section className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <p className="chip-mono">{waitlisted ? "Waitlist confirmed" : "Registration confirmed"}</p>
        <h1 className="display-sm mt-3 text-ink-950">{waitlisted ? "You’re on the waitlist." : result.alreadyRegistered ? "You’re already registered." : "Your place is reserved."}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          {waitlisted ? `We will contact you if a place opens for ${eventTitle}.` : `Your ${eventTitle} ticket is now available in your applicant portal.`}
        </p>
        {result.ticketCode && <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm font-semibold tracking-wide text-ink-950">Ticket {result.ticketCode}</p>}
        <Link href="/portal" className="mt-7 inline-flex rounded-full bg-saffron-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-saffron-700">View my portal</Link>
      </section>
    );
  }

  const rows = [
    ["Name", details.fullName],
    ["Email", details.email],
    ["Mobile", details.mobile || "Not added"],
    ["Location", [details.city, details.state].filter(Boolean).join(", ") || "Not added"],
    ["College / organisation", details.college || "Not added"],
  ];

  return (
    <section className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
      <p className="chip-mono">Confirm registration</p>
      <h1 className="display-sm mt-3 text-ink-950">Your saved details are ready.</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-600">You do not need to complete another form. Review the details that will be used for <span className="font-semibold text-ink-800">{eventTitle}</span>, then confirm your complimentary registration.</p>
      <dl className="mt-7 divide-y divide-line rounded-xl border border-line">
        {rows.map(([label, value]) => <div key={label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"><dt className="text-sm text-ink-500">{label}</dt><dd className="text-sm font-medium text-ink-950">{value}</dd></div>)}
      </dl>
      <Link href="/portal/settings" className="mt-4 inline-flex text-sm font-semibold text-saffron-600 hover:text-saffron-700">Update my profile</Link>
      <label className="mt-7 flex items-start gap-3 text-sm leading-relaxed text-ink-700">
        <input checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} type="checkbox" className="mt-1 h-4 w-4 rounded border-line text-saffron-600 focus:ring-saffron-500" />
        <span>I confirm that these details are correct and I want to register for this event.</span>
      </label>
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button type="button" disabled={!confirmed || submitting} onClick={register} className="mt-6 rounded-full bg-saffron-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-saffron-700 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Confirming…" : "Confirm free registration"}</button>
    </section>
  );
}
