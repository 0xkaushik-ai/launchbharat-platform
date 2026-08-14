import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import EventRegistrationConfirm from "@/components/events/EventRegistrationConfirm";

export default async function EventRegistrationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("id, title, date_start, venue, city, state, is_published, registration_open, status")
    .eq("slug", slug)
    .maybeSingle();

  if (!event || !event.is_published || !event.registration_open || event.status !== "upcoming") notFound();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/portal/login?next=${encodeURIComponent(`/events/${slug}/register`)}`);
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, mobile, city, state, college")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-[calc(100vh-12rem)] bg-slate-50 py-12 sm:py-16">
      <div className="container-lb max-w-3xl">
        <Link href={`/events/${slug}`} className="text-sm font-semibold text-saffron-600 hover:text-saffron-700">← Back to event</Link>
        <p className="chip-mono mt-7">Event registration</p>
        <h1 className="display-md mt-3 text-ink-950">{event.title}</h1>
        <p className="mt-3 text-sm text-ink-600">{new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(`${event.date_start}T00:00:00`))} · {event.venue}{event.city ? `, ${event.city}` : ""}</p>
        <div className="mt-8">
          <EventRegistrationConfirm eventId={event.id} eventTitle={event.title} details={{
            fullName: profile?.full_name?.trim() || user.user_metadata.full_name || "",
            email: user.email ?? profile?.email ?? "",
            mobile: profile?.mobile ?? null,
            city: profile?.city ?? null,
            state: profile?.state ?? null,
            college: profile?.college ?? null,
          }} />
        </div>
      </div>
    </main>
  );
}
