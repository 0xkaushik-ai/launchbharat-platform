"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui";

/* ——— Static form data ——— */

const DRAFT_KEY = "lb-registration-draft";

const STEPS = [
  { id: "personal", number: "01", label: "Personal", title: "Personal details" },
  { id: "institution", number: "02", label: "Institution", title: "Institution" },
  { id: "idea", number: "03", label: "Idea", title: "Idea & startup" },
  {
    id: "participation",
    number: "04",
    label: "Participation",
    title: "Participation",
  },
  { id: "submit", number: "05", label: "Submit", title: "Review & submit" },
] as const;

const STEP_INTROS: Record<number, string> = {
  0: "Tell us who you are and where you are based.",
  1: "Tell us where you study or studied.",
  2: "Describe the idea you want to take forward. A few honest sentences are enough.",
  3: "Tell us how you want to take part in the movement.",
  4: "Check your application before you submit it. Use Edit to change any section.",
};

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const UNION_TERRITORIES = [
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const STAGES = [
  "Idea",
  "Prototype",
  "Early revenue",
  "Growing startup",
  "Just exploring",
];

const CATEGORIES = [
  "Technology",
  "Social Impact",
  "Climate & Sustainability",
  "Health",
  "Education",
  "Agriculture",
  "Fintech",
  "Consumer",
  "Deep Tech",
  "Other",
];

const ROLES = [
  "Student",
  "Student Founder",
  "Innovator",
  "Startup Team",
  "Other",
];

const CURRENT_YEAR = new Date().getFullYear();
const GRAD_YEARS = Array.from({ length: 11 }, (_, i) =>
  String(CURRENT_YEAR - 4 + i),
);

const DESCRIPTION_MAX = 1200;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[6-9]\d{9}$/;

/* ——— Types & validation ——— */

interface FormValues {
  fullName: string;
  email: string;
  mobile: string;
  state: string;
  city: string;
  college: string;
  course: string;
  graduationYear: string;
  ideaTitle: string;
  stage: string;
  category: string;
  description: string;
  role: string;
  linkedin: string;
  website: string;
  pitchDeck: string;
  additionalInfo: string;
  consent: boolean;
}

type FieldKey = keyof FormValues;
type Errors = Partial<Record<FieldKey, string>>;

const EMPTY_VALUES: FormValues = {
  fullName: "",
  email: "",
  mobile: "",
  state: "",
  city: "",
  college: "",
  course: "",
  graduationYear: "",
  ideaTitle: "",
  stage: "",
  category: "",
  description: "",
  role: "",
  linkedin: "",
  website: "",
  pitchDeck: "",
  additionalInfo: "",
  consent: false,
};

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateStep(step: number, v: FormValues): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!v.fullName.trim()) e.fullName = "Please enter your full name.";
    if (!v.email.trim()) e.email = "Please enter your email address.";
    else if (!EMAIL_RE.test(v.email.trim()))
      e.email = "Please enter a valid email address.";
    if (!v.mobile.trim()) e.mobile = "Please enter your mobile number.";
    else if (!MOBILE_RE.test(v.mobile.trim()))
      e.mobile = "Enter a 10-digit Indian mobile number starting with 6–9.";
    if (!v.state) e.state = "Please select your state or union territory.";
    if (!v.city.trim()) e.city = "Please enter your city.";
  }
  if (step === 1) {
    if (!v.college.trim())
      e.college = "Please enter your college or institution.";
  }
  if (step === 2) {
    if (!v.ideaTitle.trim()) e.ideaTitle = "Please give your idea a title.";
    if (!v.stage) e.stage = "Please select the current stage.";
    if (!v.category) e.category = "Please select a category.";
    if (!v.description.trim()) e.description = "Please describe your idea.";
    else if (v.description.length > DESCRIPTION_MAX)
      e.description = "Please keep the description within 1,200 characters.";
  }
  if (step === 3) {
    if (!v.role) e.role = "Please select how you are participating.";
    if (v.linkedin.trim() && !isValidUrl(v.linkedin.trim()))
      e.linkedin = "Please enter a valid URL, including https://.";
    if (v.website.trim() && !isValidUrl(v.website.trim()))
      e.website = "Please enter a valid URL, including https://.";
    if (v.pitchDeck.trim() && !isValidUrl(v.pitchDeck.trim()))
      e.pitchDeck = "Please enter a valid URL, including https://.";
    if (!v.consent) e.consent = "Please confirm before continuing.";
  }
  return e;
}

