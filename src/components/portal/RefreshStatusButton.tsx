"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RefreshStatusButton() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        setRefreshing(true);
        router.refresh();
        setTimeout(() => setRefreshing(false), 600);
      }}
      className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--brand-ink)] hover:bg-[var(--surface-2)]"
    >
      {refreshing ? "Refreshing..." : "Refresh status"}
    </button>
  );
}
