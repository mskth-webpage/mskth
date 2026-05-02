"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";
import DashboardWelcomeView from "@/view/admin/dashboardWelcomeView";
import DashboardCalendarView from "@/view/admin/dashboardCalendarView";
import DashboardEventsView from "@/view/admin/dashboardEventsView";
import type { EventPreview, EventsResponse } from "@/app/api/admin/events/route";

type Stats = {
  totalMembers: number;
  totalTicketsSold: number;
  ticketOut: number;
};

export default function DashboardPresenter() {
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0,
    totalTicketsSold: 0,
    ticketOut: 0,
  });
  const [upcoming, setUpcoming] = useState<EventPreview[]>([]);
  const [previous, setPrevious] = useState<EventPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const [{ data }, statsRes, eventsRes] = await Promise.all([
        supabase.auth.getUser(),
        fetch("/api/admin/stats"),
        fetch("/api/admin/events"),
      ]);

      if (data.user) {
        const meta = data.user.user_metadata ?? {};
        setUserName(meta.full_name ?? meta.name ?? data.user.email ?? "");
      }

      if (statsRes.ok) {
        const json = (await statsRes.json()) as Stats;
        setStats(json);
      }

      if (eventsRes.ok) {
        const json = (await eventsRes.json()) as EventsResponse;
        setUpcoming(json.upcoming);
        setPrevious(json.previous);
      }

      setIsLoading(false);
    }

    void load();
  }, []);

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <DashboardWelcomeView
        userName={userName}
        isLoading={isLoading}
        totalMembers={stats.totalMembers}
        totalTicketsSold={stats.totalTicketsSold}
        ticketOut={stats.ticketOut}
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <DashboardCalendarView />
        <DashboardEventsView
          upcoming={upcoming}
          previous={previous}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
