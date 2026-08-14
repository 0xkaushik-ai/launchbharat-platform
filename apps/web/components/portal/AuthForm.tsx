"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase-browser";

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/portal";
}

export default function AuthForm({ mode, next: nextValue }: { mode: "login" | "signup"; next?: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const next = safeNext(nextValue ?? null);
  const signup = mode === "signup";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    if (signup) {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (authError) setError(authError.message);
      else if (data.session) router.replace(next);
      else router.replace(`/portal/check-email?email=${encodeURIComponent(email.trim())}`);
    } else {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) setError("We could not sign you in. Check your email and password, then try again.");
      else {
        router.replace(next);
        router.refresh();
      }
    }
    setLoading(false);
  }

  return (
    <main className="relative min-h-[calc(100vh-12rem)] overflow-hidden bg-paper py-12 sm:py-16">
      <div aria-hidden="true" className="aurora-wash pointer-events-none absolute inset-0" />
      <div className="container-lb relative max-w-md">
        <section className="surface p-6 sm:p-8">
          <p className="chip-mono">Applicant portal</p>
          <h1 className="display-sm mt-3 text-ink-950">{signup ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            {signup ? "Use one account to apply, track your status, and receive the next steps." : "Sign in to continue your application or check its status."}
          </p>
          <form className="mt-7 space-y-5" onSubmit={submit}>
            {signup && (
              <label className="block text-sm font-medium text-ink-800">
                Full name
                <input value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" className="field-input mt-2" />
              </label>
            )}
            <label className="block text-sm font-medium text-ink-800">
              Email address
              <input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" autoComplete="email" className="field-input mt-2" />
            </label>
            <label className="block text-sm font-medium text-ink-800">
              Password
              <input value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} type="password" autoComplete={signup ? "new-password" : "current-password"} className="field-input mt-2" />
              {signup && <span className="mt-1.5 block text-xs font-normal text-ink-500">Use at least 8 characters.</span>}
            </label>
            {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button disabled={loading} className="w-full rounded-full btn-brand px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Please wait…" : signup ? "Create account and continue" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-ink-600">
            {signup ? "Already have an account?" : "New to LaunchBharat?"} {" "}
            <Link href={`${signup ? "/portal/login" : "/portal/signup"}?next=${encodeURIComponent(next)}`} className="font-semibold text-iris-600 hover:text-iris-500">
              {signup ? "Sign in" : "Create your account"}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
