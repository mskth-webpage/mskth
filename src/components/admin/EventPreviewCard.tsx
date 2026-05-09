import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

type Props = {
  title: string;
  startAt: string;
  location: string | null;
  joinedCount: number;
};

export default function EventPreviewCard({
  title,
  startAt,
  location,
  joinedCount,
}: Props) {
  const t = useTranslations("AdminDashboard");
  const locale = useLocale();

  const date = new Date(startAt);

  const formattedDate = date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3.5 transition-colors hover:bg-muted/50">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formattedDate}
          {location ? ` · ${location}` : ""}
        </p>
      </div>

      <div className="mx-6 shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
        {formattedTime}
      </div>

      <div className="shrink-0 text-right">
        <p className="text-xs text-muted-foreground">{t("joinedMembers")}</p>
        <p className="text-sm font-semibold text-foreground">{joinedCount}</p>
      </div>
    </div>
  );
}
