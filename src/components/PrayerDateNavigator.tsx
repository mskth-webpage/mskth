"use client";

import { FormEvent, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

type Props = {
  date: string;
  todayDate: string;
  previousDate: string;
  nextDate: string;
  labels: {
    chooseDate: string;
    show: string;
    loading: string;
    previousDay: string;
    nextDay: string;
    backToToday: string;
  };
};

/** Date controls for the prayer-times page with client-side navigation and a shortcut back to today. */
export default function PrayerDateNavigator({ date, todayDate, previousDate, nextDate, labels }: Props) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(date);
  const [isPending, startTransition] = useTransition();

  function navigate(nextDateValue: string) {
    setSelectedDate(nextDateValue);
    startTransition(() => {
      router.push({ pathname: "/prayer-times", query: { date: nextDateValue } });
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedDate) navigate(selectedDate);
  }

  return (
    <form className="flex flex-wrap items-center gap-2" onSubmit={handleSubmit}>
      {date !== todayDate && (
        <button
          type="button"
          onClick={() => navigate(todayDate)}
          disabled={isPending}
          className="h-10 rounded-full border border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
        >
          {labels.backToToday}
        </button>
      )}
      <button
        type="button"
        onClick={() => navigate(previousDate)}
        aria-label={labels.previousDay}
        disabled={isPending}
        className="grid h-10 w-10 place-items-center rounded-full border bg-background transition-colors hover:bg-muted disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <input
        name="date"
        type="date"
        value={selectedDate}
        onChange={(event) => setSelectedDate(event.target.value)}
        aria-label={labels.chooseDate}
        className="h-10 rounded-full border bg-background px-4 text-sm"
      />
      <button
        type="submit"
        disabled={isPending || !selectedDate}
        className="h-10 min-w-16 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? labels.loading : labels.show}
      </button>
      <button
        type="button"
        onClick={() => navigate(nextDate)}
        aria-label={labels.nextDay}
        disabled={isPending}
        className="grid h-10 w-10 place-items-center rounded-full border bg-background transition-colors hover:bg-muted disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </form>
  );
}
