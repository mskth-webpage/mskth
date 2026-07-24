import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { PublicProjectGroup } from "@/types/projectGroups";

/* Fetch project groups from DB, public action */
export async function GET() {
  const supabase = await createClient(await cookies());
  
  const { data, error } = await supabase
    .from("project_groups")
    .select("id, name, description, contact_email, image_url")
    .order("display_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data ?? []) as PublicProjectGroup[]);
}
