import { Shell } from "@/components/site/Shell";
import { createClient } from "@/lib/supabase/server";
import { getPropertiesForSite } from "@/lib/get-properties";
import { isSupabaseConfigured } from "@/lib/env";
import { InsuranceUploadCard } from "@/components/portal/InsuranceUploadCard";
import { GeneralInfoCard } from "@/components/portal/GeneralInfoCard";
import { WaiverManagerCard } from "@/components/portal/WaiverManagerCard";
import { RefreshStatusButton } from "@/components/portal/RefreshStatusButton";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    email?: string;
    approvalCode?: string;
    selectedPropertyIds?: string | string[];
  }>;
};

type PortalBooking = {
  property_id: string;
  requested_date: string;
  requested_end_date: string;
  status: "pending" | "confirmed" | "cancelled";
  schedule_approved: boolean;
  payment_received: boolean;
  insurance_verified: boolean;
  waivers_verified: boolean;
  ntn_completed: boolean;
  ntn_fee_paid: boolean;
  created_at: string;
};

type PortalProfile = {
  full_name: string | null;
  phone: string | null;
  mailing_address: string | null;
  preferred_contact: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  notes: string | null;
};

export default async function PortalPage({ searchParams }: Props) {
  const params = await searchParams;
  const email = (params.email ?? "").trim();
  const approvalCode = (params.approvalCode ?? "").trim();
  const selectedPropertyIdsRaw = params.selectedPropertyIds;
  const selectedPropertyIds = Array.isArray(selectedPropertyIdsRaw)
    ? selectedPropertyIdsRaw
    : selectedPropertyIdsRaw
      ? [selectedPropertyIdsRaw]
      : [];
  const selectedPropertySet = new Set(selectedPropertyIds);
  const properties = await getPropertiesForSite();
  const propertyById = new Map(properties.map((p) => [p.id, p]));
  const isWaiverProperty = (propertyId: string): boolean => {
    const property = propertyById.get(propertyId);
    const slug = (property?.slug ?? "").toLowerCase();
    return slug.includes("50-acres") || slug.includes("30-acres");
  };
  const isMarinaProperty = (propertyId: string): boolean => {
    const property = propertyById.get(propertyId);
    const slug = (property?.slug ?? "").toLowerCase();
    return slug.includes("marina-grande");
  };

  let bookings: PortalBooking[] = [];
  let profile: PortalProfile | null = null;
  let signedWaiverKeys = new Set<string>();
  if (isSupabaseConfigured() && email && approvalCode) {
    const supabase = await createClient();
    const [bookingsRes, profileRes, waiverRes] = await Promise.all([
      supabase.rpc("get_tenant_portal_bookings", {
        p_email: email,
        p_code: approvalCode,
      }),
      supabase.rpc("get_tenant_portal_profile", {
        p_email: email,
        p_code: approvalCode,
      }),
      supabase
        .from("waiver_acknowledgements")
        .select("waiver_key")
        .eq("approval_code", approvalCode)
        .eq("signer_email", email),
    ]);
    bookings = (bookingsRes.data ?? []) as PortalBooking[];
    profile = (profileRes.data as PortalProfile | null) ?? null;
    signedWaiverKeys = new Set(
      ((waiverRes.data as { waiver_key: string }[] | null) ?? []).map((row) => row.waiver_key)
    );

    if (!profile) {
      await supabase.from("tenant_portal_profiles").upsert(
        {
          email,
          approval_code: approvalCode,
          full_name: null,
          phone: null,
          mailing_address: null,
          preferred_contact: null,
          emergency_contact_name: null,
          emergency_contact_phone: null,
          notes: null,
        },
        { onConflict: "email,approval_code" }
      );
    }
  }

  const applicablePropertyIds = selectedPropertyIds.length > 0
    ? selectedPropertyIds
    : bookings.map((b) => b.property_id);

  const applicableBookings = bookings.filter((b) => applicablePropertyIds.includes(b.property_id));
  const hasAnySchedule = bookings.length > 0;

  const hasScheduleApproved = applicableBookings.some((b) => b.schedule_approved);
  const hasPaymentMade = applicableBookings.some((b) => b.payment_received);
  const hasInsuranceUploaded = applicableBookings.some((b) => b.insurance_verified);

  const selectedWaiverProperty = applicablePropertyIds.some((propertyId) => isWaiverProperty(propertyId));
  const waiversRequired = hasAnySchedule || selectedWaiverProperty;
  const requiredWaiverKeys = ["atv_utv_release", "animal_horse_release", "general_premises_release"];
  const hasApplicableWaiversAcknowledged = waiversRequired
    ? requiredWaiverKeys.every((key) => signedWaiverKeys.has(key))
    : true;

  const marinaSelectedOrBooked = applicablePropertyIds.some((propertyId) => isMarinaProperty(propertyId));
  const marinaNtnRequired = marinaSelectedOrBooked && approvalCode.toLowerCase() !== "fam123";
  const hasNtnCompletedAndFeePaid = marinaNtnRequired
    ? applicableBookings.some((b) => b.ntn_completed && b.ntn_fee_paid)
    : true;

  const checklistItems: {
    key: string;
    label: string;
    done: boolean;
    pendingText: string;
    completeText: string;
    required: boolean;
  }[] = [
    {
      key: "schedule",
      label: "Schedule approved",
      done: hasScheduleApproved,
      pendingText: "Pending approval",
      completeText: "Approved",
      required: true,
    },
    {
      key: "payment",
      label: "Payment recieved",
      done: hasPaymentMade,
      pendingText: "Pending payment/confirmation",
      completeText: "Paid",
      required: true,
    },
    {
      key: "insurance",
      label: "Insurance uploaded",
      done: hasInsuranceUploaded,
      pendingText: "Upload required",
      completeText: "Uploaded",
      required: true,
    },
    {
      key: "waivers",
      label: "Applicable waivers acknowledged",
      done: hasApplicableWaiversAcknowledged,
      pendingText: waiversRequired ? "Sign required waivers" : "Not required",
      completeText: waiversRequired ? "Acknowledged" : "Not required",
      required: true,
    },
  ];
  if (marinaNtnRequired) {
    checklistItems.push({
      key: "ntn",
      label: "NTN completed + $250 application fee paid",
      done: hasNtnCompletedAndFeePaid,
      pendingText: "Required for Marina Grande",
      completeText: "Completed and paid",
      required: true,
    });
  }
  const visibleChecklistItems = checklistItems.filter((item) => item.required);
  const allComplete = visibleChecklistItems.every((item) => item.done);

  return (
    <Shell>
      <main className="flex-1">
        <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--brand-accent-dark)]">
              Tenant portal
            </p>
            <h1 className="mt-2 max-w-3xl font-display text-4xl tracking-tight text-[var(--brand-ink)] sm:text-5xl">
              Tenant portal and rental documents
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
              Your next stay starts here. Keep everything in one place, move through approvals with
              confidence, and get ready for a smooth arrival with Neighborhood Guru.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
          <section className="rounded-2xl border border-[var(--border)] bg-white p-6">
            <h2 className="font-display text-2xl text-[var(--brand-ink)]">Rental status</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Enter the email and approval code used during scheduling to view current request status.
            </p>
            <form className="mt-5 grid gap-4 sm:grid-cols-3" method="GET" action="/portal">
              <div className="sm:col-span-3">
                <p className="text-sm font-medium text-[var(--brand-ink)]">
                  Properties interested in renting
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Select all that apply. These selections determine which tenant requirements are applicable.
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {properties.map((property) => (
                    <label
                      key={property.id}
                      className="inline-flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--brand-ink)]"
                    >
                      <input
                        type="checkbox"
                        name="selectedPropertyIds"
                        value={property.id}
                        defaultChecked={selectedPropertySet.has(property.id)}
                        className="mt-0.5 accent-[var(--brand-deep)]"
                      />
                      <span>{property.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <input
                type="email"
                name="email"
                defaultValue={email}
                required
                placeholder="you@email.com"
                className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--brand-ink)]"
              />
              <input
                type="text"
                name="approvalCode"
                defaultValue={approvalCode}
                required
                placeholder="Approval code"
                className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--brand-ink)]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[var(--brand-deep)] px-4 py-3 text-sm font-semibold text-white"
              >
                Check status
              </button>
            </form>

            {email && approvalCode && bookings.length === 0 && (
              <p className="mt-4 text-sm text-[var(--muted)]">
                No matching requests found yet. Confirm your email/code and try again.
              </p>
            )}
            {bookings.length > 0 && (
              <ul className="mt-4 space-y-3">
                {bookings.map((b) => {
                  const property = propertyById.get(b.property_id);
                  return (
                    <li key={`${b.property_id}-${b.requested_date}-${b.created_at}`} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                      <p className="text-sm font-semibold text-[var(--brand-ink)]">
                        {property?.name ?? "Requested property"}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Dates: {b.requested_date} to {b.requested_end_date}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Status: {b.status} · Manual review: {b.schedule_approved ? "Approved" : "Pending"}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {email && approvalCode && (
            <section
              className={`rounded-2xl border p-6 ${
                allComplete
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-[var(--border)] bg-white"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-2xl text-[var(--brand-ink)]">Completion checklist</h2>
                <div className="flex items-center gap-2">
                  <RefreshStatusButton />
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      allComplete
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {allComplete ? "All complete" : "Action needed"}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">
                This section turns green once every required item is complete.
              </p>
              <ul className="mt-4 space-y-2">
                {visibleChecklistItems.map((item) => (
                  <li
                    key={item.key}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                      item.done
                        ? "border-emerald-300 bg-emerald-100/60"
                        : "border-[var(--border)] bg-[var(--surface-2)]"
                    }`}
                  >
                    <span className="font-medium text-[var(--brand-ink)]">{item.label}</span>
                    <span className={item.done ? "text-emerald-700" : "text-[var(--muted)]"}>
                      {item.done ? item.completeText : item.pendingText}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <GeneralInfoCard
            email={email}
            approvalCode={approvalCode}
            initialProfile={profile}
            showNtnButton={marinaNtnRequired && approvalCode.toLowerCase() !== "fam123"}
          />

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h3 className="font-display text-xl text-[var(--brand-ink)]">Terms of rental + DocuSign</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Review rental terms and complete your DocuSign package.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--brand-ink)]" href="#">
                  View terms document
                </a>
                <a className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--brand-ink)]" href="#">
                  Open DocuSign package
                </a>
              </div>
            </div>

            <InsuranceUploadCard email={email} approvalCode={approvalCode} />

            <div id="waivers">
              <WaiverManagerCard
                email={email}
                approvalCode={approvalCode}
                applicableBookings={applicablePropertyIds.map((propertyId) => {
                  const property = propertyById.get(propertyId);
                  return {
                    property_id: propertyId,
                    property_name: property?.name ?? "Requested property",
                    city: property?.city ?? null,
                  };
                })}
              />
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h3 className="font-display text-xl text-[var(--brand-ink)]">Safety information</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Review safety packet and emergency guidance before check-in.
              </p>
              <div className="mt-4">
                <a className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--brand-ink)]" href="#">
                  Open safety packet
                </a>
              </div>
            </div>
          </section>

        </div>
      </main>
    </Shell>
  );
}
