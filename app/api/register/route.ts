import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

export const runtime = "nodejs";

/* ——— Validation data (mirrors the client) ——— */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[6-9]\d{9}$/;
const DESCRIPTION_MAX = 1200;
const FIELD_MAX = 2000;

const STATES_AND_UTS = [
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

/** Accepted string keys, in the order they are stored. Everything else is stripped. */
const STRING_KEYS = [
  "fullName",
  "email",
  "mobile",
  "state",
  "city",
  "college",
  "course",
  "graduationYear",
  "ideaTitle",
  "stage",
  "category",
  "description",
  "role",
  "linkedin",
  "website",
  "pitchDeck",
  "additionalInfo",
] as const;

type StringKey = (typeof STRING_KEYS)[number];
type Application = Record<StringKey, string> & { consent: boolean };

const REQUIRED_KEYS: { key: StringKey; label: string }[] = [
  { key: "fullName", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Mobile number" },
  { key: "state", label: "State" },
  { key: "city", label: "City" },
  { key: "college", label: "College" },
  { key: "ideaTitle", label: "Idea title" },
  { key: "stage", label: "Stage" },
  { key: "category", label: "Category" },
  { key: "description", label: "Description" },
  { key: "role", label: "Role" },
];

const URL_KEYS: StringKey[] = ["linkedin", "website", "pitchDeck"];

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validate(app: Application): string | null {
  for (const { key, label } of REQUIRED_KEYS) {
    if (!app[key]) return `${label} is required.`;
  }
  for (const key of STRING_KEYS) {
    if (app[key].length > FIELD_MAX) return "One of the fields is too long.";
  }
  if (!EMAIL_RE.test(app.email)) return "Please provide a valid email address.";
  if (!MOBILE_RE.test(app.mobile))
    return "Please provide a valid 10-digit Indian mobile number.";
  if (!STATES_AND_UTS.includes(app.state))
    return "Please select a valid state or union territory.";
  if (!STAGES.includes(app.stage)) return "Please select a valid stage.";
  if (!CATEGORIES.includes(app.category))
    return "Please select a valid category.";
  if (!ROLES.includes(app.role)) return "Please select a valid role.";
  if (app.description.length > DESCRIPTION_MAX)
    return "The description must be 1,200 characters or fewer.";
  for (const key of URL_KEYS) {
    if (app[key] && !isValidUrl(app[key]))
      return "Links must be valid URLs, including https://.";
  }
  if (!app.consent)
    return "Consent is required to submit the application.";
  return null;
}

/* ——— Handler ——— */

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  /* Allowlist the accepted keys — anything else is stripped. */
  const raw = body as Record<string, unknown>;
  const app = {} as Application;
  for (const key of STRING_KEYS) {
    const value = raw[key];
    app[key] = typeof value === "string" ? value.trim() : "";
  }
  app.consent = raw.consent === true;

  const error = validate(app);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const id = `LB-${new Date().getFullYear()}-${randomUUID()
    .replace(/-/g, "")
    .slice(0, 6)
    .toUpperCase()}`;

  const entry = { id, submittedAt: new Date().toISOString(), ...app };

  try {
    const dataDir = path.join(process.cwd(), "data");
    const dataFile = path.join(dataDir, "applications.json");
    await mkdir(dataDir, { recursive: true });

    let applications: unknown[] = [];
    try {
      const existing = JSON.parse(await readFile(dataFile, "utf8"));
      if (Array.isArray(existing)) applications = existing;
    } catch {
      /* Missing or invalid file — start a fresh list. */
    }

    applications.push(entry);
    await writeFile(
      dataFile,
      JSON.stringify(applications, null, 2) + "\n",
      "utf8",
    );
  } catch {
    return NextResponse.json(
      { error: "Could not store the application. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ id }, { status: 201 });
}
