"use client";

import { useActionState, useEffect } from "react";
import { useState } from "react";
import { submitTenantRegistration, type TenantState } from "@/app/actions/tenants";
import { INCOME_RANGES } from "@/lib/constants";

const initial: TenantState | null = null;

export function TenantForm() {
  const [state, formAction, pending] = useActionState(submitTenantRegistration, initial);
  const [isMarinaGrande, setIsMarinaGrande] = useState(false);

  useEffect(() => {
    if (state?.ok) {
      document.getElementById("tenant-success")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [state]);

  if (state?.ok) {
    return (
      <div
        id="tenant-success"
        className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 p-8 text-center"
        role="status"
      >
        <p className="font-display text-2xl text-[var(--brand-ink)]">Application submitted</p>
        <p className="mt-3 text-[var(--muted)]">
          Thank you. Our team will review your registration and follow up with next steps.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      {state && !state.ok && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          {state.error}
        </div>
      )}

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6">
        <label className="inline-flex items-start gap-3 text-sm text-[var(--brand-ink)]">
          <input
            type="checkbox"
            name="is_marina_grande_interest"
            value="yes"
            checked={isMarinaGrande}
            onChange={(e) => setIsMarinaGrande(e.target.checked)}
            className="mt-0.5 accent-[var(--brand-deep)]"
          />
          <span>
            I am looking to rent the <strong>Marina Grande</strong> property.
          </span>
        </label>
        {isMarinaGrande && (
          <p className="mt-3 text-sm font-medium text-[var(--brand-ink)]">
            Marina Grande policy: pets are not permitted.
          </p>
        )}
        {isMarinaGrande && (
          <div
            className="mt-4 rounded-xl border border-[var(--border)] bg-white px-4 py-3"
            role="region"
            aria-label="Marina Grande screening and fee"
          >
            <h2 className="font-display text-lg text-[var(--brand-ink)]">
              Marina Grande: NTN screening & application fee
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Marina Grande applications include screening through{" "}
              <strong className="text-[var(--brand-ink)]">NTN</strong> (National Tenant Network) and a{" "}
              <strong className="text-[var(--brand-ink)]">$100</strong> non-refundable application fee
              when invited to proceed.
            </p>
          </div>
        )}
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Primary applicant
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="full_name" className="block text-sm font-medium text-[var(--brand-ink)]">
              Full legal name <span className="text-red-600">*</span>
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              autoComplete="name"
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--brand-ink)]">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[var(--brand-ink)]">
              Phone <span className="text-red-600">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
            />
          </div>
          <div>
            <label
              htmlFor="date_of_birth"
              className="block text-sm font-medium text-[var(--brand-ink)]"
            >
              Date of birth
            </label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Residence & income
        </h2>
        <div>
          <label
            htmlFor="current_address"
            className="block text-sm font-medium text-[var(--brand-ink)]"
          >
            Current address
          </label>
          <input
            id="current_address"
            name="current_address"
            type="text"
            autoComplete="street-address"
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="employer" className="block text-sm font-medium text-[var(--brand-ink)]">
              Employer / school
            </label>
            <input
              id="employer"
              name="employer"
              type="text"
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
            />
          </div>
          <div>
            <label
              htmlFor="monthly_income_range"
              className="block text-sm font-medium text-[var(--brand-ink)]"
            >
              Household monthly income (range)
            </label>
            <select
              id="monthly_income_range"
              name="monthly_income_range"
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
            >
              {INCOME_RANGES.map((r) => (
                <option key={r.value || "empty"} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="desired_move_in"
              className="block text-sm font-medium text-[var(--brand-ink)]"
            >
              Desired move-in date
            </label>
            <input
              id="desired_move_in"
              name="desired_move_in"
              type="date"
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
            />
          </div>
          <div>
            <label
              htmlFor="property_interest"
              className="block text-sm font-medium text-[var(--brand-ink)]"
            >
              Property or unit of interest
            </label>
            <input
              id="property_interest"
              name="property_interest"
              type="text"
              placeholder="Address, listing ID, or neighborhood"
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Household
        </h2>
        <div>
          <label htmlFor="occupants_count" className="block text-sm font-medium text-[var(--brand-ink)]">
            Number of occupants
          </label>
          <input
            id="occupants_count"
            name="occupants_count"
            type="number"
            min={1}
            step={1}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Emergency contact
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="emergency_contact_name"
              className="block text-sm font-medium text-[var(--brand-ink)]"
            >
              Name
            </label>
            <input
              id="emergency_contact_name"
              name="emergency_contact_name"
              type="text"
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
            />
          </div>
          <div>
            <label
              htmlFor="emergency_contact_phone"
              className="block text-sm font-medium text-[var(--brand-ink)]"
            >
              Phone
            </label>
            <input
              id="emergency_contact_phone"
              name="emergency_contact_phone"
              type="tel"
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="additional_notes"
            className="block text-sm font-medium text-[var(--brand-ink)]"
          >
            Additional notes
          </label>
          <textarea
            id="additional_notes"
            name="additional_notes"
            rows={4}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
          />
        </div>
      </section>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--brand-deep)] py-3.5 text-sm font-semibold text-white shadow-sm transition enabled:hover:bg-[var(--brand-deep)]/90 disabled:cursor-wait disabled:opacity-80"
      >
        {pending ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
