"use client";

import { useTranslations } from "next-intl";
import { Users, Ticket, TicketX } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import StatCardSkeleton from "@/components/admin/skeletons/StatCardSkeleton";

type Props = {
  userName: string;
  isLoading: boolean;
  totalMembers: number;
  totalTicketsSold: number;
  ticketOut: number;
};

export default function DashboardWelcomeView({
  userName,
  isLoading,
  totalMembers,
  totalTicketsSold,
  ticketOut,
}: Props) {
  const t = useTranslations("AdminDashboard");

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">
        {t("welcome")}{" "}
        {isLoading ? (
          <span className="inline-block h-8 w-48 animate-pulse rounded-md bg-muted align-middle" />
        ) : (
          <span className="italic text-primary">{userName || "Admin"}</span>
        )}
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label={t("totalMembers")}
              value={totalMembers}
              icon={Users}
              iconClassName="text-primary"
              iconBgClassName="bg-primary/10"
            />
            <StatCard
              label={t("totalTicketsSold")}
              value={totalTicketsSold}
              icon={Ticket}
              iconClassName="text-emerald-500"
              iconBgClassName="bg-emerald-500/10"
            />
            <StatCard
              label={t("ticketOut")}
              value={ticketOut}
              icon={TicketX}
              iconClassName="text-orange-500"
              iconBgClassName="bg-orange-500/10"
            />
          </>
        )}
      </div>
    </div>
  );
}
