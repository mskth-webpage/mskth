"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import AboutHeader from "@/components/AboutHeader";
import MosqueListItem from "@/components/MosqueListItem";
import type { Mosque } from "@/types/mosque";

const MosqueMap = dynamic(() => import("@/components/MosqueMap"), { ssr: false });

const MOSQUES = [
  { name: "Stockholm Mosque",        highlight: "closeToMainCampus", metroStation: "Medborgarplatsen", imageUrl: "/stockholm-moske.jpg" },
  { name: "Islamic Cultural Center", highlight: "closeToMainCampus", metroStation: "Medborgarplatsen" },
  { name: "Al-Nour Mosque",          highlight: "cityCenter",        metroStation: "T-Centralen" },
  { name: "Bosnian Islamic Center",  highlight: "cityCenter",        metroStation: "Zinkensdamm" },
  { name: "Al-Rahma Mosque",         highlight: "southern",          metroStation: "Gullmarsplan" },
  { name: "Husby Mosque",            highlight: "northern",          metroStation: "Husby" },
  { name: "Rinkeby Mosque",          highlight: "northern",          metroStation: "Rinkeby" },
  { name: "Tensta Mosque",           highlight: "northern",          metroStation: "Tensta" },
  { name: "Kista Islamic Center",    highlight: "northern",          metroStation: "Kista" },
  { name: "Fittja Mosque",           highlight: "southern",          metroStation: "Fittja",          imageUrl: "/fittja-moske.jpg" },
  { name: "Alby Mosque",             highlight: "southern",          metroStation: "Alby" },
  { name: "Skärholmen Mosque",       highlight: "southern",          metroStation: "Skärholmen" },
  { name: "Flemingsberg Mosque",     highlight: "southern",          metroStation: "Flemingsberg" },
];

type Props = {
  mapMarkers: Pick<Mosque, "id" | "name" | "latitude" | "longitude">[];
};

/** Renders the static mosque list and the interactive map with markers from the database. */
export default function MosquesView({ mapMarkers }: Props) {
  const t = useTranslations("Mosques");

  return (
    <>
      <main className="mx-auto max-w-[980px] px-5 pb-20 pt-10 sm:px-8 lg:pb-28 lg:pt-16">
        <AboutHeader title={t("title")} description={t("description")} />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
          {MOSQUES.map((mosque) => (
            <MosqueListItem
              key={mosque.name}
              name={mosque.name}
              highlight={t(`highlights.${mosque.highlight}`)}
              metroStation={mosque.metroStation}
              metroStationLabel={t("metroStationLabel")}
              imageUrl={mosque.imageUrl}
            />
          ))}
        </div>
      </main>

      <section className="mx-auto max-w-[980px] px-5 pb-24 sm:px-8 text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-wide uppercase text-foreground mb-3">
          {t("mapTitle")}
        </h2>
        <p className="font-serif text-base text-muted-foreground mb-8">
          {t("mapDescription")}
        </p>
        <div className="w-full overflow-hidden rounded-lg border border-border">
          <MosqueMap mosques={mapMarkers} />
        </div>
      </section>
    </>
  );
}
