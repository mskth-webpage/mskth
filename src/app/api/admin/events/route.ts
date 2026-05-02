import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

export type EventPreview = {
  id: number;
  title: string;
  start_at: string;
  location: string | null;
  joined_count: number;
};

export type EventsResponse = {
  upcoming: EventPreview[];
  previous: EventPreview[];
};

export async function GET() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [upcomingResult, previousResult] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, start_at, location, joined_count")
      .gte("start_at", tomorrow.toISOString())
      .order("start_at", { ascending: true })
      .limit(10),
    supabase
      .from("events")
      .select("id, title, start_at, location, joined_count")
      .lt("start_at", today.toISOString())
      .order("start_at", { ascending: false })
      .limit(10),
  ]);

  return NextResponse.json({
    upcoming: upcomingResult.data ?? [],
    previous: previousResult.data ?? [],
  } satisfies EventsResponse);
}
