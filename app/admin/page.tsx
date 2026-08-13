"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";

interface DashboardStats {
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  rejectedRegistrations: number;
  totalEvents: number;
  totalTickets: number;
  checkedIn: number;
}

interface RecentRegistration {
  id: string;
  ticket_id: string;
  status: string;
  created_at: string;
  profiles: { full_name: string; email: string } | null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRegistrations: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    rejectedRegistrations: 0,
    totalEvents: 0,
    totalTickets: 0,
    checkedIn: 0,
  });
  const [recent, setRecent] = useState<RecentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 5;
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const [regsResult, eventsResult, ticketsResult, checkedInResult, recentResult] =
        await Promise.all([
          supabase.from("registrations").select("status"),
          supabase.from("events").select("id", { count: "exact", head: true }),
          supabase.from("event_tickets").select("id", { count: "exact", head: true }),
          supabase
            .from("event_tickets")
            .select("id", { count: "exact", head: true })
            .eq("status", "checked_in"),
          supabase
            .from("registrations")
            .select("id, ticket_id, status, created_at, profiles!registrations_user_id_fkey(full_name, email)")
            .order("created_at", { ascending: false })
            .range((page - 1) * limit, page * limit - 1),
        ]);

      const regs = regsResult.data || [];
      setStats({
        totalRegistrations: regs.length,
        pendingRegistrations: regs.filter((r) => r.status === "pending").length,
        approvedRegistrations: regs.filter((r) => r.status === "approved").length,
        rejectedRegistrations: regs.filter((r) => r.status === "rejected").length,
        totalEvents: eventsResult.count || 0,
        totalTickets: ticketsResult.count || 0,
        checkedIn: checkedInResult.count || 0,
      });

      setRecent((recentResult.data as unknown as RecentRegistration[]) || []);
      setLoading(false);
    }
    fetchStats();
  }, [page]);

  const statCards = [
    { label: "Total Registrations", value: stats.totalRegistrations, color: "bg-blue-800" },
    { label: "Pending", value: stats.pendingRegistrations, color: "bg-saffron-500" },
    { label: "Approved", value: stats.approvedRegistrations, color: "bg-green-600" },
    { label: "Rejected", value: stats.rejectedRegistrations, color: "bg-red-500" },
    { label: "Total Events", value: stats.totalEvents, color: "bg-blue-800" },
    { label: "Tickets Issued", value: stats.totalTickets, color: "bg-saffron-600" },
    { label: "Check-ins", value: stats.checkedIn, color: "bg-green-600" },
  ];

  const statusBadge = (status: string) => {
    const cls =
      status === "approved"
        ? "bg-green-100 text-green-700"
        : status === "rejected"
          ? "bg-red-100 text-red-700"
          : "bg-saffron-100 text-saffron-700";
    return (
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-ink-400">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink-950">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-600">Overview of LaunchBharat operations</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-line bg-white p-5 shadow-sm"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
              {card.label}
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-ink-950">{card.value}</p>
            <div className={`mt-3 h-1 w-12 rounded-full ${card.color}`} />
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/users"
          className="flex items-center gap-4 rounded-xl border border-line bg-white p-5 shadow-sm transition hover:border-saffron-500"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-saffron-100 text-2xl">
            👥
          </span>
          <div>
            <p className="font-semibold text-ink-950">User Management</p>
            <p className="text-sm text-ink-600">
              View, approve or reject user registrations
            </p>
          </div>
        </Link>
        <Link
          href="/admin/events"
          className="flex items-center gap-4 rounded-xl border border-line bg-white p-5 shadow-sm transition hover:border-saffron-500"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-2xl">
            📅
          </span>
          <div>
            <p className="font-semibold text-ink-950">Event Management</p>
            <p className="text-sm text-ink-600">
              Create and manage events
            </p>
          </div>
        </Link>
      </div>

      {/* Recent registrations */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-950">
            Recent Registrations
          </h2>
          <Link href="/admin/users" className="text-sm font-medium text-saffron-600 hover:text-saffron-700">
            View all →
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white shadow-sm">
          {recent.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-ink-400">
              No registrations yet
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-line bg-slate-50">
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                    Ticket ID
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recent.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-ink-950">
                        {reg.profiles?.full_name || "—"}
                      </p>
                      <p className="text-xs text-ink-400">
                        {reg.profiles?.email || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-600">
                      {reg.ticket_id}
                    </td>
                    <td className="px-4 py-3">{statusBadge(reg.status)}</td>
                    <td className="px-4 py-3 text-xs text-ink-400">
                      {new Date(reg.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {recent.length > 0 && (
            <div className="flex items-center justify-between border-t border-line bg-slate-50 px-6 py-3">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="text-sm font-medium text-ink-600 hover:text-ink-950 disabled:opacity-50"
              >
                ← Previous
              </button>
              <span className="text-xs text-ink-400">Page {page}</span>
              <button
                disabled={recent.length < limit}
                onClick={() => setPage(p => p + 1)}
                className="text-sm font-medium text-ink-600 hover:text-ink-950 disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
