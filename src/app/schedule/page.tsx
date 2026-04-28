import { Shell } from "@/components/site/Shell";
import { getPropertiesForSite } from "@/lib/get-properties";
import { SchedulingForm } from "./SchedulingForm";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Schedule a rental period | Neighborhood Guru",
  description:
    "Request your desired lease or stay dates. Neighborhood Guru Property Management will confirm availability.",
};

export default async function SchedulePage() {
  const properties = await getPropertiesForSite();
  const unavailableRanges: { property_id: string; requested_date: string; requested_end_date: string }[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_unavailable_ranges");
    if (error) {
      console.error("get_unavailable_ranges failed", error);
    } else {
      for (const row of (data ?? []) as {
        property_id: string | null;
        requested_date: string;
        requested_end_date: string | null;
      }[]) {
        if (row.property_id && row.requested_end_date) {
          unavailableRanges.push({
            property_id: row.property_id,
            requested_date: row.requested_date,
            requested_end_date: row.requested_end_date,
          });
        }
      }
    }
  }

  return (
    <Shell>
      <main className="flex-1">
        <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--brand-accent-dark)]">
              Tenants
            </p>
            <h1 className="mt-2 max-w-2xl font-display text-4xl tracking-tight text-[var(--brand-ink)] sm:text-5xl">
              Schedule your rental period
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
              Tell us which property you want, your requested start and end dates, and your approved tenant
              code. We will confirm availability and next steps.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <SchedulingForm properties={properties} unavailableRanges={unavailableRanges} />
        </div>
      </main>
    </Shell>
  );
}
