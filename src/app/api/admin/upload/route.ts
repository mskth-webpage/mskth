import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

const ALLOWED_FOLDERS = [ "events", "gallery","board_members", "projects", "project_groups", ] as const;

const ALLOWED_IMAGE_TYPES = [ "image/jpeg", "image/png", "image/webp", "image/gif", ] as const;

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", ] as const;

const ALLOWED_MIME_TYPES: readonly string[] = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_VIDEO_TYPES,
];

const IMAGE_MAX_SIZE = 15 * 1024 * 1024;
const VIDEO_MAX_SIZE = 100 * 1024 * 1024;

function getSafeExtension(file: File): string {
  const originalExtension = file.name
    .split(".")
    .pop()
    ?.toLowerCase();

  if (
    originalExtension &&
    /^[a-z0-9]+$/.test(originalExtension)
  ) {
    return originalExtension;
  }

  const extensionByMimeType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
  };

  return extensionByMimeType[file.type] ?? "bin";
}

/**
 * Accepts an authenticated multipart upload and stores it
 * in the public `images` Supabase Storage bucket.
 */
export async function POST(req: NextRequest) {
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

  const form = await req.formData();

  const fileEntry = form.get("file");
  const folder =
    form.get("folder")?.toString() ?? "events"; // default events, but allows upload to other buckets as well
  if (!(fileEntry instanceof File)) {
    return NextResponse.json(
      { error: "No valid file provided" },
      { status: 400 },
    );
  }

  if (
    !ALLOWED_FOLDERS.includes(
      folder as (typeof ALLOWED_FOLDERS)[number],
    )
  ) {
    return NextResponse.json(
      { error: "Invalid upload destination" },
      { status: 400 },
    );
  }

  if (!ALLOWED_MIME_TYPES.includes(fileEntry.type)) {
    return NextResponse.json(
      {
        error: `File type ${fileEntry.type || "unknown"} is not supported`,
      },
      { status: 415 },
    );
  }

  const isVideo = fileEntry.type.startsWith("video/");
  const maxFileSize = isVideo
    ? VIDEO_MAX_SIZE
    : IMAGE_MAX_SIZE;

  if (fileEntry.size > maxFileSize) {
    return NextResponse.json(
      {
        error: isVideo
          ? "Video file is too large. Maximum size is 100 MB."
          : "Image file is too large. Maximum size is 15 MB.",
      },
      { status: 413 },
    );
  }

  const extension = getSafeExtension(fileEntry);

  const fileName = [
    Date.now(),
    crypto.randomUUID(),
  ].join("-");

  const path = `${folder}/${fileName}.${extension}`;

  const { error: uploadError } =
    await supabase.storage
      .from("images")
      .upload(path, fileEntry, {
        contentType: fileEntry.type,
        upsert: false,
        cacheControl: "3600",
      });

  if (uploadError) {
    console.error(
      "[POST /api/admin/upload]",
      uploadError.message,
    );

    return NextResponse.json(
      { error: uploadError.message },
      { status: 500 },
    );
  }

  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(path);

  return NextResponse.json(
    {
      url: data.publicUrl,
      path,
      mimeType: fileEntry.type,
      mediaType: isVideo ? "video" : "image",
    },
    { status: 201 },
  );
}