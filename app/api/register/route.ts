import { NextResponse } from "next/server";

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
  const app = {} as Record<string, any>;
  for (const key of STRING_KEYS) {
    const value = raw[key];
    app[key] = typeof value === "string" ? value.trim() : "";
  }
  app.consent = raw.consent === true;

  try {
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-api`;
    
    const res = await fetch(edgeFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        action: "register_user",
        payload: app,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Could not register user." }, { status: 400 });
    }

    return NextResponse.json({ id: data.id, generatedPassword: data.generatedPassword }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
