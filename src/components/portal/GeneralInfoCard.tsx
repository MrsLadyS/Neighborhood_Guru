"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  email: string;
  approvalCode: string;
  initialProfile: {
    full_name: string | null;
    phone: string | null;
    mailing_address: string | null;
    preferred_contact: string | null;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    notes: string | null;
  } | null;
  showNtnButton?: boolean;
};

export function GeneralInfoCard({ email, approvalCode, initialProfile, showNtnButton = false }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [fullName, setFullName] = useState(initialProfile?.full_name ?? "");
  const [phone, setPhone] = useState(initialProfile?.phone ?? "");
  const [mailingAddress, setMailingAddress] = useState(initialProfile?.mailing_address ?? "");
  const [preferredContact, setPreferredContact] = useState(initialProfile?.preferred_contact ?? "");
  const [emergencyName, setEmergencyName] = useState(initialProfile?.emergency_contact_name ?? "");
  const [emergencyPhone, setEmergencyPhone] = useState(initialProfile?.emergency_contact_phone ?? "");
  const [notes, setNotes] = useState(initialProfile?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const canUsePortalIdentity = Boolean(email && approvalCode);

  async function saveProfile() {
    if (!canUsePortalIdentity) return;
    setSaving(true);
    setMessage("");
    const { error } = await supabase.from("tenant_portal_profiles").upsert(
      {
        email,
        approval_code: approvalCode,
        full_name: fullName || null,
        phone: phone || null,
        mailing_address: mailingAddress || null,
        preferred_contact: preferredContact || null,
        emergency_contact_name: emergencyName || null,
        emergency_contact_phone: emergencyPhone || null,
        notes: notes || null,
      },
      { onConflict: "email,approval_code" }
    );
    setSaving(false);
    if (error) {
      setMessage("Could not save profile right now. Please try again.");
      return;
    }
    setMessage("General information updated. Continue to the waiver section to sign required acknowledgments.");
  }

  function goToWaivers() {
    const waiverSection = document.getElementById("waivers");
    if (!waiverSection) return;
    waiverSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-[var(--brand-ink)]">General information</h2>
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Update your contact and emergency details for active or upcoming rentals.
      </p>
      {!canUsePortalIdentity && (
        <p className="mt-2 text-sm text-[var(--muted)]">
          Enter email and approval code in Rental status above to manage this section.
        </p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-[var(--brand-ink)]">Full name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--brand-ink)]">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-[var(--brand-ink)]">Mailing address</label>
          <input
            value={mailingAddress}
            onChange={(e) => setMailingAddress(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--brand-ink)]">Preferred contact method</label>
          <select
            value={preferredContact}
            onChange={(e) => setPreferredContact(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm"
          >
            <option value="">Select…</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="text">Text message</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--brand-ink)]">Emergency contact name</label>
          <input
            value={emergencyName}
            onChange={(e) => setEmergencyName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--brand-ink)]">Emergency contact phone</label>
          <input
            value={emergencyPhone}
            onChange={(e) => setEmergencyPhone(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-[var(--brand-ink)]">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!canUsePortalIdentity || saving}
          onClick={saveProfile}
          className="rounded-full bg-[var(--brand-deep)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Update info"}
        </button>
        <button
          type="button"
          disabled={!canUsePortalIdentity}
          onClick={goToWaivers}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--brand-ink)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to waivers
        </button>
        {showNtnButton && (
          <Link
            href="/register?propertyInterest=marina-grande-marina-tower-2406&ntn=1"
            className="rounded-full border border-[var(--brand-deep)] px-4 py-2 text-sm font-medium text-[var(--brand-deep)] hover:bg-[var(--surface-2)]"
          >
            Continue to NTN
          </Link>
        )}
        {message && <p className="text-sm text-[var(--muted)]">{message}</p>}
      </div>
    </section>
  );
}
