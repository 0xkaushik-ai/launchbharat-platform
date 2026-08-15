"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase-browser";

type TicketStatus = "confirmed" | "checked_in" | "cancelled";

type Ticket = {
  id: string;
  ticket_code: string;
  status: TicketStatus;
  price_paise: number;
  checked_in_at: string | null;
  created_at: string;
  events: {
    id: string;
    title: string;
    date_start: string;
    venue: string;
    max_capacity: number | null;
    ticket_price_paise: number;
  } | null;
  event_registrations: {
    full_name: string;
    email: string;
    mobile: string | null;
    status: string;
  } | null;
};

type CheckInResult = {
  ticket_id: string;
  ticket_code: string;
  status: TicketStatus;
  checked_in_at: string;
  already_checked_in: boolean;
  price_paise: number;
  attendee_name: string;
  attendee_email: string;
  event_id: string;
  event_title: string;
};

type DetectedBarcode = { rawValue: string };
type BarcodeDetectorInstance = {
  detect(source: HTMLVideoElement): Promise<DetectedBarcode[]>;
};
type BarcodeDetectorConstructor = new (options: {
  formats: string[];
}) => BarcodeDetectorInstance;

const ticketSelect =
  "id,ticket_code,status,price_paise,checked_in_at,created_at,events(id,title,date_start,venue,max_capacity,ticket_price_paise),event_registrations(full_name,email,mobile,status)";

function normalizeTicketCode(value: string) {
  return value
    .trim()
    .replace(/^launchbharat:ticket:/i, "")
    .toUpperCase();
}

