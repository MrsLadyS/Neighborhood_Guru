import Link from "next/link";
import { Shell } from "@/components/site/Shell";

type Props = {
  searchParams: Promise<{ type?: string }>;
};

export default async function ScheduleNextStepPage({ searchParams }: Props) {
  const { type } = await searchParams;
  const isApprovedRate = type === "family";

  return (
    <Shell>
      <main className="flex-1">
        <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--brand-accent-dark)]">
              Next step
            </p>
            <h1 className="mt-2 max-w-2xl font-display text-4xl tracking-tight text-[var(--brand-ink)] sm:text-5xl">
              Request received
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
              {isApprovedRate
                ? "Your approved-rate request is confirmed. Continue to payment to finalize your booking details."
                : "Your schedule request was submitted successfully. Your tenant approval code will be reviewed and our team will follow up with next instructions."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={isApprovedRate ? "/pay" : "/properties"}
                className="inline-flex items-center justify-center rounded-full bg-[var(--brand-deep)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-deep)]/90"
              >
                {isApprovedRate ? "Continue to payment" : "View properties"}
              </Link>
              <Link
                href="/schedule"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-ink)] transition hover:border-[var(--brand-deep)]/30"
              >
                Submit another request
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Shell>
  );
}
