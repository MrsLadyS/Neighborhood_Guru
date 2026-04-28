import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface-2)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div>
          <Image
            src="/images/brand/logo-primary.png"
            alt="Neighborhood Guru Property Management"
            width={424}
            height={137}
            className="h-10 w-auto rounded-md border border-[var(--border)] bg-white px-2 py-1"
          />
          <p className="mt-1 text-sm text-[var(--muted)]">
            Short-term stays, extended rentals, and non-traditional rentals—leased and managed with
            intention.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Quick links
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/properties" className="text-[var(--brand-ink)] hover:underline">
                Properties
              </Link>
            </li>
            <li>
              <Link href="/schedule" className="text-[var(--brand-ink)] hover:underline">
                Schedule
              </Link>
            </li>
            <li>
              <Link href="/portal" className="text-[var(--brand-ink)] hover:underline">
                Tenant portal
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Contact
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Use the forms on this site or reach your property manager directly for urgent maintenance.
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--muted)]">
        © {new Date().getFullYear()} Neighborhood Guru Property Management. All rights reserved.
      </div>
    </footer>
  );
}
