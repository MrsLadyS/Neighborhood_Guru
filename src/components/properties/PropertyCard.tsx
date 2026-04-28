import Image from "next/image";
import Link from "next/link";
import { normalizeGalleryUrls } from "@/lib/properties";
import { pricingSummaryForSlug } from "@/lib/pricing";
import type { Property } from "@/types/database";

type Props = { property: Property };

export function PropertyCard({ property: p }: Props) {
  const fallback = normalizeGalleryUrls(p.gallery_urls)[0];
  const preview = p.image_url ?? fallback ?? null;
  const pricingSummary = p.pricing_summary ?? pricingSummaryForSlug(p.slug);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition hover:border-[var(--brand-deep)]/20 hover:shadow-md">
      <Link href={`/properties/${p.slug}`} className="relative aspect-[16/10] bg-[var(--surface-2)]">
        {preview ? (
          <Image
            src={preview}
            alt={`${p.name}${p.unit_label ? ` — ${p.unit_label}` : ""} — preview`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
            No photo
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-display text-xl text-[var(--brand-ink)]">
          <Link href={`/properties/${p.slug}`} className="hover:underline">
            {p.name}
          </Link>
        </h2>
        {p.unit_label && <p className="mt-1 text-sm text-[var(--brand-accent-dark)]">{p.unit_label}</p>}
        <p className="mt-2 text-sm text-[var(--muted)]">
          {[p.address_line, p.city, p.region, p.postal_code].filter(Boolean).join(", ")}
        </p>
        {p.bedrooms != null && (
          <p className="mt-2 text-sm text-[var(--brand-ink)]/80">
            {p.bedrooms} bed · {p.bathrooms != null ? `${p.bathrooms} bath` : "—"}
            {p.monthly_rent_cents != null
              ? ` · from $${(p.monthly_rent_cents / 100).toLocaleString()}/mo`
              : ""}
          </p>
        )}
        {pricingSummary && (
          <p className="mt-2 text-sm text-[var(--brand-accent-dark)]">{pricingSummary}</p>
        )}
        <Link
          href={`/properties/${p.slug}`}
          className="mt-4 inline-flex text-sm font-semibold text-[var(--brand-accent-dark)] hover:underline"
        >
          View details →
        </Link>
      </div>
    </article>
  );
}
