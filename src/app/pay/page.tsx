import Link from "next/link";
import { Shell } from "@/components/site/Shell";
import { getPropertiesForSite } from "@/lib/get-properties";

type Props = {
  searchParams: Promise<{
    propertyId?: string;
    start?: string;
    end?: string;
    codeType?: string;
    stayType?: string;
    groupSize?: string;
  }>;
};

function diffDays(startIso: string, endIso: string): number {
  const start = new Date(startIso + "T12:00:00");
  const end = new Date(endIso + "T12:00:00");
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}

function formatUsd(cents: number): string {
  return `$${(cents / 100).toLocaleString()}`;
}

export default async function PaymentPage({ searchParams }: Props) {
  const params = await searchParams;
  const properties = await getPropertiesForSite();
  const property = properties.find((p) => p.id === params.propertyId) ?? null;
  const start = params.start ?? "";
  const end = params.end ?? "";
  const stayType = params.stayType ?? "";
  const codeType = params.codeType ?? "tenant";
  const groupSize = Math.max(1, Number.parseInt(params.groupSize ?? "1", 10) || 1);

  const nights = start && end ? Math.max(1, diffDays(start, end)) : 1;
  const dayPassDays = start && end ? Math.max(1, diffDays(start, end) + 1) : 1;
  const months = Math.max(1, Math.ceil(nights / 30));

  const isMarina = property?.slug === "marina-grande-marina-tower-2406";
  const isThirtyAcreField = property?.slug === "catskills-orchard-vineyard-30-acres";
  const isFiftyAcreWoodland = property?.slug === "catskills-woodland-camping-50-acres";
  const isFamilyCode = codeType === "family";

  const lineItems: { label: string; amountCents: number }[] = [];
  let instructions =
    "If you have not yet received a direct payment link, contact Neighborhood Guru for payment setup.";

  if (isMarina && isFamilyCode) {
    lineItems.push({
      label: `Marina Grande stay charge (${nights} night${nights > 1 ? "s" : ""})`,
      amountCents: nights * 10000,
    });
    instructions = "Complete payment using your provided checkout method.";
  } else if (isMarina) {
    lineItems.push({
      label: `Marina Grande monthly rate (${months} month${months > 1 ? "s" : ""} x $12,000)`,
      amountCents: months * 1200000,
    });
    instructions = "General Marina Grande pricing is billed monthly at $12,000 per month.";
  } else if (isThirtyAcreField) {
    const basePerDay = 20000;
    const extraHeadcount = Math.max(0, groupSize - 15);
    const base = dayPassDays * basePerDay;
    const surcharge = dayPassDays * extraHeadcount * 1000;
    lineItems.push({
      label: `30-acre day pass (${dayPassDays} day${dayPassDays > 1 ? "s" : ""} x $200, up to 15 people/day)`,
      amountCents: base,
    });
    lineItems.push({
      label: `Additional attendees (${extraHeadcount} extra x $10 x ${dayPassDays} day${dayPassDays > 1 ? "s" : ""})`,
      amountCents: surcharge,
    });
    instructions =
      "Liability insurance is required and must be made out to NeighborhoodGuru LLC, PO box 80, Greenfield Park, NY, 12435.";
  } else if (isFiftyAcreWoodland) {
    if (stayType === "monthly") {
      lineItems.push({
        label: `50-acre woodland monthly rate (${months} month${months > 1 ? "s" : ""} x $5,500)`,
        amountCents: months * 550000,
      });
      instructions = "50-acre woodland monthly stays are billed at $5,500 per month.";
    } else if (stayType === "nightly") {
      lineItems.push({
        label: `50-acre woodland overnight rate (${nights} night${nights > 1 ? "s" : ""} x $250)`,
        amountCents: nights * 25000,
      });
      instructions = "50-acre woodland overnight stays are billed at $250 per night.";
    } else if (stayType === "day-pass") {
      const basePerDay = 20000;
      const extraHeadcount = Math.max(0, groupSize - 15);
      const base = dayPassDays * basePerDay;
      const surcharge = dayPassDays * extraHeadcount * 1000;
      lineItems.push({
        label: `50-acre woodland day pass (${dayPassDays} day${dayPassDays > 1 ? "s" : ""} x $200, up to 15 people/day)`,
        amountCents: base,
      });
      lineItems.push({
        label: `Additional attendees (${extraHeadcount} extra x $10 x ${dayPassDays} day${dayPassDays > 1 ? "s" : ""})`,
        amountCents: surcharge,
      });
      instructions =
        "Liability insurance is required and must be made out to NeighborhoodGuru LLC, PO box 80, Greenfield Park, NY, 12435.";
    } else {
      lineItems.push({ label: "50-acre woodland custom stay pricing", amountCents: 0 });
      instructions = "Select a supported stay type to calculate your woodland invoice.";
    }
  } else {
    lineItems.push({ label: "Custom stay pricing", amountCents: 0 });
    instructions = "This property uses custom pricing. Neighborhood Guru will provide your final invoice instructions.";
  }

  const totalCents = lineItems.reduce((sum, item) => sum + item.amountCents, 0);

  return (
    <Shell>
      <main className="flex-1">
        <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--brand-accent-dark)]">
              Checkout
            </p>
            <h1 className="mt-2 max-w-2xl font-display text-4xl tracking-tight text-[var(--brand-ink)] sm:text-5xl">
              Checkout invoice and instructions
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
              {property
                ? `Requested property: ${property.name}`
                : "We could not identify your property from the schedule request."}
            </p>
            <div className="mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-white p-6">
              <p className="text-sm text-[var(--muted)]">
                Stay type: <span className="font-medium text-[var(--brand-ink)]">{stayType || "Not provided"}</span>
                {start && end && (
                  <>
                    {" "}
                    · Dates: <span className="font-medium text-[var(--brand-ink)]">{start}</span> to{" "}
                    <span className="font-medium text-[var(--brand-ink)]">{end}</span>
                  </>
                )}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                People in party: <span className="font-medium text-[var(--brand-ink)]">{groupSize}</span>
              </p>
              <ul className="mt-4 space-y-2">
                {lineItems.map((item) => (
                  <li key={item.label} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[var(--muted)]">{item.label}</span>
                    <span className="font-semibold text-[var(--brand-ink)]">{formatUsd(item.amountCents)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-[var(--border)] pt-4 text-base font-semibold text-[var(--brand-ink)]">
                Total due: {formatUsd(totalCents)}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{instructions}</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/schedule"
                className="inline-flex items-center justify-center rounded-full bg-[var(--brand-deep)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-deep)]/90"
              >
                Back to schedule
              </Link>
              <Link
                href="/portal"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-ink)] transition hover:border-[var(--brand-deep)]/30"
              >
                Tenant portal
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Shell>
  );
}
