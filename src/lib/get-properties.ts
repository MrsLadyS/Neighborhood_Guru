import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { STATIC_PROPERTIES } from "@/data/listings";
import type { Property } from "@/types/database";

const SELECT =
  "id, slug, name, unit_label, address_line, city, region, postal_code, monthly_rent_cents, bedrooms, bathrooms, is_featured, image_url, description, floor_plan_url, gallery_urls, created_at";

function asPropertyList(data: unknown): Property[] {
  return (data as Property[] | null) ?? [];
}

/**
 * Listings for the public site: use Supabase when configured and non-empty; otherwise built-in static data.
 */
export async function getPropertiesForSite(): Promise<Property[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("properties")
      .select(SELECT)
      .order("is_featured", { ascending: false })
      .order("name");
    const fromDb = asPropertyList(data);
    if (fromDb.length > 0) return fromDb;
  }
  return STATIC_PROPERTIES;
}

export function getStaticPropertyBySlug(slug: string): Property | null {
  return STATIC_PROPERTIES.find((p) => p.slug === slug) ?? null;
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("properties")
      .select(SELECT)
      .eq("slug", slug)
      .maybeSingle();
    if (data) return data as Property;
  }
  return getStaticPropertyBySlug(slug);
}
