"use client";

import { useLocale } from "next-intl";

type Props = {
  date: Date;
};

export default function CurrentMonthBadge({ date }: Props) {
  const locale = useLocale();

  const label = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);

  return (
    <span className="inline-flex items-center rounded-full border border-blue-200/70 bg-card px-4 py-1.5 text-xs font-semibold capitalize tracking-wide text-foreground shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_4px_16px_rgba(59,130,246,0.1)]">
      {label}
    </span>
  );
}