"use client";

import useSWR from "swr";
import MosquesView from "@/view/MosquesView";
import type { Mosque } from "@/types/mosque";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("fetch failed");
    return r.json();
  });

export default function MosquesPresenter() {
  const { data: mapMarkers = [] } = useSWR<Pick<Mosque, "id" | "name" | "latitude" | "longitude">[]>(
    "/api/mosques",
    fetcher
  );

  return <MosquesView mapMarkers={mapMarkers} />;
}
