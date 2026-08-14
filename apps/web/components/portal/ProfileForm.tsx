"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase-browser";

type Profile = {
  full_name: string | null;
  email: string | null;
  mobile: string | null;
  city: string | null;
  state: string | null;
  college: string | null;
};

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const [values, setValues] = useState({
    full_name: profile?.full_name ?? "",
    mobile: profile?.mobile ?? "",
    city: profile?.city ?? "",
    state: profile?.state ?? "",
    college: profile?.college ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage("Your session has ended. Please sign in again.");
      setSaving(false);
      return;
    }
    const { error } = await supabase.from("profiles").update(values).eq("id", user.id);
    setMessage(error ? "We could not save those details. Please try again." : "Your profile has been updated.");
    setSaving(false);
  }

  const inputClass = "mt-2 w-full rounded-lg border border-line px-3 py-2.5 text-ink-950 outline-none transition focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100";
  return (
    <form className="mt-7 grid gap-5 sm:grid-cols-2" onSubmit={submit}>
      <label className="block text-sm font-medium text-ink-800 sm:col-span-2">Full name<input required value={values.full_name} onChange={(e) => setValues({ ...values, full_name: e.target.value })} autoComplete="name" className={inputClass} /></label>
      <label className="block text-sm font-medium text-ink-800">Email address<input readOnly value={profile?.email ?? ""} className={`${inputClass} cursor-not-allowed bg-slate-50 text-ink-500`} /></label>
      <label className="block text-sm font-medium text-ink-800">Mobile number<input value={values.mobile} onChange={(e) => setValues({ ...values, mobile: e.target.value })} inputMode="numeric" autoComplete="tel-national" className={inputClass} /></label>
      <label className="block text-sm font-medium text-ink-800">State<input value={values.state} onChange={(e) => setValues({ ...values, state: e.target.value })} autoComplete="address-level1" className={inputClass} /></label>
      <label className="block text-sm font-medium text-ink-800">City<input value={values.city} onChange={(e) => setValues({ ...values, city: e.target.value })} autoComplete="address-level2" className={inputClass} /></label>
      <label className="block text-sm font-medium text-ink-800 sm:col-span-2">College or organisation<input value={values.college} onChange={(e) => setValues({ ...values, college: e.target.value })} className={inputClass} /></label>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-4 border-t border-line pt-5">
        <button disabled={saving} className="rounded-full bg-saffron-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-saffron-700 disabled:opacity-60">{saving ? "Saving…" : "Save profile"}</button>
        {message && <p role="status" className="text-sm text-ink-600">{message}</p>}
      </div>
    </form>
  );
}
