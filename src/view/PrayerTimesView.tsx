import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import PrayerDateNavigator from "@/components/PrayerDateNavigator";
import NextPrayerCountdown from "@/components/NextPrayerCountdown";
import { DISPLAYED_PRAYERS, type PrayerTimesData } from "@/types/prayerTimes";
import { shiftDate } from "@/lib/prayerTimes";

type Props = {
  date: string;
  todayDate: string;
  data: PrayerTimesData | null;
  nextDayData: PrayerTimesData | null;
};

/** Renders the localized prayer timetable, date controls, and today's live next-prayer countdown. */
export default async function PrayerTimesView({ date, todayDate, data, nextDayData }: Props) {
  const t = await getTranslations("PrayerTimes");
  const locale = await getLocale();
  const isToday = date === todayDate;

  return (
    <main className="mx-auto w-full max-w-[980px] px-5 pb-16 pt-8 sm:px-8 lg:pb-24 lg:pt-14">
      <section className="overflow-hidden rounded-4xl bg-primary px-6 py-10 text-primary-foreground shadow-sm sm:px-10 sm:py-14">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] opacity-80">{t("eyebrow")}</p>
          <h1 className="font-serif text-4xl font-semibold tracking-wide sm:text-5xl">{t("title")}</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 opacity-85 sm:text-base">{t("description")}</p>
          <div className="mt-6 flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {t("location")}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border bg-card p-5 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {isToday ? t("today") : t("selectedDate")}
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
              {new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`))}
            </h2>
            {data && <p className="mt-1 text-sm text-muted-foreground">{data.date.hijri.date} · {data.date.hijri.month.en} {data.date.hijri.year}</p>}
          </div>

          <PrayerDateNavigator
            key={date}
            date={date}
            todayDate={todayDate}
            previousDate={shiftDate(date, -1)}
            nextDate={shiftDate(date, 1)}
            labels={{
              chooseDate: t("chooseDate"),
              show: t("show"),
              loading: t("loading"),
              previousDay: t("previousDay"),
              nextDay: t("nextDay"),
              backToToday: t("backToToday"),
            }}
          />
        </div>

        {data ? (
          <>
            {isToday && nextDayData && (
              <NextPrayerCountdown
                date={date}
                timings={data.timings}
                nextDayFajr={nextDayData.timings.Fajr}
                labels={{
                  nextPrayer: t("nextPrayer"),
                  tomorrow: t("tomorrow"),
                  hourShort: t("hourShort"),
                  minuteShort: t("minuteShort"),
                  secondShort: t("secondShort"),
                  Fajr: t("prayers.Fajr"),
                  Dhuhr: t("prayers.Dhuhr"),
                  Asr: t("prayers.Asr"),
                  Maghrib: t("prayers.Maghrib"),
                  Isha: t("prayers.Isha"),
                }}
              />
            )}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {DISPLAYED_PRAYERS.map((prayer) => (
                <article key={prayer} className="rounded-2xl border bg-background p-4 text-center">
                  <Clock3 className="mx-auto h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-medium text-muted-foreground">{t(`prayers.${prayer}`)}</h3>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{data.timings[prayer].replace(/\s*\(.+\)$/, "")}</p>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-8 rounded-2xl bg-muted p-6 text-center">
            <p className="font-medium">{t("errorTitle")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("errorDescription")}</p>
          </div>
        )}

        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">{t("disclaimer")}</p>
      </section>
    </main>
  );
}
