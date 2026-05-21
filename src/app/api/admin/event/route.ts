import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { AdminEvent, CreateEventInput } from "@/types/adminEvent";

/** Creates a Supabase client from the request cookies and returns it with the authenticated user, or null if unauthenticated. */
async function getAuthedClient() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  return user ? { supabase, user } : null;
}

/** Returns all upcoming events (start_at >= today or the provided `from` date), ordered by start date. */
export async function GET(req: NextRequest) {
  const auth = await getAuthedClient();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const from = new URL(req.url).searchParams.get("from");
  const cutoff = from ? new Date(from) : new Date();
  cutoff.setHours(0, 0, 0, 0);

  const { data, error } = await auth.supabase
    .from("events")
    .select("id, title, description, start_at, end_at, location, status, image_url, joined_count, language")
    .gte("start_at", cutoff.toISOString())
    .order("start_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json((data ?? []) as AdminEvent[]);
}

/** Creates a new event as a draft. Accepts title, description, start/end dates, and optional image, location, audience, and max_participants. */
export async function POST(req: NextRequest) {
  const auth = await getAuthedClient();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: CreateEventInput = await req.json();

  const { data, error } = await auth.supabase
    .from("events")
    .insert({
      title: body.title,
      description: body.description,
      start_at: body.start_at,
      end_at: body.end_at,
      status: "draft",
      ...(body.image_url ? { image_url: body.image_url } : {}),
      ...(body.location ? { location: body.location } : {}),
      ...(body.max_participants ? { max_participants: body.max_participants } : {}),
      ...(body.audience ? { audience: body.audience } : {}),
      ...(body.language ? { language: body.language } : {}),
    })
    .select("id, title, description, start_at, end_at, location, status, image_url, joined_count, language")
    .single();

  if (error) {
    console.error("[POST /api/admin/event]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data as AdminEvent, { status: 201 });
}

/** Updates an event by id. Accepts any subset of event fields (status, title, dates, etc.). */
export async function PATCH(req: NextRequest) {
  const auth = await getAuthedClient();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...fields } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // 1. Fetch the original event to see if the image changed
  const { data: originalEvent } = await auth.supabase
    .from("events")
    .select("image_url")
    .eq("id", id)
    .single();

  const { error } = await auth.supabase
    .from("events")
    .update(fields)
    .eq("id", id);

  if (error) {
    console.error("[PATCH /api/admin/event]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 2. Clean up the old image from storage if it was changed
  if (
    originalEvent &&
    originalEvent.image_url &&
    fields.image_url !== undefined && // We are updating the image_url field
    originalEvent.image_url !== fields.image_url &&
    !originalEvent.image_url.includes("MSkth.png")
  ) {
    const urlParts = originalEvent.image_url.split('/public/images/');
    if (urlParts.length === 2) {
      const filePath = urlParts[1];
      const { error: storageError } = await auth.supabase.storage
        .from('images')
        .remove([filePath]);
        
      if (storageError) {
        console.error("Failed to delete old event image from storage:", storageError.message);
      }
    }
  }

  return NextResponse.json({ success: true });
}

/** Permanently deletes an event by id passed as a query param. */
export async function DELETE(req: NextRequest) {
  const auth = await getAuthedClient();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // 1. Fetch the event first to get the image_url BEFORE deleting it
  const { data: eventToDel } = await auth.supabase
    .from("events")
    .select("image_url")
    .eq("id", Number(id))
    .single();

  // 2. Delete the event from the database
  const { error } = await auth.supabase.from("events").delete().eq("id", Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 3. Delete the image from the storage bucket, ONLY IF it's not the default MSkth.png
  if (eventToDel?.image_url && !eventToDel.image_url.includes("MSkth.png")) {
    const urlParts = eventToDel.image_url.split('/public/images/');
    if (urlParts.length === 2) {
      const filePath = urlParts[1];
      const { error: storageError } = await auth.supabase.storage
        .from('images')
        .remove([filePath]);
        
      if (storageError) {
        console.error("Failed to delete event image from storage:", storageError.message);
      }
    }
  }

  return NextResponse.json({ success: true });
}
