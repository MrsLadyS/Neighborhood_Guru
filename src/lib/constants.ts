/** Best time to reach the applicant (stored in `time_slot` on legacy `property_bookings` rows). */
export const RENTAL_CONTACT_SLOTS = [
  { value: "9:00–11:00", label: "Morning · 9:00 – 11:00" },
  { value: "11:00–13:00", label: "Midday · 11:00 – 1:00" },
  { value: "13:00–15:00", label: "Afternoon · 1:00 – 3:00" },
  { value: "15:00–17:00", label: "Late afternoon · 3:00 – 5:00" },
  { value: "flexible", label: "Flexible — any reasonable time" },
] as const;

export const INCOME_RANGES = [
  { value: "", label: "Select range" },
  { value: "under-2k", label: "Under $2,000" },
  { value: "2k-4k", label: "$2,000 – $4,000" },
  { value: "4k-6k", label: "$4,000 – $6,000" },
  { value: "6k-8k", label: "$6,000 – $8,000" },
  { value: "8k-plus", label: "$8,000+" },
] as const;
