export type Audience = "all" | "brothers" | "sisters";
export type Language = "en" | "sv" | "both";

export type AdminEvent = {
  id: number;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string | null;
  location: string | null;
  status: "draft" | "published" | null;
  image_url: string | null;
  joined_count: number;
  max_participants: number | null;
  audience: Audience | null;
  language: Language | null;
};

export type CreateEventInput = {
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  image_url?: string;
  location?: string;
  max_participants?: number;
  audience?: Audience;
  language?: Language;
};
