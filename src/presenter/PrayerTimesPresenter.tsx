import PrayerTimesView from "@/view/PrayerTimesView";
import {
  fetchPrayerTimes,
  shiftDate,
  stockholmDate,
  validDate,
} from "@/lib/prayerTimes";

type Props = { searchParams: Promise<{ date?: string }> };

/** Fetches the selected prayer timetable and tomorrow's Fajr before rendering the prayer-times view. */
export default async function PrayerTimesPresenter({ searchParams }: Props) {
  const todayDate = stockholmDate();
  const date = validDate((await searchParams).date);
  const isToday = date === todayDate;
  const [data, nextDayData] = await Promise.all([
    fetchPrayerTimes(date),
    isToday ? fetchPrayerTimes(shiftDate(date, 1)) : Promise.resolve(null),
  ]);

  return (
    <PrayerTimesView
      date={date}
      todayDate={todayDate}
      data={data}
      nextDayData={nextDayData}
    />
  );
}
