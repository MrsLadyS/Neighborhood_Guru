"use client";

import { useActionState, useMemo, useState } from "react";
import { submitScheduleRequest, type ScheduleState } from "@/app/actions/scheduling";
import { BookingCalendar, toISODateLocal } from "@/components/booking/BookingCalendar";
import { RENTAL_CONTACT_SLOTS } from "@/lib/constants";
import type { Property } from "@/types/database";

const initial: ScheduleState | null = null;

type Props = {
  properties: Property[];
  unavailableRanges: { property_id: string; requested_date: string; requested_end_date: string }[];
};

function formatLong(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function enumerateDates(startIso: string, endIso: string): string[] {
  const dates: string[] = [];
  const cursor = new Date(startIso + "T12:00:00");
  const end = new Date(endIso + "T12:00:00");
  while (cursor <= end) {
    dates.push(toISODateLocal(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export function SchedulingForm({ properties, unavailableRanges }: Props) {
  const [state, formAction, pending] = useActionState(submitScheduleRequest, initial);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [approvalCode, setApprovalCode] = useState("");
  const [propertyId, setPropertyId] = useState("");

  const today = toISODateLocal(new Date());
  const endMin = startDate || today;

  const blockedDates = useMemo(() => {
    if (!propertyId) return [];
    return unavailableRanges
      .filter((r) => r.property_id === propertyId)
      .flatMap((r) => enumerateDates(r.requested_date, r.requested_end_date));
  }, [propertyId, unavailableRanges]);

  const canSubmit = !!(propertyId && startDate && endDate && approvalCode.trim()) && !pending;

  return (
    <form action={formAction} className="space-y-10">
      {state && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          {state.error}
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Property
        </h2>
        <label htmlFor="property_id" className="sr-only">
          Choose a property
        </label>
        <select
          id="property_id"
          name="property_id"
          required
          value={propertyId}
          onChange={(e) => {
            const nextPropertyId = e.target.value;
            const nextBlockedDates = !nextPropertyId
              ? []
              : unavailableRanges
                  .filter((r) => r.property_id === nextPropertyId)
                  .flatMap((r) => enumerateDates(r.requested_date, r.requested_end_date));
            setPropertyId(nextPropertyId);
            if (startDate && nextBlockedDates.includes(startDate)) {
              setStartDate("");
            }
            if (endDate && nextBlockedDates.includes(endDate)) {
              setEndDate("");
            }
          }}
          className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3.5 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
        >
          {properties.length === 0 ? (
            <option value="">Any property — we will match you to availability</option>
          ) : (
            <>
              <option value="">Select a property (required)…</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.unit_label ? `${p.name} — ${p.unit_label}` : p.name}
                  {p.city ? ` — ${p.city}` : ""}
                </option>
              ))}
            </>
          )}
        </select>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Requested rental period
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Pick the start and end dates for the period you are requesting.
        </p>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-3">
            <p className="text-sm font-medium text-[var(--brand-ink)]">Start date</p>
            <BookingCalendar
              selectedDate={startDate}
              onSelectDate={(nextStartDate) => {
                setStartDate(nextStartDate);
                if (endDate && endDate < nextStartDate) {
                  setEndDate("");
                }
              }}
              minDate={today}
              unavailableDates={blockedDates}
            />
            <input type="hidden" name="rental_start_date" value={startDate} />
            {!startDate && (
              <p className="text-xs text-[var(--muted)]">Select when you need the rental to begin.</p>
            )}
            {startDate && (
              <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--muted)]">
                <span className="font-medium text-[var(--brand-ink)]">Start:</span> {formatLong(startDate)}
              </p>
            )}
          </div>
          <div className="space-y-4">
            <p className="text-sm font-medium text-[var(--brand-ink)]">End date</p>
            <BookingCalendar
              selectedDate={endDate}
              onSelectDate={setEndDate}
              minDate={endMin}
              unavailableDates={blockedDates}
            />
            <input type="hidden" name="rental_end_date" value={endDate} />
            {!endDate && startDate && (
              <p className="text-xs text-[var(--muted)]">Select the last day of your requested period.</p>
            )}
            {endDate && (
              <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--muted)]">
                <span className="font-medium text-[var(--brand-ink)]">End:</span> {formatLong(endDate)}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          How to reach you
        </h2>
        <div>
          <label htmlFor="tenant_approval_code" className="block text-sm font-medium text-[var(--brand-ink)]">
            Tenant approval code <span className="text-red-600">*</span>
          </label>
          <input
            id="tenant_approval_code"
            name="tenant_approval_code"
            type="text"
            required
            value={approvalCode}
            onChange={(e) => setApprovalCode(e.target.value)}
            placeholder="Enter your approved tenant code"
            className="mt-1.5 w-full max-w-md rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
          />
          <p className="mt-1 text-xs text-[var(--muted)]">
            Scheduling requires an approved tenant code.
          </p>
        </div>
        <div>
          <label htmlFor="time_slot" className="block text-sm font-medium text-[var(--brand-ink)]">
            Best time to call <span className="text-red-600">*</span>
          </label>
          <select
            id="time_slot"
            name="time_slot"
            required
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
          >
            <option value="">Choose a time</option>
            {RENTAL_CONTACT_SLOTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-[var(--brand-ink)]">
              Full name <span className="text-red-600">*</span>
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
            className="mt-1.5 w-full max-w-md rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
          />
        </div>
      </section>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-[var(--brand-ink)]">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Lease type, group size, flexibility on dates, questions for the team…"
          className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--brand-ink)] shadow-sm focus:border-[var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30"
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-full bg-[var(--brand-deep)] py-3.5 text-sm font-semibold text-white shadow-sm transition enabled:hover:bg-[var(--brand-deep)]/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending…" : "Submit schedule request"}
      </button>
    </form>
  );
}
