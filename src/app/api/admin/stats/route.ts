import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [membersResult, soldResult, outResult] = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }),
    supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "sold"),
    supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "out"),
  ]);

  return NextResponse.json({
    totalMembers: membersResult.count ?? 0,
    totalTicketsSold: soldResult.count ?? 0,
    ticketOut: outResult.count ?? 0,
  });
}
