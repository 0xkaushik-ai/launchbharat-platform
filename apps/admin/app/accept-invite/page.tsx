"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function AcceptInvitePage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [ready, setReady] = useState(false);
  const [validInvite, setValidInvite] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void createClient().auth.getSession().then(({ data, error: sessionError }) => {
      if (cancelled) return;
      if (sessionError || !data.session) {
        setError("This invitation is invalid or has expired. Ask an administrator for a new invitation.");
      } else {
        setValidInvite(true);
      }
      setReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }
    setSaving(true);
    const { error: updateError } = await createClient().auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper p-5">
      <div aria-hidden="true" className="aurora-wash pointer-events-none absolute inset-0" />
      <form onSubmit={submit} className="surface relative w-full max-w-md p-8">
        <Image src="/logo.jpg" alt="LaunchBharat" width={220} height={70} className="mx-auto h-12 w-auto object-contain" priority />
        <h1 className="mt-7 text-center font-display text-2xl font-bold">Accept admin invitation</h1>
        <p className="mt-1 text-center text-sm text-ink-600">Set the password for your LaunchBharat staff account.</p>
        <label className="mt-7 block text-sm font-medium">New password<input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={!ready || saving} className="mt-2 w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-iris-500 disabled:bg-slate-50" /></label>
        <label className="mt-4 block text-sm font-medium">Confirm password<input type="password" required minLength={8} autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} disabled={!ready || saving} className="mt-2 w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-iris-500 disabled:bg-slate-50" /></label>
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button disabled={!ready || !validInvite || saving} className="btn-brand mt-6 w-full rounded-full px-4 py-3 font-semibold disabled:opacity-50">{saving ? "Saving…" : "Set password and continue"}</button>
      </form>
    </main>
  );
}
