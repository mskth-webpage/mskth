import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";
import type { ReorderGalleryMediaInput } from "@/types/adminGallery";

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body =
    (await request.json()) as ReorderGalleryMediaInput;

  if (!Array.isArray(body.items)) {
    return NextResponse.json(
      { error: "Invalid reorder payload" },
      { status: 400 },
    );
  }

  const updates = body.items.map((item) =>
    supabase
      .from("gallery_media")
      .update({
        display_order: item.display_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id),
  );

  const results = await Promise.all(updates);
  const failedUpdate = results.find((result) => result.error);

  if (failedUpdate?.error) {
    console.error(
      "[PATCH /api/admin/gallery/reorder]",
      failedUpdate.error.message,
    );

    return NextResponse.json(
      { error: failedUpdate.error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}