import Link from "next/link";

export default async function CheckEmailPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;
  return (
    <main className="min-h-[calc(100vh-12rem)] bg-slate-50 py-12 sm:py-16">
      <div className="container-lb max-w-md">
        <section className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
          <p className="chip-mono">One last step</p>
          <h1 className="display-sm mt-3 text-ink-950">Check your email</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            We sent a confirmation link to <span className="font-semibold text-ink-800">{email || "your email address"}</span>. Open it in this browser to activate your applicant portal, then continue with your application.
          </p>
          <Link href="/portal/login" className="mt-7 inline-flex rounded-full bg-saffron-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-saffron-700">Go to sign in</Link>
        </section>
      </div>
    </main>
  );
}
