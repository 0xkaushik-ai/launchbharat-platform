import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

const STATUS: Record<string, { title: string; message: string; tone: string }> = {
  pending: { title: "Received", message: "Your application is safely with the LaunchBharat team. We will let you know when review begins.", tone: "bg-amber-100 text-amber-800" },
  in_review: { title: "Under review", message: "Our team is currently reviewing your application and idea.", tone: "bg-blue-100 text-blue-800" },
  approved: { title: "Selected", message: "Congratulations — your application has been selected. Watch your email and this portal for the next steps.", tone: "bg-green-100 text-green-800" },
  rejected: { title: "Review complete", message: "This application is not moving forward at this time. You can keep building and return for future opportunities.", tone: "bg-slate-200 text-slate-700" },
};

export default async function PortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login?next=/portal");

  const [{ data: profile }, { data: applications, error }] = await Promise.all([
    supabase.from("profiles").select("full_name, onboarding_completed").eq("id", user.id).maybeSingle(),
    supabase
      .from("applications")
      .select("application_no, idea_title, category, stage, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  if (error) throw new Error("We could not load your application right now.");
  const application = applications?.[0];
  const name = profile?.full_name?.trim() || user.user_metadata.full_name || "there";

  return (
    <main className="mx-auto max-w-4xl">
      <p className="chip-mono">Applicant portal</p>
      <h1 className="display-md mt-3 text-ink-950">Welcome back, <span className="text-saffron-600">{name}</span>.</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-600">
        This is your personal LaunchBharat space. Track your application and keep your details up to date in one place.
      </p>

      {!application ? (
        <section className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-ink-950">Start your application</h2>
          <p className="mt-2 max-w-xl leading-relaxed text-ink-600">Tell us about yourself and your idea in five clear steps. Your progress is kept in this browser while you apply.</p>
          <Link href="/register" className="mt-6 inline-flex rounded-full bg-saffron-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-saffron-700">Begin application</Link>
        </section>
      ) : (
        <section className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">Application {application.application_no}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink-950">{application.idea_title}</h2>
              <p className="mt-1 text-sm text-ink-600">{application.category} · {application.stage}</p>
            </div>
            <span className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold ${STATUS[application.status]?.tone ?? "bg-slate-100 text-slate-700"}`}>
              {STATUS[application.status]?.title ?? application.status}
            </span>
          </div>
          <div className="mt-7 border-t border-line pt-6">
            <p className="text-base leading-relaxed text-ink-700">{STATUS[application.status]?.message}</p>
            <p className="mt-3 text-sm text-ink-500">Submitted {new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(application.created_at))}</p>
          </div>
        </section>
      )}

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          ["1", "Submit", "Share your background and idea."],
          ["2", "Review", "Our team assesses each application."],
          ["3", "Next steps", "Programme and event updates appear here."],
        ].map(([number, title, detail]) => (
          <div key={number} className="rounded-xl border border-line bg-white p-5">
            <p className="font-mono text-xs font-bold text-saffron-600">0{number}</p>
            <h2 className="mt-2 font-semibold text-ink-950">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">{detail}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
