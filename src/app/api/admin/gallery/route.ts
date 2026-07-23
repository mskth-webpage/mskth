import { cookies } from "next/headers";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { createClient } from "@/utils/supabase/server";
import type {
  CreateGalleryMediaInput,
  GalleryMediaItem,
  GalleryMediaStatus,
} from "@/types/adminGallery";

const GALLERY_COLUMNS =
  "id, year, media_type, media_url, thumbnail_url, alt_text, display_order, status, created_at, updated_at";

async function getAuthenticatedClient() {
  const cookieStore = await cookies();
  const supabase =
    await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return { supabase, user };
}

/**
 * Returns all gallery items for authenticated administrators.
 */
export async function GET() {
  const auth =
    await getAuthenticatedClient();

  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { data, error } =
    await auth.supabase
      .from("gallery_media")
      .select(GALLERY_COLUMNS)
      .order("year", {
        ascending: false,
      })
      .order("display_order", {
        ascending: true,
      });

  if (error) {
    console.error(
      "[GET /api/admin/gallery]",
      error.message,
    );

    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    (data ?? []) as GalleryMediaItem[],
  );
}

/**
 * Creates a gallery-media database record.
 * The file must already be uploaded through /api/admin/upload.
 */
export async function POST(
  request: NextRequest,
) {
  const auth =
    await getAuthenticatedClient();

  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body =
    (await request.json()) as CreateGalleryMediaInput;

  if (
    !Number.isInteger(body.year) ||
    !body.media_url ||
    !["image", "video"].includes(
      body.media_type,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Missing or invalid gallery fields",
      },
      { status: 400 },
    );
  }

  const { data, error } =
    await auth.supabase
      .from("gallery_media")
      .insert({
        year: body.year,
        media_type: body.media_type,
        media_url: body.media_url,
        thumbnail_url:
          body.thumbnail_url ?? null,
        alt_text: body.alt_text ?? null,
        display_order:
          body.display_order ?? 0,
        status:
          body.status ?? "draft",
      })
      .select(GALLERY_COLUMNS)
      .single();

  if (error) {
    console.error(
      "[POST /api/admin/gallery]",
      error.message,
    );

    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    data as GalleryMediaItem,
    { status: 201 },
  );
}

/**
 * Updates editable gallery fields.
 */
export async function PATCH(
  request: NextRequest,
) {
  const auth =
    await getAuthenticatedClient();

  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = (await request.json()) as {
    id?: number;
    year?: number;
    alt_text?: string | null;
    status?: GalleryMediaStatus;
    thumbnail_url?: string | null;
  };

  if (!body.id) {
    return NextResponse.json(
      { error: "Missing id" },
      { status: 400 },
    );
  }

  const { id, ...fields } = body;

  const allowedUpdates = {
    ...(fields.year !== undefined
      ? { year: fields.year }
      : {}),
    ...(fields.alt_text !== undefined
      ? { alt_text: fields.alt_text }
      : {}),
    ...(fields.status !== undefined
      ? { status: fields.status }
      : {}),
    ...(fields.thumbnail_url !== undefined
      ? {
          thumbnail_url:
            fields.thumbnail_url,
        }
      : {}),
    updated_at: new Date().toISOString(),
  };

  const { data, error } =
    await auth.supabase
      .from("gallery_media")
      .update(allowedUpdates)
      .eq("id", id)
      .select(GALLERY_COLUMNS)
      .single();

  if (error) {
    console.error(
      "[PATCH /api/admin/gallery]",
      error.message,
    );

    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    data as GalleryMediaItem,
  );
}

/**
 * Deletes the gallery database record and its storage files.
 */
export async function DELETE(
  request: NextRequest,
) {
  const auth =
    await getAuthenticatedClient();

  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const idValue = new URL(
    request.url,
  ).searchParams.get("id");

  const id = Number(idValue);

  if (
    !idValue ||
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return NextResponse.json(
      { error: "Missing or invalid id" },
      { status: 400 },
    );
  }

  const {
    data: mediaItem,
    error: readError,
  } = await auth.supabase
    .from("gallery_media")
    .select(
      "id, media_url, thumbnail_url",
    )
    .eq("id", id)
    .single();

  if (readError || !mediaItem) {
    return NextResponse.json(
      {
        error:
          readError?.message ??
          "Gallery item not found",
      },
      { status: 404 },
    );
  }

  const { error: deleteError } =
    await auth.supabase
      .from("gallery_media")
      .delete()
      .eq("id", id);

  if (deleteError) {
    console.error(
      "[DELETE /api/admin/gallery]",
      deleteError.message,
    );

    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 },
    );
  }

  const storagePaths = [
    getGalleryStoragePath(
      mediaItem.media_url,
    ),
    mediaItem.thumbnail_url
      ? getGalleryStoragePath(
          mediaItem.thumbnail_url,
        )
      : null,
  ].filter(
    (path): path is string =>
      Boolean(path),
  );

  if (storagePaths.length > 0) {
    const { error: storageError } =
      await auth.supabase.storage
        .from("images")
        .remove(storagePaths);

    if (storageError) {
      console.error(
        "[DELETE /api/admin/gallery storage]",
        storageError.message,
      );
    }
  }

  return NextResponse.json({
    success: true,
  });
}

function getGalleryStoragePath(
  url: string,
): string | null {
  const marker =
    "/storage/v1/object/public/images/";

  const markerIndex =
    url.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(
    url.slice(
      markerIndex + marker.length,
    ),
  );
}