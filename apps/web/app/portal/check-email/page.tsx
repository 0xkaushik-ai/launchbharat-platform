import Link from "next/link";

export default async function CheckEmailPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;
  return (
    <main className="relative min-h-[calc(100vh-12rem)] overflow-hidden bg-paper py-12 sm:py-16">
      <div aria-hidden="true" className="aurora-wash pointer-events-none absolute inset-0" />
      <div className="container-lb relative max-w-md">
        <section className="surface p-6 sm:p-8">
          <p className="chip-mono">One last step</p>
          <h1 className="display-sm mt-3 text-ink-950">Check your email</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            We sent a confirmation link to <span className="font-semibold text-ink-800">{email || "your email address"}</span>. Open it in this browser to activate your applicant portal, then continue with your application.
          </p>
          <Link href="/portal/login" className="mt-7 inline-flex rounded-full btn-brand px-5 py-3 text-sm font-semibold transition">Go to sign in</Link>
        </section>
      </div>
    </main>
  );
}
