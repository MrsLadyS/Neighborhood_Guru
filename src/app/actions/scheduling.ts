"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { redirect } from "next/navigation";
import type { BookingInsert } from "@/types/database";

export type ScheduleState = { ok: false; error: string };
const FAMILY_APPROVAL_CODE = "fam123";
const FAMILY_APPROVAL_CODE_CANONICAL = "Fam123";

export async function submitScheduleRequest(
  _prev: ScheduleState | null,
  formData: FormData
): Promise<ScheduleState> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error:
        "We could not save this request online. Please call Neighborhood Guru to discuss renting.",
    };
  }

  const full_name = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const requested_date = String(formData.get("rental_start_date") ?? "").trim();
  const tenantApprovalCodeRaw = String(formData.get("tenant_approval_code") ?? "").trim();
  const time_slot = String(formData.get("time_slot") ?? "").trim();
  const property_id = String(formData.get("property_id") ?? "").trim();
  const endRaw = String(formData.get("rental_end_date") ?? "").trim();
  const notesRaw = String(formData.get("notes") ?? "").trim();

  if (!full_name || !email || !phone || !requested_date || !time_slot || !tenantApprovalCodeRaw) {
    return { ok: false, error: "Please complete all required fields." };
  }
  if (!property_id) {
    return { ok: false, error: "Please select a property before scheduling dates." };
  }
  const tenantApprovalCodeNormalized = tenantApprovalCodeRaw.toLowerCase();
  const isFamilyCode = tenantApprovalCodeNormalized === FAMILY_APPROVAL_CODE;

  if (!endRaw) {
    return {
      ok: false,
      error: "Choose an end date for your requested rental period.",
    };
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) return { ok: false, error: "Please enter a valid email address." };

  if (endRaw < requested_date) {
    return { ok: false, error: "The end date must be the same as or after the start date." };
  }
  const requested_end_date = endRaw;
  const tenant_approval_code = isFamilyCode ? FAMILY_APPROVAL_CODE_CANONICAL : tenantApprovalCodeRaw;
  const notes = isFamilyCode
    ? [notesRaw, "[Auto-approved: family discount]"].filter(Boolean).join("\n") || null
    : notesRaw || null;

  const row: BookingInsert = {
    full_name,
    email,
    phone,
    requested_date,
    requested_end_date,
    tenant_approval_code,
    time_slot,
    property_id,
    notes,
  };

  const supabase = await createClient();
  const { data: overlappingRows, error: overlapError } = await supabase
    .from("property_bookings")
    .select("id")
    .eq("property_id", property_id)
    .in("status", ["pending", "confirmed"])
    .lte("requested_date", requested_end_date)
    .gte("requested_end_date", requested_date)
    .limit(1);
  if (overlapError) {
    console.error(overlapError);
    return {
      ok: false,
      error: "We could not verify date availability. Please try again in a moment.",
    };
  }
  if ((overlappingRows?.length ?? 0) > 0) {
    return {
      ok: false,
      error:
        "Those dates are no longer available for this property. Please choose another date range.",
    };
  }

  const { error } = await supabase.from("property_bookings").insert({
    property_id: row.property_id,
    full_name: row.full_name,
    email: row.email,
    phone: row.phone,
    requested_date: row.requested_date,
    requested_end_date: row.requested_end_date,
    tenant_approval_code: row.tenant_approval_code,
    time_slot: row.time_slot,
    notes: row.notes,
    status: isFamilyCode ? "confirmed" : "pending",
  });

  if (error) {
    console.error(error);
    return { ok: false, error: "We could not save your request. Try again or call our office." };
  }

  redirect(`/schedule/next-step?type=${isFamilyCode ? "family" : "tenant"}`);
}
