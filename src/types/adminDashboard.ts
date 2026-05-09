export type AdminStats = {
  totalMembers: number;
  totalTicketsSold: number;
  ticketOut: number;
};

export type EventPreview = {
  id: number;
  title: string;
  start_at: string;
  location: string | null;
  joined_count: number;
};

export type EventsResponse = {
  upcoming: EventPreview[];
  previous: EventPreview[];
};
