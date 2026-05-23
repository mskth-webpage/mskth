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
    .select("id, title, description, start_at, end_at, registration_closes_at, location, status, image_url, joined_count, language")
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
      ...(body.registration_closes_at ? { registration_closes_at: body.registration_closes_at } : {}),
    })
    .select("id, title, description, start_at, end_at, registration_closes_at, location, status, image_url, joined_count, language")
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

  const { error } = await auth.supabase
    .from("events")
    .update(fields)
    .eq("id", id);

  if (error) {
    console.error("[PATCH /api/admin/event]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
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

  const { error } = await auth.supabase.from("events").delete().eq("id", Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
