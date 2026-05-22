import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { AdminEvent } from "@/types/adminEvent";

/** Returns all past events (start_at < today) with full event fields, ordered by start date descending. */
export async function GET() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, start_at, end_at, location, status, image_url, joined_count, max_participants, audience, language")
    .lt("start_at", today.toISOString())
    .order("start_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json((data ?? []) as AdminEvent[]);
}
