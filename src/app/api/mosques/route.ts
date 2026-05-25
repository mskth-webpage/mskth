import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Mosque } from "@/types/mosque";

export const dynamic = "force-dynamic";

/** Returns id, name, and coordinates for all mosques — used to place map markers on the public mosques page. */
export async function GET() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("mosques")
    .select("id, name, latitude, longitude")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json((data ?? []) as Mosque[]);
}
