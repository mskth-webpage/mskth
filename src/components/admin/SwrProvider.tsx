"use client";

import { SWRConfig } from "swr";

export default function SwrProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 300_000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
