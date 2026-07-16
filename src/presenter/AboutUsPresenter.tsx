'use client';

import useSWR from "swr";
import AboutUsView from '@/view/AboutUsView';
import type { PublicBoardMember } from "@/types/adminBoardMembers";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });


export default function AboutUsPresenter() {
  const { data, isLoading, error } = useSWR<PublicBoardMember[]>(
    "/api/about_us", fetcher);

  return (
    <AboutUsView 
    boardMembers={data ?? []} 
    isLoading={isLoading}
    error={error}
    />
  );
}

