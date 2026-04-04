import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }

  const { name, email } =
    typeof body === "object" && body !== null
      ? (body as { name?: unknown; email?: unknown })
      : { name: "", email: "" };

  const trimmedName = typeof name === "string" ? name.trim() : "";
  const trimmedEmail = typeof email === "string" ? email.trim() : "";

  if (!trimmedName || !trimmedEmail) {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { error } = await supabase
    .from("subscriptions")
    .insert({ name: trimmedName, email: trimmedEmail });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ status: "success" });
    }

    return NextResponse.json({ status: "error" }, { status: 500 });
  }

  return NextResponse.json({ status: "success" });
}
