export type ViewMode = "year" | "month" | "week" | "day";

export type CalendarEvent = {
  id: number;
  title: string;
  start_at: string;
  end_at: string | null;
  location: string | null;
  description: string | null;
  status: string | null;
  image_url: string | null;
  joined_count: number;
};
