"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface Registration {
  id: string;
  ticket_id: string;
  idea_title: string;
  stage: string;
  category: string;
  description: string;
  linkedin: string;
  website: string;
  pitch_deck: string;
  additional_info: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
    mobile: string;
    state: string;
    city: string;
    college: string;
    course: string;
    graduation_year: string;
    role: string;
  } | null;
}

type FilterStatus = "all" | "pending" | "approved" | "rejected";

export default function UserManagementPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const supabase = createClient();

  async function fetchRegistrations() {
    let query = supabase
      .from("registrations")
      .select(
        "*, profiles!registrations_user_id_fkey(full_name, email, mobile, state, city, college, course, graduation_year, role)",
      )
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query;
    setRegistrations((data as unknown as Registration[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    fetchRegistrations();
  }, [filter]);

  async function handleAction(regId: string, action: "approved" | "rejected") {
    setActionLoading(regId);

    const { data: { user } } = await supabase.auth.getUser();

    await supabase
      .from("registrations")
      .update({
        status: action,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
      })
      .eq("id", regId);

    // If approved, send confirmation email via API route
    if (action === "approved") {
      const reg = registrations.find((r) => r.id === regId);
      if (reg) {
        await fetch("/api/admin/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            registrationId: regId,
            email: reg.profiles?.email,
            name: reg.profiles?.full_name,
            ticketId: reg.ticket_id,
          }),
        });
      }
    }

    setActionLoading(null);
    fetchRegistrations();
  }

  const statusBadge = (status: string) => {
    const cls =
      status === "approved"
        ? "bg-green-100 text-green-700"
        : status === "rejected"
          ? "bg-red-100 text-red-700"
          : "bg-saffron-100 text-saffron-700";
    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}
      >
        {status}
      </span>
    );
  };

  const filterCounts = {
    all: registrations.length,
    pending: registrations.filter((r) => r.status === "pending").length,
    approved: registrations.filter((r) => r.status === "approved").length,
    rejected: registrations.filter((r) => r.status === "rejected").length,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-950">
          User Management
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          View and manage all user registrations
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
              filter === f
                ? "bg-saffron-600 text-white"
                : "bg-white text-ink-600 border border-line hover:bg-slate-50"
            }`}
          >
            {f} {filter === "all" ? "" : `(${filterCounts[f]})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-ink-400">Loading…</div>
      ) : registrations.length === 0 ? (
        <div className="rounded-xl border border-line bg-white py-20 text-center text-sm text-ink-400">
          No registrations found
        </div>
      ) : (
        <div className="space-y-3">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="overflow-hidden rounded-xl border border-line bg-white shadow-sm"
            >
              {/* Summary row */}
              <button
                onClick={() =>
                  setExpandedId(expandedId === reg.id ? null : reg.id)
                }
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-saffron-100 font-display text-sm font-bold text-saffron-700">
                    {reg.profiles?.full_name?.charAt(0) || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-ink-950 truncate">
                      {reg.profiles?.full_name || "Unknown"}
                    </p>
                    <p className="text-xs text-ink-400 truncate">
                      {reg.profiles?.email} · {reg.profiles?.state}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <p className="hidden sm:block text-xs text-ink-400">
                    {reg.idea_title}
                  </p>
                  {statusBadge(reg.status)}
                  <span className="text-ink-400 text-sm">
                    {expandedId === reg.id ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {/* Expanded details */}
              {expandedId === reg.id && (
                <div className="border-t border-line bg-slate-50 px-5 py-5">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailItem label="Ticket ID" value={reg.ticket_id} />
                    <DetailItem
                      label="Name"
                      value={reg.profiles?.full_name || "—"}
                    />
                    <DetailItem
                      label="Email"
                      value={reg.profiles?.email || "—"}
                    />
                    <DetailItem
                      label="Mobile"
                      value={reg.profiles?.mobile || "—"}
                    />
                    <DetailItem
                      label="State"
                      value={reg.profiles?.state || "—"}
                    />
                    <DetailItem
                      label="City"
                      value={reg.profiles?.city || "—"}
                    />
                    <DetailItem
                      label="College"
                      value={reg.profiles?.college || "—"}
                    />
                    <DetailItem
                      label="Course"
                      value={reg.profiles?.course || "—"}
                    />
                    <DetailItem
                      label="Graduation Year"
                      value={reg.profiles?.graduation_year || "—"}
                    />
                    <DetailItem
                      label="Idea Title"
                      value={reg.idea_title || "—"}
                    />
                    <DetailItem label="Stage" value={reg.stage || "—"} />
                    <DetailItem
                      label="Category"
                      value={reg.category || "—"}
                    />
                    <DetailItem
                      label="Role"
                      value={reg.profiles?.role || "—"}
                    />
                    <DetailItem
                      label="Registered"
                      value={new Date(reg.created_at).toLocaleString("en-IN")}
                    />
                  </div>
                  {reg.description && (
                    <div className="mt-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                        Description
                      </p>
                      <p className="mt-1 text-sm text-ink-800 leading-relaxed">
                        {reg.description}
                      </p>
                    </div>
                  )}
                  {(reg.linkedin || reg.website || reg.pitch_deck) && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {reg.linkedin && (
                        <a href={reg.linkedin} target="_blank" rel="noopener" className="text-xs text-blue-800 underline">
                          LinkedIn ↗
                        </a>
                      )}
                      {reg.website && (
                        <a href={reg.website} target="_blank" rel="noopener" className="text-xs text-blue-800 underline">
                          Website ↗
                        </a>
                      )}
                      {reg.pitch_deck && (
                        <a href={reg.pitch_deck} target="_blank" rel="noopener" className="text-xs text-blue-800 underline">
                          Pitch Deck ↗
                        </a>
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  {reg.status === "pending" && (
                    <div className="mt-5 flex gap-3 border-t border-line pt-4">
                      <button
                        onClick={() => handleAction(reg.id, "approved")}
                        disabled={actionLoading === reg.id}
                        className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                      >
                        {actionLoading === reg.id ? "Processing…" : "✓ Approve"}
                      </button>
                      <button
                        onClick={() => handleAction(reg.id, "rejected")}
                        disabled={actionLoading === reg.id}
                        className="rounded-lg bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                      >
                        {actionLoading === reg.id ? "Processing…" : "✕ Reject"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-ink-800">{value}</p>
    </div>
  );
}
