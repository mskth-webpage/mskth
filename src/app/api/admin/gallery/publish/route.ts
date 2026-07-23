import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";
import type { GalleryMediaStatus } from "@/types/adminGallery";

type PublishGalleryRequest = {
  year?: number;
  status?: GalleryMediaStatus;
};

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

  const body = (await request.json()) as PublishGalleryRequest;

  if (
    !body.year ||
    !body.status ||
    !["draft", "published"].includes(body.status)
  ) {
    return NextResponse.json(
      { error: "Invalid year or status" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("gallery_media")
    .update({
      status: body.status,
      updated_at: new Date().toISOString(),
    })
    .eq("year", body.year)
    .select();

  if (error) {
    console.error(
      "[PATCH /api/admin/gallery/publish]",
      error.message,
    );

    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    updated: data?.length ?? 0,
    status: body.status,
  });
}