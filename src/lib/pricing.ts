export function pricingSummaryForSlug(slug: string): string | null {
  if (slug === "marina-grande-marina-tower-2406") {
    return "$12,000/month.";
  }
  if (slug === "catskills-orchard-vineyard-30-acres") {
    return "Day pass (5:00 AM–10:00 PM): $200 up to 15 people, then $10/person after 15.";
  }
  if (slug === "catskills-woodland-camping-50-acres") {
    return "Monthly: $5,500. Overnight: $250/night. Day pass (5:00 AM–10:00 PM): $200 up to 15 people, then $10/person after 15.";
  }
  return null;
}
