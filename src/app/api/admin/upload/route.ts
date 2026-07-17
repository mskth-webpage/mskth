import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

/** Accepts a multipart file upload and stores it in the event-images Supabase Storage bucket. Returns the public URL. */
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const folder = form.get("folder")?.toString() ?? "events"; // default events, but allows upload to other buckets as well
  const allowedFolders = ["events", "board_members", "projects", "project_groups"];

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!allowedFolders.includes(folder)) {return NextResponse.json({ error: "Error" }, { status: 400 });}  // Wrong bucket, cryptic for security

  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error("[upload] Supabase storage error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("images").getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl });
}
