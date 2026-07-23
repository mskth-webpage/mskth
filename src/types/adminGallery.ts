export type GalleryMediaType = "image" | "video";

export type GalleryMediaStatus =
  | "draft" | "published";

export type GalleryMediaItem = {
  id: number;
  year: number;
  media_type: GalleryMediaType;
  media_url: string;
  thumbnail_url: string | null;
  alt_text: string | null;
  display_order: number;
  status: GalleryMediaStatus;
  created_at: string;
  updated_at: string;
};

export type CreateGalleryMediaInput = {
  year: number;
  media_type: GalleryMediaType;
  media_url: string;
  thumbnail_url?: string;
  alt_text?: string;
  display_order?: number;
  status?: GalleryMediaStatus;
};

export type ReorderGalleryMediaInput = {
  items: {
    id: number;
    display_order: number;
  }[];
};

export type GalleryYearGroup = {
  year: number;
  media: GalleryMediaItem[];
};