/* ——— Small building blocks ——— */

const inputCls = (invalid: boolean) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink-950 transition placeholder:text-ink-400 focus:border-saffron-500 focus:shadow-[0_0_0_3px_rgba(234,124,12,0.12)] focus:outline-none ${
    invalid ? "border-red-400" : "border-line"
  }`;

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
    >
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="ml-0.5 text-saffron-600">
        *
      </span>
      <span className="sr-only">required</span>
    </>
  );
}

function Field({
  id,
  label,
  required = false,
  error,
  hint,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-ink-600"
      >
        {label}
        {required && <RequiredMark />}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, extra?: string) {
  const ids = [error ? `${id}-error` : null, extra ?? null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

/* ——— Progress indicator ——— */

function Progress({ step }: { step: number }) {
  return (
    <div>
      {/* Mobile: compact label + slim bar */}
      <div className="sm:hidden">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-600">
          Step {step + 1} of {STEPS.length}
          <span aria-hidden="true"> — </span>
          <span className="text-ink-950">{STEPS[step].label}</span>
        </p>
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={step + 1}
          aria-label={`Application progress: step ${step + 1} of ${STEPS.length}`}
          className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-line"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-saffron-500 via-white to-green-500 transition-[width] duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: numbered steps with connected rail */}
      <ol aria-label="Application steps" className="hidden items-start sm:flex">
        {STEPS.map((s, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li
              key={s.id}
              aria-current={current ? "step" : undefined}
              className={`flex items-start ${i > 0 ? "flex-1" : ""}`}
            >
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={`mx-2 mt-[15px] h-px min-w-4 flex-1 ${
                    i <= step
                      ? "bg-gradient-to-r from-saffron-500 via-white to-green-500"
                      : "bg-line"
                  }`}
                />
              )}
              <span className="flex flex-col items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-[11px] font-bold tabular-nums ${
                    done
                      ? "bg-gradient-to-br from-saffron-500 to-green-500 text-ink-950 shadow-[0_6px_16px_-6px_rgba(234,124,12,0.5)]"
                      : current
                        ? "border-2 border-saffron-500 bg-saffron-500 text-saffron-600 shadow-[0_0_18px_rgba(234,124,12,0.35)]"
                        : "border border-line bg-white text-ink-400"
                  }`}
                >
                  {done ? <CheckIcon className="h-4 w-4" /> : s.number}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                    done || current ? "text-ink-950" : "text-ink-400"
                  }`}
                >
                  {s.label}
                  {done && <span className="sr-only"> (completed)</span>}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ——— Review step ——— */

const REVIEW_GROUPS: {
  step: number;
  rows: { label: string; key: Exclude<FieldKey, "consent"> }[];
}[] = [
  {
    step: 0,
    rows: [
      { label: "Full name", key: "fullName" },
      { label: "Email", key: "email" },
      { label: "Mobile", key: "mobile" },
      { label: "State / UT", key: "state" },
      { label: "City", key: "city" },
    ],
  },
  {
    step: 1,
    rows: [
      { label: "College / institution", key: "college" },
      { label: "Course", key: "course" },
      { label: "Graduation year", key: "graduationYear" },
    ],
  },
  {
    step: 2,
    rows: [
      { label: "Idea title", key: "ideaTitle" },
      { label: "Stage", key: "stage" },
      { label: "Category", key: "category" },
      { label: "Description", key: "description" },
    ],
  },
  {
    step: 3,
    rows: [
      { label: "Participating as", key: "role" },
      { label: "LinkedIn", key: "linkedin" },
      { label: "Website", key: "website" },
      { label: "Pitch deck", key: "pitchDeck" },
      { label: "Additional information", key: "additionalInfo" },
    ],
  },
];

/* ——— Success view ——— */

function SuccessView({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
    } catch {
      /* Clipboard unavailable — the ID stays visible on screen. */
    }
  };

  const nextSteps = [
    "Our team reviews your application. Every submission is read.",
    "You receive a confirmation and programme updates at your registered email.",
    "You are invited into the journey, starting with programs near you.",
  ];

  return (
    <div className="flex flex-col items-start gap-8">
      <span
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-saffron-500 via-white to-green-500 text-ink-950 shadow-[0_14px_32px_-12px_rgba(234,124,12,0.55)]"
      >
        <CheckIcon className="h-7 w-7" />
      </span>

      <div>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="display-md text-ink-950 focus:outline-none"
        >
          Welcome to <span className="text-saffron-600">LaunchBharat</span>.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink-800">
          Your application has been successfully submitted.
        </p>
      </div>

      <div className="neo-border flex w-full max-w-md items-center justify-between gap-4 rounded-xl px-5 py-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-600">
            Application ID
          </p>
          <p className="mt-1 truncate font-mono text-lg font-bold tabular-nums tracking-[0.14em] text-ink-950">
            {id}
          </p>
        </div>
        <button
          type="button"
          onClick={copyId}
          className="chip-mono shrink-0 cursor-pointer transition hover:border-saffron-500 hover:text-saffron-600"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? "Application ID copied to clipboard." : ""}
        </span>
      </div>

      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-600">
          What happens next
        </h3>
        <ol className="mt-4 space-y-3.5">
          {nextSteps.map((text, i) => (
            <li key={text} className="flex gap-3 text-sm leading-relaxed text-ink-800">
              <span
                aria-hidden="true"
                className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-saffron-500 to-green-500 font-mono text-[10px] font-bold tabular-nums text-ink-950"
              >
                0{i + 1}
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <Button href="/events" variant="secondary">
          Explore events
        </Button>
        <Button href="/" variant="ghost">
          Back to home
        </Button>
      </div>
    </div>
  );
}

/* ——— The form ——— */

export default function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Errors>({});
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusHeadingPending = useRef(false);
  const focusErrorPending = useRef(false);

  /* Restore draft from sessionStorage on mount. */
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { step?: unknown; values?: unknown };
        if (parsed && typeof parsed === "object") {
          const saved = parsed.values;
          if (saved && typeof saved === "object") {
            setValues((current) => {
              const next: FormValues = { ...current };
              for (const key of Object.keys(EMPTY_VALUES) as FieldKey[]) {
                const value = (saved as Record<string, unknown>)[key];
                if (key === "consent") {
                  if (typeof value === "boolean") next.consent = value;
                } else if (typeof value === "string") {
                  (next as unknown as Record<string, string>)[key] = value;
                }
              }
              return next;
            });
          }
          if (
            typeof parsed.step === "number" &&
            Number.isInteger(parsed.step) &&
            parsed.step >= 0 &&
            parsed.step < STEPS.length
          ) {
            setStep(parsed.step);
          }
        }
      }
    } catch {
      /* Corrupted draft — start fresh. */
    }
    setHydrated(true);
  }, []);

  /* Persist draft on change (until success). */
  useEffect(() => {
    if (!hydrated || applicationId) return;
    try {
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ step, values }));
    } catch {
      /* Storage unavailable — the form still works. */
    }
  }, [hydrated, applicationId, step, values]);

  /* Move focus to the step heading after user-initiated step changes. */
  useEffect(() => {
    if (!focusHeadingPending.current) return;
    focusHeadingPending.current = false;
    headingRef.current?.focus();
  }, [step]);

  /* Move focus to the first invalid field after a failed validation. */
  useEffect(() => {
    if (!focusErrorPending.current) return;
    focusErrorPending.current = false;
    rootRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [errors]);

  function setField<K extends FieldKey>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function goToStep(target: number) {
    setErrors({});
    setSubmitError(null);
    focusHeadingPending.current = true;
    setStep(target);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    /* Steps 1–4: validate and advance. */
    if (step < STEPS.length - 1) {
      const stepErrors = validateStep(step, values);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        focusErrorPending.current = true;
        return;
      }
      goToStep(step + 1);
      return;
    }

    /* Final step: re-validate everything, then submit. */
    for (let s = 0; s < STEPS.length - 1; s += 1) {
      const stepErrors = validateStep(s, values);
      if (Object.keys(stepErrors).length > 0) {
        setStep(s);
        setErrors(stepErrors);
        focusErrorPending.current = true;
        return;
      }
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ]),
      );
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const message =
          body && typeof body === "object" && "error" in body &&
          typeof (body as { error: unknown }).error === "string"
            ? (body as { error: string }).error
            : "Something went wrong on our side.";
        throw new Error(message);
      }
      const id =
        body && typeof body === "object" && "id" in body &&
        typeof (body as { id: unknown }).id === "string"
          ? (body as { id: string }).id
          : null;
      if (!id) throw new Error("Something went wrong on our side.");
      try {
        window.sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      setApplicationId(id);
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong on our side.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (applicationId) {
    return (
      <div className="glass corner-frame rounded-3xl p-6 sm:p-8 lg:p-10">
        <SuccessView id={applicationId} />
      </div>
    );
  }

  const current = STEPS[step];

  return (
    <div ref={rootRef} className="glass corner-frame rounded-3xl p-6 sm:p-8 lg:p-10">
      <Progress step={step} />

      <form onSubmit={handleSubmit} noValidate className="mt-10">
        {/* Step header */}
        <div className="border-b border-line pb-6">
          <p className="chip-mono">
            Step {current.number} / 05
          </p>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-display mt-3 text-xl font-semibold tracking-tight text-ink-950 focus:outline-none"
          >
            {current.title}
          </h2>
          <p className="mt-1.5 text-sm text-ink-600">{STEP_INTROS[step]}</p>
        </div>

        <div className="mt-8">
          {/* ——— Step 01 · Personal Details ——— */}
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="reg-fullName"
                label="Full name"
                required
                error={errors.fullName}
                className="sm:col-span-2"
              >
                <input
                  id="reg-fullName"
                  type="text"
                  autoComplete="name"
                  value={values.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  aria-required="true"
                  aria-invalid={errors.fullName ? true : undefined}
                  aria-describedby={describedBy("reg-fullName", errors.fullName)}
                  className={inputCls(!!errors.fullName)}
                />
              </Field>
              <Field id="reg-email" label="Email" required error={errors.email}>
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => setField("email", e.target.value)}
                  aria-required="true"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={describedBy("reg-email", errors.email)}
                  className={inputCls(!!errors.email)}
                />
              </Field>
              <Field
                id="reg-mobile"
                label="Mobile number"
                required
                error={errors.mobile}
              >
                <input
                  id="reg-mobile"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={values.mobile}
                  onChange={(e) =>
                    setField(
                      "mobile",
                      e.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  aria-required="true"
                  aria-invalid={errors.mobile ? true : undefined}
                  aria-describedby={describedBy("reg-mobile", errors.mobile)}
                  className={inputCls(!!errors.mobile)}
                />
              </Field>
              <Field
                id="reg-state"
                label="State / Union Territory"
                required
                error={errors.state}
              >
                <div className="relative">
                  <select
                    id="reg-state"
                    value={values.state}
                    onChange={(e) => setField("state", e.target.value)}
                    aria-required="true"
                    aria-invalid={errors.state ? true : undefined}
                    aria-describedby={describedBy("reg-state", errors.state)}
                    className={`${inputCls(!!errors.state)} appearance-none pr-10`}
                  >
                    <option value="">Select your state or UT</option>
                    <optgroup label="States">
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Union Territories">
                      {UNION_TERRITORIES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <ChevronIcon />
                </div>
              </Field>
              <Field id="reg-city" label="City" required error={errors.city}>
                <input
                  id="reg-city"
                  type="text"
                  autoComplete="address-level2"
                  value={values.city}
                  onChange={(e) => setField("city", e.target.value)}
                  aria-required="true"
                  aria-invalid={errors.city ? true : undefined}
                  aria-describedby={describedBy("reg-city", errors.city)}
                  className={inputCls(!!errors.city)}
                />
              </Field>
            </div>
          )}

          {/* ——— Step 02 · Institution ——— */}
          {step === 1 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="reg-college"
                label="College / institution"
                required
                error={errors.college}
                className="sm:col-span-2"
              >
                <input
                  id="reg-college"
                  type="text"
                  autoComplete="organization"
                  value={values.college}
                  onChange={(e) => setField("college", e.target.value)}
                  aria-required="true"
                  aria-invalid={errors.college ? true : undefined}
                  aria-describedby={describedBy("reg-college", errors.college)}
                  className={inputCls(!!errors.college)}
                />
              </Field>
              <Field id="reg-course" label="Course">
                <input
                  id="reg-course"
                  type="text"
                  placeholder="e.g. B.Tech Computer Science"
                  value={values.course}
                  onChange={(e) => setField("course", e.target.value)}
                  className={inputCls(false)}
                />
              </Field>
              <Field id="reg-graduationYear" label="Graduation year">
                <div className="relative">
                  <select
                    id="reg-graduationYear"
                    value={values.graduationYear}
                    onChange={(e) => setField("graduationYear", e.target.value)}
                    className={`${inputCls(false)} appearance-none pr-10`}
                  >
                    <option value="">Select year</option>
                    {GRAD_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>
              </Field>
            </div>
          )}

          {/* ——— Step 03 · Idea & Startup ——— */}
          {step === 2 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="reg-ideaTitle"
                label="Idea title"
                required
                error={errors.ideaTitle}
                className="sm:col-span-2"
              >
                <input
                  id="reg-ideaTitle"
                  type="text"
                  value={values.ideaTitle}
                  onChange={(e) => setField("ideaTitle", e.target.value)}
                  aria-required="true"
                  aria-invalid={errors.ideaTitle ? true : undefined}
                  aria-describedby={describedBy("reg-ideaTitle", errors.ideaTitle)}
                  className={inputCls(!!errors.ideaTitle)}
                />
              </Field>
              <Field id="reg-stage" label="Stage" required error={errors.stage}>
                <div className="relative">
                  <select
                    id="reg-stage"
                    value={values.stage}
                    onChange={(e) => setField("stage", e.target.value)}
                    aria-required="true"
                    aria-invalid={errors.stage ? true : undefined}
                    aria-describedby={describedBy("reg-stage", errors.stage)}
                    className={`${inputCls(!!errors.stage)} appearance-none pr-10`}
                  >
                    <option value="">Select stage</option>
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>
              </Field>
              <Field
                id="reg-category"
                label="Category"
                required
                error={errors.category}
              >
                <div className="relative">
                  <select
                    id="reg-category"
                    value={values.category}
                    onChange={(e) => setField("category", e.target.value)}
                    aria-required="true"
                    aria-invalid={errors.category ? true : undefined}
                    aria-describedby={describedBy("reg-category", errors.category)}
                    className={`${inputCls(!!errors.category)} appearance-none pr-10`}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>
              </Field>
              <Field
                id="reg-description"
                label="Describe your idea"
                required
                error={errors.description}
                className="sm:col-span-2"
              >
                <textarea
                  id="reg-description"
                  rows={6}
                  maxLength={DESCRIPTION_MAX}
                  value={values.description}
                  onChange={(e) => setField("description", e.target.value)}
                  aria-required="true"
                  aria-invalid={errors.description ? true : undefined}
                  aria-describedby={describedBy(
                    "reg-description",
                    errors.description,
                    "reg-description-count",
                  )}
                  className={`${inputCls(!!errors.description)} resize-y`}
                />
                <p
                  id="reg-description-count"
                  className="mt-1.5 text-right text-xs tabular-nums text-ink-400"
                >
                  {values.description.length} / {DESCRIPTION_MAX}
                </p>
              </Field>
            </div>
          )}

          {/* ——— Step 04 · Participation ——— */}
          {step === 3 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="reg-role"
                label="Participating as"
                required
                error={errors.role}
                className="sm:col-span-2"
              >
                <div className="relative">
                  <select
                    id="reg-role"
                    value={values.role}
                    onChange={(e) => setField("role", e.target.value)}
                    aria-required="true"
                    aria-invalid={errors.role ? true : undefined}
                    aria-describedby={describedBy("reg-role", errors.role)}
                    className={`${inputCls(!!errors.role)} appearance-none pr-10`}
                  >
                    <option value="">Select your role</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>
              </Field>
              <Field
                id="reg-linkedin"
                label="LinkedIn profile"
                error={errors.linkedin}
              >
                <input
                  id="reg-linkedin"
                  type="url"
                  autoComplete="url"
                  placeholder="https://"
                  value={values.linkedin}
                  onChange={(e) => setField("linkedin", e.target.value)}
                  aria-invalid={errors.linkedin ? true : undefined}
                  aria-describedby={describedBy("reg-linkedin", errors.linkedin)}
                  className={inputCls(!!errors.linkedin)}
                />
              </Field>
              <Field id="reg-website" label="Website" error={errors.website}>
                <input
                  id="reg-website"
                  type="url"
                  autoComplete="url"
                  placeholder="https://"
                  value={values.website}
                  onChange={(e) => setField("website", e.target.value)}
                  aria-invalid={errors.website ? true : undefined}
                  aria-describedby={describedBy("reg-website", errors.website)}
                  className={inputCls(!!errors.website)}
                />
              </Field>
              <Field
                id="reg-pitchDeck"
                label="Pitch deck"
                error={errors.pitchDeck}
                hint="Link to your deck — Google Drive, Notion or similar."
                className="sm:col-span-2"
              >
                <input
                  id="reg-pitchDeck"
                  type="url"
                  placeholder="https://"
                  value={values.pitchDeck}
                  onChange={(e) => setField("pitchDeck", e.target.value)}
                  aria-invalid={errors.pitchDeck ? true : undefined}
                  aria-describedby={describedBy(
                    "reg-pitchDeck",
                    errors.pitchDeck,
                    "reg-pitchDeck-hint",
                  )}
                  className={inputCls(!!errors.pitchDeck)}
                />
              </Field>
              <Field
                id="reg-additionalInfo"
                label="Anything else we should know"
                className="sm:col-span-2"
              >
                <textarea
                  id="reg-additionalInfo"
                  rows={4}
                  value={values.additionalInfo}
                  onChange={(e) => setField("additionalInfo", e.target.value)}
                  className={`${inputCls(false)} resize-y`}
                />
              </Field>
              <div className="sm:col-span-2">
                <label
                  htmlFor="reg-consent"
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-white px-4 py-3.5 ${
                    errors.consent ? "border-red-400" : "border-line"
                  }`}
                >
                  <input
                    id="reg-consent"
                    type="checkbox"
                    checked={values.consent}
                    onChange={(e) => setField("consent", e.target.checked)}
                    aria-required="true"
                    aria-invalid={errors.consent ? true : undefined}
                    aria-describedby={describedBy("reg-consent", errors.consent)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-saffron-600"
                  />
                  <span className="text-sm leading-relaxed text-ink-800">
                    I confirm the information provided is accurate and agree to
                    be contacted about the movement.
                    <RequiredMark />
                  </span>
                </label>
                {errors.consent && (
                  <p
                    id="reg-consent-error"
                    className="mt-1.5 text-xs text-red-600"
                  >
                    {errors.consent}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ——— Step 05 · Review & Submit ——— */}
          {step === 4 && (
            <div className="space-y-6">
              {REVIEW_GROUPS.map((group) => {
                const meta = STEPS[group.step];
                return (
                  <div
                    key={meta.id}
                    className="overflow-hidden rounded-2xl border border-line bg-white"
                  >
                    <div className="flex items-center justify-between gap-4 border-b border-line bg-mist/60 px-5 py-3">
                      <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-950">
                        <span
                          aria-hidden="true"
                          className="mr-2 tabular-nums text-ink-400"
                        >
                          {meta.number}
                        </span>
                        {meta.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => goToStep(group.step)}
                        className="font-mono text-[11px] font-semibold uppercase tracking-widest text-saffron-600 underline-offset-4 hover:underline"
                      >
                        Edit
                        <span className="sr-only"> {meta.title}</span>
                      </button>
                    </div>
                    <dl className="divide-y divide-line">
                      {group.rows.map((row) => (
                        <div
                          key={row.key}
                          className="grid gap-1 px-5 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4"
                        >
                          <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-600">
                            {row.label}
                          </dt>
                          <dd className="whitespace-pre-wrap break-words text-sm text-ink-950">
                            {values[row.key].trim() || "—"}
                          </dd>
                        </div>
                      ))}
                      {group.step === 3 && (
                        <div className="grid gap-1 px-5 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
                          <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-600">
                            Consent
                          </dt>
                          <dd className="text-sm text-ink-950">
                            {values.consent ? "Confirmed" : "Not confirmed"}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                );
              })}

              {submitError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-600/40 bg-red-50 px-4 py-3"
                >
                  <p className="text-sm font-semibold text-red-700">
                    We could not submit your application.
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-red-600">
                    {submitError} Your answers are saved in this tab — please
                    try again in a moment.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
          <div>
            {step > 0 && (
              <Button variant="ghost" onClick={() => goToStep(step - 1)}>
                Back
              </Button>
            )}
          </div>
          {step < STEPS.length - 1 ? (
            <Button type="submit" variant="primary">
              Continue
            </Button>
          ) : (
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting && (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
              )}
              {submitting ? "Submitting" : "Submit application"}
            </Button>
          )}
        </div>
      </form>

      <p className="mt-6 text-xs text-ink-600">
        Your progress is saved in this browser tab until you submit.
      </p>
    </div>
  );
}
