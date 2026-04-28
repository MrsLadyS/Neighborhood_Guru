import { Shell } from "@/components/site/Shell";
import { TenantForm } from "./TenantForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenant application | Neighborhood Guru",
  description:
    "Rental registration for Neighborhood Guru properties and availability review.",
};

export default function RegisterPage() {
  return (
    <Shell>
      <main className="flex-1">
        <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--brand-accent-dark)]">
              Leasing
            </p>
            <h1 className="mt-2 max-w-2xl font-display text-4xl tracking-tight text-[var(--brand-ink)] sm:text-5xl">
              Registration
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
              Start here for rental registration and pre-qualification. Share your details and property
              interest, and our team will follow up with the next steps for your selected listing.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <TenantForm />
        </div>
      </main>
    </Shell>
  );
}
