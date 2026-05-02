"use client";

import { useTranslations } from "next-intl";
import { Users, Ticket, TicketX } from "lucide-react";
import StatCard from "@/components/admin/StatCard";

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
    <div className="space-y-8 p-6 lg:p-8">
      {/* Page header */}
      <h1 className="text-3xl font-bold tracking-tight">
        {t("welcome")}{" "}
        <span className="italic text-primary">
          {isLoading ? "..." : userName || "Admin"}
        </span>
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label={t("totalMembers")}
          value={totalMembers}
          isLoading={isLoading}
          icon={Users}
          iconClassName="text-primary"
          iconBgClassName="bg-primary/10"
        />
        <StatCard
          label={t("totalTicketsSold")}
          value={totalTicketsSold}
          isLoading={isLoading}
          icon={Ticket}
          iconClassName="text-emerald-500"
          iconBgClassName="bg-emerald-500/10"
        />
        <StatCard
          label={t("ticketOut")}
          value={ticketOut}
          isLoading={isLoading}
          icon={TicketX}
          iconClassName="text-orange-500"
          iconBgClassName="bg-orange-500/10"
        />
      </div>
    </div>
  );
}
