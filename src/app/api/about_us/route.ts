import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { PublicBoardMember } from "@/types/adminBoardMembers";

/* Fetch board members from DB, public action */
export async function GET() {
  const supabase = await createClient(await cookies());
  
  const { data, error } = await supabase
    .from("board_members")
    .select("id, name, role, email, image_url")
    .order("display_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data ?? []) as PublicBoardMember[]);
}
