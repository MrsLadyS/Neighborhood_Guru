import { Shell } from "@/components/site/Shell";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { getPropertiesForSite } from "@/lib/get-properties";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Neighborhood Guru managed short-term, extended, and non-traditional rentals in South Florida.",
};

export default async function PropertiesPage() {
  const properties = await getPropertiesForSite();

  return (
    <Shell>
      <main className="flex-1">
        <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--brand-accent-dark)]">
              Listings
            </p>
            <h1 className="mt-2 font-display text-4xl tracking-tight text-[var(--brand-ink)] sm:text-5xl">
              Properties
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
              Curated stays and adventures are awaiting your arrival. Open any listing for full details.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          {properties.length === 0 && (
            <p className="text-[var(--muted)]">No properties are published yet. Check back soon.</p>
          )}
          {properties.length > 0 && (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {properties.map((p) => (
                <li key={p.id}>
                  <PropertyCard property={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </Shell>
  );
}
