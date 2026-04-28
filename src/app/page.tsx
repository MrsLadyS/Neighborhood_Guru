import Link from "next/link";
import { Shell } from "@/components/site/Shell";

const cards = [
  {
    title: "Apply to rent",
    body: "Tell us about your stay—short-term, extended, or non-traditional—and we will align options that fit.",
    href: "/register",
    cta: "Start application",
  },
  {
    title: "Properties",
    body: "Browse current listings with photos, details, and full descriptions.",
    href: "/properties",
    cta: "View properties",
  },
];

export default function Home() {
  return (
    <Shell>
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-[var(--border)]">
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,var(--hero-glow),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-[var(--brand-accent-dark)]">
              Neighborhood Guru Property Management
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight text-[var(--brand-ink)] sm:text-6xl md:text-7xl">
              Stays curated with intention.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
              Short-term stays, extended rentals, and non-traditional rentals—managed with care,
              clear communication, and attention from first inquiry through move-in.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center rounded-full bg-[var(--brand-deep)] px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--brand-deep)]/90"
              >
                View properties
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-8 py-3.5 text-sm font-semibold text-[var(--brand-ink)] transition hover:border-[var(--brand-deep)]/30 hover:bg-white"
              >
                Tenant application
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl tracking-tight text-[var(--brand-ink)] sm:text-4xl">
              Everything in one place
            </h2>
            <p className="mt-3 text-lg text-[var(--muted)]">
              View listings and submit your application—without hunting through email threads.
            </p>
          </div>
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {cards.map((c) => (
              <li
                key={c.title}
                className="flex flex-col rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm transition hover:border-[var(--brand-deep)]/15 hover:shadow-md"
              >
                <h3 className="font-display text-xl text-[var(--brand-ink)]">{c.title}</h3>
                <p className="mt-3 flex-1 text-[var(--muted)]">{c.body}</p>
                <Link
                  href={c.href}
                  className="mt-6 inline-flex text-sm font-semibold text-[var(--brand-accent-dark)] hover:underline"
                >
                  {c.cta} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-[var(--border)] bg-[var(--surface-2)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--brand-deep)] to-[#152238] p-10 text-center text-white sm:p-14">
              <p className="font-display text-2xl sm:text-3xl">Explore available stays</p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                Browse photos, descriptions, and details for each Neighborhood Guru listing.
              </p>
              <Link
                href="/properties"
                className="mt-8 inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[var(--brand-deep)] shadow-sm transition hover:bg-white/95"
              >
                View properties
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Shell>
  );
}
