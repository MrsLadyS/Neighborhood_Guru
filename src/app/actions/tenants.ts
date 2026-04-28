"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { TenantRegistrationInsert } from "@/types/database";

export type TenantState = { ok: true } | { ok: false; error: string };

function parseOptionalInt(s: string): number | null {
  if (!s.trim()) return null;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

export async function submitTenantRegistration(
  _prev: TenantState | null,
  formData: FormData
): Promise<TenantState> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error:
        "We could not submit this form online. Please call or email our office to complete your application.",
    };
  }

  const full_name = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!full_name || !email || !phone) {
    return { ok: false, error: "Name, email, and phone are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const isMarinaGrande =
    String(formData.get("is_marina_grande_interest") ?? "").trim().toLowerCase() === "yes";
  const additionalNotesRaw = String(formData.get("additional_notes") ?? "").trim();
  const additionalNotesWithTag = isMarinaGrande
    ? [additionalNotesRaw, "[Marina Grande interest: yes]"].filter(Boolean).join("\n")
    : additionalNotesRaw;

  const row: TenantRegistrationInsert = {
    full_name,
    email,
    phone,
    date_of_birth: String(formData.get("date_of_birth") ?? "").trim() || null,
    current_address: String(formData.get("current_address") ?? "").trim() || null,
    employer: String(formData.get("employer") ?? "").trim() || null,
    monthly_income_range: String(formData.get("monthly_income_range") ?? "").trim() || null,
    desired_move_in: String(formData.get("desired_move_in") ?? "").trim() || null,
    property_interest: String(formData.get("property_interest") ?? "").trim() || null,
    occupants_count: parseOptionalInt(String(formData.get("occupants_count") ?? "")),
    has_pets: null,
    pet_details: null,
    emergency_contact_name: String(formData.get("emergency_contact_name") ?? "").trim() || null,
    emergency_contact_phone: String(formData.get("emergency_contact_phone") ?? "").trim() || null,
    additional_notes: additionalNotesWithTag || null,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("tenant_registrations").insert(row);

  if (error) {
    console.error(error);
    return { ok: false, error: "We could not submit your application. Try again or call us." };
  }

  return { ok: true };
}
