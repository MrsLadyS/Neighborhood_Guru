"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/properties", label: "Properties" },
  { href: "/schedule", label: "Schedule" },
  { href: "/portal", label: "Tenant portal" },
] as const;

function linkActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/properties") return pathname === "/properties" || pathname.startsWith("/properties/");
  if (href === "/portal") return pathname === "/portal" || pathname.startsWith("/portal/");
  if (href === "/schedule") return pathname === "/schedule" || pathname.startsWith("/schedule/");
  return pathname === href;
}

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex w-full flex-wrap items-center gap-1 sm:w-auto sm:justify-end"
      aria-label="Main"
    >
      {items.map((item) => {
        const active = linkActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-t-md border-b-2 px-3 py-2.5 text-sm font-medium transition sm:px-4 sm:py-2 ${
              active
                ? "border-[var(--brand-deep)] text-[var(--brand-deep)]"
                : "border-transparent text-[var(--brand-ink)]/80 hover:border-[var(--border)] hover:bg-[var(--brand-deep)]/5 hover:text-[var(--brand-deep)]"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
