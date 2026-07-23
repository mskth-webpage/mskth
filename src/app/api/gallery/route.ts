import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";
import type { GalleryMediaItem } from "@/types/adminGallery";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from("gallery_media")
      .select(
        `
            id,
            year,
            media_type,
            media_url,
            thumbnail_url,
            alt_text,
            display_order,
            status,
            created_at,
            updated_at
          `,
      )
      .eq("status", "published")
      .order("year", {
        ascending: false,
      })
      .order("display_order", {
        ascending: true,
      });

    if (error) {
      console.error("[GET /api/gallery]", error.message);

      return NextResponse.json(
        {
          error: "Failed to fetch gallery media",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json((data ?? []) as GalleryMediaItem[]);
  } catch (error) {
    console.error("[GET /api/gallery]", error);

    return NextResponse.json(
      {
        error: "Unexpected server error",
      },
      {
        status: 500,
      },
    );
  }
}
