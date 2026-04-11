import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email, password } =
    typeof body === "object" && body !== null
      ? (body as { email?: unknown; password?: unknown })
      : { email: "", password: "" };

  const trimmedEmail = typeof email === "string" ? email.trim() : "";
  const normalizedPassword = typeof password === "string" ? password : "";

  if (!trimmedEmail || !normalizedPassword) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password: normalizedPassword,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({ status: "success" });
}
