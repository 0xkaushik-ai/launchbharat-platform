import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoMark } from "@/components/ui";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/register");
  }

  // Fetch profile and registration data
  const [profileRes, regRes, ticketsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("registrations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("event_tickets")
      .select("*, events(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const profile = profileRes.data;
  const registrations = regRes.data || [];
  const tickets = ticketsRes.data || [];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container-lb max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-950">
              My Profile
            </h1>
            <p className="mt-2 text-ink-600">
              Manage your LaunchBharat registrations and tickets
            </p>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink-600 transition hover:bg-slate-100 hover:text-ink-950"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Left column - Profile details */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-saffron-100 font-display text-3xl font-bold text-saffron-700">
                  {profile?.full_name?.charAt(0) || "U"}
                </div>
                <h2 className="mt-4 font-display text-lg font-bold text-ink-950">
                  {profile?.full_name}
                </h2>
                <p className="text-sm text-ink-600">{profile?.email}</p>
                {profile?.is_admin && (
                  <span className="mt-2 inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    Admin
                  </span>
                )}
              </div>

              <div className="space-y-4 border-t border-line pt-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                    Location
                  </p>
                  <p className="mt-1 text-sm text-ink-950">
                    {profile?.city}, {profile?.state}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                    Education
                  </p>
                  <p className="mt-1 text-sm text-ink-950">
                    {profile?.college}
                  </p>
                  <p className="text-sm text-ink-600">
                    {profile?.course} (Class of {profile?.graduation_year})
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                    Role
                  </p>
                  <p className="mt-1 text-sm text-ink-950">{profile?.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Activity */}
          <div className="md:col-span-2 space-y-8">
            {/* Event Tickets */}
            <section>
              <h2 className="mb-4 font-display text-xl font-bold text-ink-950">
                My Event Tickets
              </h2>
              {tickets.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line bg-white/50 p-8 text-center">
                  <p className="text-ink-600">No event tickets yet.</p>
                  <Link
                    href="/events"
                    className="mt-2 inline-block text-sm font-medium text-saffron-600 hover:text-saffron-700 hover:underline"
                  >
                    Browse Upcoming Events →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
                    >
                      <div className="flex w-full flex-col p-6 sm:w-2/3">
                        <div className="mb-2 inline-flex self-start rounded-full bg-saffron-100 px-2.5 py-0.5 text-xs font-medium text-saffron-700">
                          {ticket.events.category}
                        </div>
                        <h3 className="font-display text-lg font-bold text-ink-950">
                          {ticket.events.title}
                        </h3>
                        <p className="mt-1 text-sm text-ink-600">
                          {ticket.events.venue} · {ticket.events.city}
                        </p>
                        <div className="mt-auto pt-4 flex gap-4">
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                              Date
                            </p>
                            <p className="mt-0.5 text-sm font-medium text-ink-950">
                              {new Date(ticket.events.date_start).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                              Status
                            </p>
                            <p className={`mt-0.5 text-sm font-medium capitalize ${
                              ticket.status === 'confirmed' ? 'text-green-600' : 'text-ink-950'
                            }`}>
                              {ticket.status}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full flex-col justify-center border-t border-line bg-slate-50 p-6 sm:w-1/3 sm:border-l sm:border-t-0 sm:items-center">
                        <div className="h-32 w-32 rounded-lg bg-white p-2 shadow-sm">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.ticket_id}`}
                            alt={`QR Code for Ticket ${ticket.ticket_id}`}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <p className="mt-3 font-mono text-xs font-bold uppercase tracking-widest text-ink-950">
                          {ticket.ticket_id}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Program Registrations */}
            <section>
              <h2 className="mb-4 font-display text-xl font-bold text-ink-950">
                Program Registrations
              </h2>
              {registrations.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line bg-white/50 p-8 text-center">
                  <p className="text-ink-600">No program registrations found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {registrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="rounded-2xl border border-line bg-white p-6 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display text-lg font-bold text-ink-950">
                            {reg.idea_title}
                          </h3>
                          <p className="mt-1 text-sm text-ink-600">
                            {reg.category} · {reg.stage}
                          </p>
                        </div>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                            reg.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : reg.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-saffron-100 text-saffron-700"
                          }`}
                        >
                          {reg.status}
                        </span>
                      </div>
                      <div className="mt-4 flex gap-6 border-t border-line pt-4">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                            Application ID
                          </p>
                          <p className="mt-0.5 font-mono text-xs font-medium text-ink-950">
                            {reg.ticket_id}
                          </p>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                            Submitted On
                          </p>
                          <p className="mt-0.5 text-xs font-medium text-ink-950">
                            {new Date(reg.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      {reg.status === "approved" && (
                        <div className="mt-4 rounded-xl bg-green-50 p-4">
                          <p className="text-sm text-green-800">
                            <strong>Congratulations!</strong> Your application has been approved. You are now part of the LaunchBharat ecosystem.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
