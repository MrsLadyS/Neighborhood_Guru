export type Property = {
  id: string;
  slug: string;
  name: string;
  unit_label: string | null;
  address_line: string | null;
  city: string | null;
  region: string | null;
  postal_code: string | null;
  monthly_rent_cents: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  is_featured: boolean;
  image_url: string | null;
  description: string | null;
  floor_plan_url: string | null;
  gallery_urls: string[] | null;
  pricing_summary?: string | null;
  created_at: string;
};

export type BookingInsert = {
  property_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  requested_date: string;
  /** Desired end of rental/stay date. */
  requested_end_date: string | null;
  /** Approval code issued to approved tenants; required for /schedule. */
  tenant_approval_code: string | null;
  time_slot: string;
  notes: string | null;
};

export type TenantRegistrationInsert = {
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  current_address: string | null;
  employer: string | null;
  monthly_income_range: string | null;
  desired_move_in: string | null;
  property_interest: string | null;
  occupants_count: number | null;
  has_pets: boolean | null;
  pet_details: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  additional_notes: string | null;
};
