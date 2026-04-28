import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/site/Shell";
import { getPropertyBySlug } from "@/lib/get-properties";
import { normalizeGalleryUrls } from "@/lib/properties";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const row = await getPropertyBySlug(slug);
  if (!row) return { title: "Property" };
  const title = row.unit_label ? `${row.name} (${row.unit_label})` : row.name;
  return {
    title,
    description: `${title} — Riviera Beach furnished rental managed by Neighborhood Guru.`,
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const raw = await getPropertyBySlug(slug);
  if (!raw) notFound();

  const gallery =
    normalizeGalleryUrls(raw.gallery_urls).length > 0
      ? normalizeGalleryUrls(raw.gallery_urls)
      : raw.image_url
        ? [raw.image_url]
        : [];

  const paragraphs =
    raw.description?.split(/\n\n+/).map((s) => s.trim()).filter(Boolean) ?? [];
  const floorPlanImage =
    raw.slug === "marina-grande-marina-tower-2406"
      ? "/images/properties/marina-grande-marina-tower-2406/floor-plan-stack-06.jpg"
      : null;

  return (
    <Shell>
      <main className="flex-1">
        <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <p>
              <Link
                href="/properties"
                className="text-sm font-medium text-[var(--brand-deep)] hover:underline"
              >
                ← All properties
              </Link>
            </p>
            <h1 className="mt-4 font-display text-4xl tracking-tight text-[var(--brand-ink)] sm:text-5xl">
              {raw.name}
            </h1>
            {raw.unit_label && (
              <p className="mt-2 text-lg text-[var(--brand-accent-dark)]">{raw.unit_label}</p>
            )}
            <p className="mt-3 text-[var(--muted)]">
              {[raw.address_line, raw.city, raw.region, raw.postal_code].filter(Boolean).join(", ")}
            </p>
            {raw.bedrooms != null && (
              <p className="mt-2 text-sm text-[var(--brand-ink)]/90">
                {raw.bedrooms} bed · {raw.bathrooms != null ? `${raw.bathrooms} bath` : "—"}
                {raw.monthly_rent_cents != null
                  ? ` · from $${(raw.monthly_rent_cents / 100).toLocaleString()}/mo`
                  : " · inquire for rates"}
              </p>
            )}
          </div>
        </div>

        {gallery.length > 0 && (
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <p className="text-xs text-[var(--muted)]">
              Curated stays and adventures are awaiting your arrival. Open any listing for full details.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {gallery.map((src, i) => (
                <li
                  key={`${i}-${src}`}
                  className={`relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] ${
                    i === 0 ? "sm:col-span-2 aspect-[21/9]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${raw.name} — gallery ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 1200px"
                    priority={i === 0}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {(floorPlanImage || raw.floor_plan_url) && (
          <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-display text-2xl tracking-tight text-[var(--brand-ink)]">
                  Floor map
                </h2>
                {raw.floor_plan_url && (
                  <a
                    href={raw.floor_plan_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2 text-sm font-semibold text-[var(--brand-ink)] transition hover:border-[var(--brand-deep)]/30"
                  >
                    Open full floor plan
                  </a>
                )}
              </div>
              {floorPlanImage && (
                <div className="relative mt-5 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
                  <Image
                    src={floorPlanImage}
                    alt={`${raw.name} floor map`}
                    width={1280}
                    height={905}
                    className="h-auto w-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="max-w-none space-y-4 text-[var(--muted)]">
            {paragraphs.map((block, idx) => (
              <p key={idx} className="leading-relaxed">
                {block}
              </p>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/register"
              className="inline-flex w-full max-w-md items-center justify-center rounded-full border border-[var(--border)] bg-white py-3.5 text-center text-sm font-semibold text-[var(--brand-ink)] transition hover:border-[var(--brand-deep)]/30 sm:w-auto"
            >
              Tenant application
            </Link>
          </div>
        </div>
      </main>
    </Shell>
  );
}
