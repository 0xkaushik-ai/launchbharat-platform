"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface Ticket {
  id: string;
  ticket_id: string;
  status: string;
  created_at: string;
  profiles: { full_name: string; email: string } | null;
  events: { title: string } | null;
}

export default function TicketManagement() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTickets() {
      const { data } = await supabase
        .from("event_tickets")
        .select("id, ticket_id, status, created_at, profiles!event_tickets_user_id_fkey(full_name, email), events(title)")
        .order("created_at", { ascending: false });

      setTickets((data as unknown as Ticket[]) || []);
      setLoading(false);
    }
    fetchTickets();
  }, []);

  const statusBadge = (status: string) => {
    const cls =
      status === "checked_in"
        ? "bg-green-100 text-green-700"
        : status === "cancelled"
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
        <p className="text-sm text-ink-400">Loading tickets…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink-950">Ticket Management</h1>
        <p className="mt-1 text-sm text-ink-600">View issued tickets and check-in status</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        {tickets.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-ink-400">
            No tickets found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line bg-slate-50">
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                    User
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                    Event
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                    Ticket ID
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                    Date Issued
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-ink-950">
                        {t.profiles?.full_name || "—"}
                      </p>
                      <p className="text-xs text-ink-400">
                        {t.profiles?.email || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-950">
                      {t.events?.title || "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-600">
                      {t.ticket_id}
                    </td>
                    <td className="px-4 py-3">{statusBadge(t.status)}</td>
                    <td className="px-4 py-3 text-xs text-ink-400">
                      {new Date(t.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
