import Link from "next/link";
import { Shell } from "@/components/site/Shell";
import { PRODUCE_PRODUCTS } from "@/data/products";
import { MarketplaceClient } from "@/components/products/MarketplaceClient";

export const metadata = {
  title: "Products | Neighborhood Guru Property Management",
  description:
    "Shop seasonal property produce from Neighborhood Guru locations, including orchard fruit, maple syrup, and small-batch harvests.",
};

export default function ProductsPage() {
  return (
    <Shell>
      <main className="flex-1">
        <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--brand-accent-dark)]">
              Marketplace
            </p>
            <h1 className="mt-2 max-w-3xl font-display text-4xl tracking-tight text-[var(--brand-ink)] sm:text-5xl">
              Property produce market
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
              Seasonal harvests, orchard selections, and woodland products sourced from Neighborhood
              Guru properties.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <MarketplaceClient products={PRODUCE_PRODUCTS} />

          <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6">
            <h3 className="font-display text-2xl text-[var(--brand-ink)]">Place an order request</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Inventory changes with seasonality and weather. Submit a request and we will confirm
              availability.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/schedule"
                className="rounded-full bg-[var(--brand-deep)] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Request produce order
              </Link>
              <Link
                href="/portal"
                className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--brand-ink)]"
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
