import Image from "next/image";
import Link from "next/link";
import { TopNav } from "./TopNav";

export function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex items-center justify-between gap-4 md:min-w-0 md:shrink-0">
            <Link href="/" className="group min-w-0 flex items-center gap-3 leading-tight">
              <Image
                src="/images/brand/logo-primary.png"
                alt="Neighborhood Guru Property Management"
                width={424}
                height={137}
                className="h-11 w-auto rounded-md border border-[var(--border)] bg-white px-2 py-1"
                priority
              />
              <span className="min-w-0 flex flex-col">
                <span className="font-display text-xl tracking-tight text-[var(--brand-ink)] transition group-hover:text-[var(--brand-accent-dark)] sm:text-2xl">
                  Neighborhood Guru
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
                  Property Management
                </span>
              </span>
            </Link>
          </div>
          <div className="flex min-w-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-1 md:flex-1">
            <TopNav />
          </div>
        </div>
      </div>
    </header>
  );
}
