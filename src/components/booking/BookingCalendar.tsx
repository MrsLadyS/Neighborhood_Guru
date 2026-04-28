"use client";

import { useMemo, useState } from "react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function toISODateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseISOLocal(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

type Props = {
  selectedDate: string;
  onSelectDate: (iso: string) => void;
  minDate: string;
  unavailableDates?: string[];
};

export function BookingCalendar({ selectedDate, onSelectDate, minDate, unavailableDates = [] }: Props) {
  const minD = useMemo(() => parseISOLocal(minDate), [minDate]);
  const unavailableSet = useMemo(() => new Set(unavailableDates), [unavailableDates]);
  const initialMonth = selectedDate ? parseISOLocal(selectedDate) : minD;

  const [view, setView] = useState(() => ({
    year: initialMonth.getFullYear(),
    month: initialMonth.getMonth(),
  }));

  const { year, month } = view;
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const minYear = minD.getFullYear();
  const minMonth = minD.getMonth();
  const canPrev = year > minYear || (year === minYear && month > minMonth);

  const monthLabel = new Date(year, month, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const cells = useMemo(() => {
    const list: ({ day: number } | null)[] = [];
    for (let i = 0; i < firstDow; i++) list.push(null);
    for (let d = 1; d <= daysInMonth; d++) list.push({ day: d });
    const remainder = list.length % 7;
    if (remainder !== 0) {
      for (let i = 0; i < 7 - remainder; i++) list.push(null);
    }
    return list;
  }, [firstDow, daysInMonth]);

  function goPrev() {
    if (!canPrev) return;
    setView((v) => {
      if (v.month === 0) return { year: v.year - 1, month: 11 };
      return { year: v.year, month: v.month - 1 };
    });
  }

  function goNext() {
    setView((v) => {
      if (v.month === 11) return { year: v.year + 1, month: 0 };
      return { year: v.year, month: v.month + 1 };
    });
  }

  function isDisabled(day: number): boolean {
    const candidate = new Date(year, month, day);
    candidate.setHours(0, 0, 0, 0);
    const min = new Date(minD);
    min.setHours(0, 0, 0, 0);
    const iso = toISODateLocal(candidate);
    return candidate < min || unavailableSet.has(iso);
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[var(--brand-ink)]" id="cal-label">
          {monthLabel}
        </h2>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canPrev}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--brand-ink)] transition hover:bg-[var(--surface-2)] disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Previous month"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--brand-ink)] transition hover:bg-[var(--surface-2)]"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div
        className="mt-4 grid grid-cols-7 gap-y-1 text-center text-xs font-medium text-[var(--muted)]"
        aria-hidden
      >
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div
        role="grid"
        aria-labelledby="cal-label"
        className="mt-1 grid grid-cols-7 gap-1"
      >
        {cells.map((cell, i) => {
          if (!cell) {
            return <div key={`e-${i}`} className="aspect-square min-h-[2.25rem]" />;
          }
          const day = cell.day;
          const iso = toISODateLocal(new Date(year, month, day));
          const disabled = isDisabled(day);
          const selected = selectedDate === iso;

          return (
            <button
              key={iso}
              type="button"
              role="gridcell"
              disabled={disabled}
              onClick={() => !disabled && onSelectDate(iso)}
              aria-label={`${monthLabel} ${day}`}
              className={`aspect-square min-h-[2.25rem] rounded-lg text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2 ${
                disabled
                  ? "cursor-not-allowed text-[var(--muted)]/35"
                  : selected
                    ? "bg-[var(--brand-deep)] text-white shadow-sm"
                    : "text-[var(--brand-ink)] hover:bg-[var(--surface-2)]"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
