import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Project } from "@/view/admin/project/AdminProjectsView";

/** Returns all published projects for public display. No auth required. */
export async function GET() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("projects")
    .select("id, title, description, content, group_label, status, image_url")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json((data ?? []) as Project[]);
}
