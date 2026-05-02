"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";
import DashboardWelcomeView from "@/view/admin/dashboardWelcomeView";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const [{ data }, statsRes] = await Promise.all([
        supabase.auth.getUser(),
        fetch("/api/admin/stats"),
      ]);

      if (data.user) {
        const meta = data.user.user_metadata ?? {};
        setUserName(meta.full_name ?? meta.name ?? data.user.email ?? "");
      }

      if (statsRes.ok) {
        const json = (await statsRes.json()) as Stats;
        setStats(json);
      }

      setIsLoading(false);
    }

    void load();
  }, []);

  return (
    <DashboardWelcomeView
      userName={userName}
      isLoading={isLoading}
      totalMembers={stats.totalMembers}
      totalTicketsSold={stats.totalTicketsSold}
      ticketOut={stats.ticketOut}
    />
  );
}
