"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(params.get("error") === "forbidden" ? "This account does not have staff access." : "");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    const { data: allowed } = await supabase.rpc("is_staff");
    if (!allowed) {
      await supabase.auth.signOut();
      setError("This account does not have staff access.");
      setLoading(false);
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="surface w-full max-w-md p-8">
      <Image src="/logo.jpg" alt="LaunchBharat" width={320} height={147} className="mx-auto h-16 w-auto object-contain" priority />
      <h1 className="mt-7 text-center font-display text-2xl font-bold">Admin sign in</h1>
      <p className="mt-1 text-center text-sm text-ink-600">Only explicitly assigned staff accounts can continue.</p>
      <label className="mt-7 block text-sm font-medium">Email<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input mt-2" /></label>
      <label className="mt-4 block text-sm font-medium">Password<input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="field-input mt-2" /></label>
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button disabled={loading} className="btn-brand mt-6 w-full rounded-full px-4 py-3 font-semibold disabled:opacity-50">{loading ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}

export default function LoginPage() {
  return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper p-5"><div aria-hidden="true" className="aurora-wash pointer-events-none absolute inset-0" /><div className="relative"><Suspense><LoginForm /></Suspense></div></main>;
}