function formatMoney(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

function statusClasses(status: TicketStatus) {
  if (status === "checked_in") return "bg-blue-100 text-blue-800";
  if (status === "cancelled") return "bg-red-50 text-red-700";
  return "bg-green-100 text-green-700";
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [lookupCode, setLookupCode] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [lookupBusy, setLookupBusy] = useState(false);
  const [checkInBusy, setCheckInBusy] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<{
    tone: "success" | "warning";
    text: string;
  } | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const detectingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    void createClient()
      .from("event_tickets")
      .select(ticketSelect)
      .order("created_at", { ascending: false })
      .then(({ data, error: loadError }) => {
        if (cancelled) return;
        setTickets((data as unknown as Ticket[]) || []);
        setError(loadError?.message || "");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stopCamera = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    detectingRef.current = false;
    setCameraActive(false);
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const findTicket = useCallback(async (rawCode: string) => {
    const code = normalizeTicketCode(rawCode);
    setLookupCode(code);
    setSelectedTicket(null);
    setVerificationMessage(null);
    setCameraError("");

    if (!code) {
      setError("Enter or scan a ticket code.");
      return;
    }

    setLookupBusy(true);
    setError("");
    const { data, error: lookupError } = await createClient()
      .from("event_tickets")
      .select(ticketSelect)
      .eq("ticket_code", code)
      .maybeSingle();
    setLookupBusy(false);

    if (lookupError) {
      setError(lookupError.message);
      return;
    }
    if (!data) {
      setError("No LaunchBharat ticket matches this QR or ticket code.");
      return;
    }

    const ticket = data as unknown as Ticket;
    setSelectedTicket(ticket);
    if (ticket.status === "checked_in") {
      setVerificationMessage({
        tone: "warning",
        text: `Already checked in${ticket.checked_in_at ? ` at ${new Date(ticket.checked_in_at).toLocaleString("en-IN")}` : ""}.`,
      });
    } else if (ticket.status === "cancelled") {
      setError("This ticket has been cancelled and cannot be checked in.");
    }
  }, []);

  async function startCamera() {
    setCameraError("");
    setError("");
    setVerificationMessage(null);

    const Detector = (
      window as typeof window & {
        BarcodeDetector?: BarcodeDetectorConstructor;
      }
    ).BarcodeDetector;

    if (!Detector) {
      setCameraError(
        "QR camera scanning is not supported in this browser. Use Chrome/Edge or enter the ticket code manually.",
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);

      const video = videoRef.current;
      if (!video) {
        stopCamera();
        return;
      }
      video.srcObject = stream;
      await video.play();

      const detector = new Detector({ formats: ["qr_code"] });
      const scanFrame = async () => {
        const currentVideo = videoRef.current;
        if (!streamRef.current || !currentVideo) return;

        if (!detectingRef.current && currentVideo.readyState >= 2) {
          detectingRef.current = true;
          try {
            const codes = await detector.detect(currentVideo);
            const rawValue = codes[0]?.rawValue;
            if (rawValue) {
              stopCamera();
              await findTicket(rawValue);
              return;
            }
          } catch {
            // A frame may fail while the camera is focusing; keep scanning.
          } finally {
            detectingRef.current = false;
          }
        }

        if (streamRef.current) frameRef.current = requestAnimationFrame(scanFrame);
      };

      frameRef.current = requestAnimationFrame(scanFrame);
    } catch {
      stopCamera();
      setCameraError(
        "Camera access was unavailable. Allow camera permission or enter the ticket code manually.",
      );
    }
  }

  async function checkIn() {
    if (!selectedTicket || selectedTicket.status === "cancelled") return;

    setCheckInBusy(true);
    setError("");
    setVerificationMessage(null);
    const { data, error: checkInError } = await createClient().rpc(
      "check_in_ticket",
      { p_ticket_code: selectedTicket.ticket_code },
    );
    setCheckInBusy(false);

    if (checkInError) {
      setError(checkInError.message);
      return;
    }

    const result = data as CheckInResult;
    const checkedInAt = result.checked_in_at;
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === result.ticket_id
          ? { ...ticket, status: "checked_in", checked_in_at: checkedInAt }
          : ticket,
      ),
    );
    setSelectedTicket((current) =>
      current
        ? { ...current, status: "checked_in", checked_in_at: checkedInAt }
        : current,
    );
    setVerificationMessage({
      tone: result.already_checked_in ? "warning" : "success",
      text: result.already_checked_in
        ? `Already checked in at ${new Date(checkedInAt).toLocaleString("en-IN")}.`
        : `Verified. ${result.attendee_name} is now checked in for ${result.event_title}.`,
    });
  }

  function submitLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void findTicket(lookupCode);
  }

  const eventOptions = useMemo(() => {
    const values = new Map<string, string>();
    tickets.forEach((ticket) => {
      if (ticket.events) values.set(ticket.events.id, ticket.events.title);
    });
    return [...values.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return tickets.filter((ticket) => {
      if (eventFilter !== "all" && ticket.events?.id !== eventFilter) return false;
      if (!needle) return true;
      return [
        ticket.ticket_code,
        ticket.event_registrations?.full_name,
        ticket.event_registrations?.email,
        ticket.event_registrations?.mobile,
        ticket.events?.title,
      ].some((value) => value?.toLowerCase().includes(needle));
    });
  }, [eventFilter, search, tickets]);

  const stats = useMemo(() => {
    const active = filteredTickets.filter((ticket) => ticket.status !== "cancelled");
    return {
      booked: active.length,
      checkedIn: active.filter((ticket) => ticket.status === "checked_in").length,
      awaiting: active.filter((ticket) => ticket.status === "confirmed").length,
      bookingValue: active.reduce((sum, ticket) => sum + ticket.price_paise, 0),
    };
  }, [filteredTickets]);

  const eventSummaries = useMemo(() => {
    const grouped = new Map<
      string,
      {
        id: string;
        title: string;
        date: string;
        capacity: number | null;
        price: number;
        booked: number;
        checkedIn: number;
        bookingValue: number;
      }
    >();

    tickets.forEach((ticket) => {
      const event = ticket.events;
      if (!event) return;
      const summary = grouped.get(event.id) ?? {
        id: event.id,
        title: event.title,
        date: event.date_start,
        capacity: event.max_capacity,
        price: event.ticket_price_paise,
        booked: 0,
        checkedIn: 0,
        bookingValue: 0,
      };
      if (ticket.status !== "cancelled") {
        summary.booked += 1;
        summary.bookingValue += ticket.price_paise;
      }
      if (ticket.status === "checked_in") summary.checkedIn += 1;
      grouped.set(event.id, summary);
    });

    return [...grouped.values()].sort((a, b) => b.date.localeCompare(a.date));
  }, [tickets]);

  const inputClass =
    "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-iris-500";

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Tickets & check-in</h1>
          <p className="mt-1 text-sm text-ink-600">
            Verify unique ticket QRs, track attendance, and review booking value.
          </p>
        </div>
        <button
          type="button"
          onClick={cameraActive ? stopCamera : () => void startCamera()}
          className="rounded-full bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white"
        >
          {cameraActive ? "Stop camera" : "Scan ticket QR"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ticket totals">
        {[
          ["Tickets booked", stats.booked.toLocaleString("en-IN"), "Confirmed + checked in"],
          ["Checked in", stats.checkedIn.toLocaleString("en-IN"), `${stats.booked ? Math.round((stats.checkedIn / stats.booked) * 100) : 0}% attendance`],
          ["Awaiting entry", stats.awaiting.toLocaleString("en-IN"), "Valid, not scanned yet"],
          ["Booking value", formatMoney(stats.bookingValue), "Price captured at booking"],
        ].map(([label, value, detail]) => (
          <div key={label} className="rounded-xl border border-line bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-ink-950">{value}</p>
            <p className="mt-1 text-xs text-ink-500">{detail}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-xl border border-line bg-white p-5 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-iris-600">Ticket verification</p>
            <h2 className="mt-2 font-display text-xl font-semibold">Scan or enter the code</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Scanning finds the attendee first. Confirm check-in only after matching their details.
            </p>

            <form onSubmit={submitLookup} className="mt-5 flex flex-col gap-2 sm:flex-row">
              <input
                value={lookupCode}
                onChange={(event) => setLookupCode(event.target.value)}
                placeholder="LBT-XXXXXXXXXXXX"
                aria-label="Ticket code"
                className={inputClass}
              />
              <button
                disabled={lookupBusy}
                className="shrink-0 rounded-lg border border-ink-950 px-4 py-2.5 text-sm font-semibold text-ink-950 disabled:opacity-60"
              >
                {lookupBusy ? "Finding…" : "Find ticket"}
              </button>
            </form>

            {cameraError && <p className="mt-3 text-sm text-amber-700">{cameraError}</p>}

            <div className={`mt-5 overflow-hidden rounded-xl bg-ink-950 ${cameraActive ? "block" : "hidden"}`}>
              <video ref={videoRef} playsInline muted className="aspect-video w-full object-cover" />
              <p className="px-4 py-3 text-center text-xs text-white/70">Hold the attendee QR inside the camera view.</p>
            </div>
          </div>

          <div className="rounded-xl bg-mist p-5">
            {!selectedTicket ? (
              <div className="flex min-h-56 items-center justify-center text-center">
                <div>
                  <p className="font-semibold text-ink-800">No ticket selected</p>
                  <p className="mt-1 text-sm text-ink-500">Scan a QR or look up its printed ticket code.</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs font-bold tracking-wide text-iris-600">{selectedTicket.ticket_code}</p>
                    <h3 className="mt-2 font-display text-xl font-semibold text-ink-950">{selectedTicket.event_registrations?.full_name ?? "Unknown attendee"}</h3>
                    <p className="mt-1 text-sm text-ink-500">{selectedTicket.event_registrations?.email}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusClasses(selectedTicket.status)}`}>
                    {selectedTicket.status.replace("_", " ")}
                  </span>
                </div>
                <dl className="mt-5 divide-y divide-line rounded-lg border border-line bg-white px-4">
                  <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-ink-500">Event</dt><dd className="text-right font-medium">{selectedTicket.events?.title ?? "—"}</dd></div>
                  <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-ink-500">Mobile</dt><dd className="font-medium">{selectedTicket.event_registrations?.mobile ?? "—"}</dd></div>
                  <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-ink-500">Booked value</dt><dd className="font-medium">{formatMoney(selectedTicket.price_paise)}</dd></div>
                </dl>

                {verificationMessage && (
                  <p className={`mt-4 rounded-lg px-3 py-2 text-sm ${verificationMessage.tone === "success" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"}`}>
                    {verificationMessage.text}
                  </p>
                )}

                {selectedTicket.status === "confirmed" && (
                  <button
                    type="button"
                    onClick={() => void checkIn()}
                    disabled={checkInBusy}
                    className="mt-5 w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {checkInBusy ? "Checking in…" : "Verify and check in"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div>
          <h2 className="font-display text-xl font-semibold">Event breakdown</h2>
          <p className="mt-1 text-sm text-ink-500">Booked seats, attendance, configured price, and booking value by event.</p>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line bg-slate-50 text-xs uppercase text-ink-400">
              <tr><th className="p-4">Event</th><th className="p-4">Tickets booked</th><th className="p-4">Checked in</th><th className="p-4">Ticket price</th><th className="p-4">Booking value</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {eventSummaries.map((summary) => (
                <tr key={summary.id}>
                  <td className="p-4"><p className="font-semibold">{summary.title}</p><p className="text-xs text-ink-400">{new Date(`${summary.date}T00:00:00`).toLocaleDateString("en-IN")}</p></td>
                  <td className="p-4 font-semibold">{summary.booked}{summary.capacity ? <span className="font-normal text-ink-400"> / {summary.capacity}</span> : null}</td>
                  <td className="p-4">{summary.checkedIn}</td>
                  <td className="p-4">{summary.price > 0 ? formatMoney(summary.price) : "Free"}</td>
                  <td className="p-4 font-semibold">{formatMoney(summary.bookingValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {eventSummaries.length === 0 && !loading && <p className="p-10 text-center text-sm text-ink-400">No event ticket data yet.</p>}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">All issued tickets</h2>
            <p className="mt-1 text-sm text-ink-500">Use the filters to reconcile a specific event or attendee.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-[220px_220px]">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search attendee or code" className={inputClass} />
            <select value={eventFilter} onChange={(event) => setEventFilter(event.target.value)} className={inputClass}>
              <option value="all">All events</option>
              {eventOptions.map(([id, title]) => <option key={id} value={id}>{title}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-line bg-slate-50 text-xs uppercase text-ink-400">
              <tr><th className="p-4">Attendee</th><th className="p-4">Event</th><th className="p-4">Ticket</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4">Issued</th><th className="p-4">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="p-4"><p className="font-medium">{ticket.event_registrations?.full_name || "—"}</p><p className="text-xs text-ink-400">{ticket.event_registrations?.email}</p></td>
                  <td className="p-4">{ticket.events?.title || "—"}</td>
                  <td className="p-4 font-mono text-xs">{ticket.ticket_code}</td>
                  <td className="p-4">{ticket.price_paise > 0 ? formatMoney(ticket.price_paise) : "Free"}</td>
                  <td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClasses(ticket.status)}`}>{ticket.status.replace("_", " ")}</span></td>
                  <td className="p-4">{new Date(ticket.created_at).toLocaleDateString("en-IN")}</td>
                  <td className="p-4"><button type="button" onClick={() => { setSelectedTicket(ticket); setLookupCode(ticket.ticket_code); setVerificationMessage(ticket.status === "checked_in" ? { tone: "warning", text: `Already checked in${ticket.checked_in_at ? ` at ${new Date(ticket.checked_in_at).toLocaleString("en-IN")}` : ""}.` } : null); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="font-semibold text-iris-600 hover:text-iris-500">Verify</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTickets.length === 0 && !loading && <p className="p-12 text-center text-sm text-ink-400">No tickets match these filters.</p>}
          {loading && <p className="p-12 text-center text-sm text-ink-400">Loading tickets…</p>}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-400">Booking value is the sum of ticket prices captured when tickets were issued. It is not payment revenue; online payment collection is not part of this flow yet.</p>
      </section>
    </div>
  );
}
