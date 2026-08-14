import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const application: Record<string, string | boolean> = {};
  for (const key of STRING_KEYS) {
    const value = raw[key];
    application[key] = typeof value === "string" ? value.trim() : "";
  }
  application.consent = raw.consent === true;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Registration is temporarily unavailable." }, { status: 503 });
  }

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase.rpc("submit_application", { payload: application });
    if (error) {
      return NextResponse.json({ error: error.message || "Could not submit application." }, { status: 400 });
    }
    const id = data && typeof data === "object" && "id" in data ? data.id : null;
    return NextResponse.json({ id }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not submit application." }, { status: 500 });
  }
}
