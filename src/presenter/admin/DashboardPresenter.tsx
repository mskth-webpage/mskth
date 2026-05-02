"use client";

import useSWR from "swr";

import { createClient } from "@/utils/supabase/client";
import DashboardPanelsView from "@/view/admin/dashboardPanelsView";
import DashboardWelcomeView from "@/view/admin/dashboardWelcomeView";
import type { AdminStats, EventsResponse } from "@/types/adminDashboard";
import type { User } from "@supabase/supabase-js";

const jsonFetcher = (url: string) => fetch(url).then((r) => r.json());
const userFetcher = async (): Promise<User | null> => {
  const { data } = await createClient().auth.getUser();
  return data.user;
};

const SWR_OPTS = { revalidateOnFocus: false, dedupingInterval: 300_000 } as const;

export default function DashboardPresenter() {
  const { data: user } = useSWR("auth/user", userFetcher, SWR_OPTS);
  const { data: stats, isLoading: statsLoading } = useSWR<AdminStats>("/api/admin/stats", jsonFetcher, SWR_OPTS);
  const { data: events, isLoading: eventsLoading } = useSWR<EventsResponse>("/api/admin/events", jsonFetcher, SWR_OPTS);

  const meta = user?.user_metadata ?? {};
  const userName = meta.full_name ?? meta.name ?? user?.email ?? "";

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <DashboardWelcomeView
        userName={userName}
        isLoading={statsLoading ?? true}
        totalMembers={stats?.totalMembers ?? 0}
        totalTicketsSold={stats?.totalTicketsSold ?? 0}
        ticketOut={stats?.ticketOut ?? 0}
      />
      <DashboardPanelsView
        upcoming={events?.upcoming ?? []}
        previous={events?.previous ?? []}
        isLoading={eventsLoading ?? true}
      />
    </div>
  );
}
