import type { Property } from "@/types/database";

/** Stable ids for static listings; align with Supabase seed if you use the same slugs. */
const MARINA_ID = "a0000000-0000-4000-8000-000000000001";
const WOODLAND_ID = "a0000000-0000-4000-8000-000000000002";
const ORCHARD_ID = "a0000000-0000-4000-8000-000000000003";

const MARINA_DESCRIPTION = `Furnished condo on the 24th floor of the Marina Tower at Marina Grande, Riviera Beach—set up for short-term, extended, or non-traditional stays.

The residence sits at the gateway to Singer Island with long views of the Atlantic Ocean, the Intracoastal Waterway (ICW), and the Singer Island shoreline. The 06 line is one of the building’s larger layouts: original developer materials describe approximately 3 bedrooms, 3.5 bathrooms, plus a den/media room, with about 2,287 square feet of living space and a substantial balcony (often quoted around 303 sq. ft.). Square footage and layout details should be verified with current condo documents and an in-person visit.

Bedroom setup: bedroom 1 has a California king; bedroom 2 has two full-size beds; bedroom 3 has a queen daybed with trundle.

You are only minutes from public beaches and a short trip to Phil Foster Park and the Blue Heron Bridge—one of South Florida’s most popular walk-in shore diving and snorkeling areas. The Marina Grande community offers resort-style amenities and a full-service marina setting on the water.

Curated stays and adventures are awaiting your arrival. Open any listing for full details, photos, and availability context.`;

const WOODLAND_DESCRIPTION = `Fifty acres of heavily wooded land—maple-dominant hardwoods—with a heavenly, quiet canopy. Neighborhood Guru is planning guided stays built around camping, seasonal foraging trips, and low-impact outdoor experiences.

Just outside New York City with easy reach from the metro area, the parcel sits in Greenfield Park, NY, roughly 15 minutes from Resorts World Catskills (hotel and casino)—ideal for pairing a wilderness stay with dining, entertainment, or a show when you want it.

Wildlife and seasonal harvests are part of the draw: think blueberry picking, mushroom foraging, wild turkey, whitetail deer in season, and maple syrup tapping when the sap runs. Activities follow land rules, seasons, and safety—details provided when you book.

Gallery images highlight the experience—wild blueberries, mushrooms, whitetail, wild turkey (tom with hen and young), sugar maple tapping with bucket, and more—illustrative art for the site until your on-site photos are added.`;

const ORCHARD_DESCRIPTION = `Thirty acres in the same Greenfield Park, NY corridor as our larger woodland parcel—close enough for Resorts World Catskills and valley towns, but carved out for open sky and long sightlines. Locals call the ridgeline views “million-mile”—layers of ridge and valley fading into the distance on clear days.

This holding centers on a mixed “fruit salad” orchard (diverse fruiting trees and brambles in season), working vineyard rows, and day excursions built around fruit picking when the calendar allows (weather and crop permitting). Pair vineyard walks with harvest mornings when offerings line up.

Birders take note: two lookout towers anchor the property for quiet observation and photography—perch points above canopy and vine rows. Wildlife overlaps with our other Catskills parcels: whitetail deer and wild turkey are regular residents in season, with ethics and land rules that we provide at booking.

Neighborhood Guru is shaping stays around low-impact outdoor hospitality—availability and activity menus confirmed when you inquire or book.`;

export const STATIC_PROPERTIES: Property[] = [
  {
    id: MARINA_ID,
    slug: "marina-grande-marina-tower-2406",
    name: "Marina Grande — Marina Tower",
    unit_label: "Unit 2406 · 24th floor",
    address_line: "2650 Lake Shore Drive, Unit 2406",
    city: "Riviera Beach",
    region: "FL",
    postal_code: "33404",
    monthly_rent_cents: null,
    bedrooms: 3,
    bathrooms: 3.5,
    is_featured: true,
    image_url: "/images/properties/marina-grande-marina-tower-2406/mg-sideview.png",
    description: MARINA_DESCRIPTION,
    floor_plan_url:
      "https://drive.google.com/file/d/0B0u8B4-sXBCGaGhUbEZ2WTFQWUk/view?usp=sharing",
    pricing_summary: "$12,000/month.",
    gallery_urls: [
      "/images/properties/marina-grande-marina-tower-2406/mg-sideview.png",
      "/images/properties/marina-grande-marina-tower-2406/mg-view-2.png",
    ],
    created_at: "2025-01-01T00:00:00.000Z",
  },
  {
    id: WOODLAND_ID,
    slug: "catskills-woodland-camping-50-acres",
    name: "50-Acre Maple Woodland Retreat",
    unit_label: "50 acres · camping · foraging · seasonal stays",
    address_line: "Private wooded parcel — directions after booking",
    city: "Greenfield Park",
    region: "NY",
    postal_code: "12701",
    monthly_rent_cents: null,
    bedrooms: null,
    bathrooms: null,
    is_featured: true,
    image_url: "/images/properties/catskills-woodland-50ac/hero-blueberry-bushes.jpg",
    description: WOODLAND_DESCRIPTION,
    floor_plan_url: null,
    pricing_summary:
      "Monthly: $5,500. Overnight: $250/night. Day pass (5:00 AM–10:00 PM): $200 up to 15 people, then $10/person after 15.",
    gallery_urls: [
      "/images/properties/catskills-woodland-50ac/hero-blueberry-bushes.jpg",
      "/images/properties/catskills-woodland-50ac/gallery-chicken-of-the-woods.jpg",
      "/images/properties/catskills-woodland-50ac/gallery-hen-of-the-woods-oak.jpg",
      "/images/properties/catskills-woodland-50ac/gallery-whitetail-buck.jpg",
      "/images/properties/catskills-woodland-50ac/gallery-wild-turkey-tom-hen.jpg",
      "/images/properties/catskills-woodland-50ac/gallery-sugar-maple-sap-bucket.jpg",
    ],
    created_at: "2025-06-01T00:00:00.000Z",
  },
  {
    id: ORCHARD_ID,
    slug: "catskills-orchard-vineyard-30-acres",
    name: "30-Acre Orchard, Vineyard & Ridge Views",
    unit_label: "30 acres · orchard · vineyard · towers · birding · day excursions",
    address_line: "Private parcel — directions after booking",
    city: "Greenfield Park",
    region: "NY",
    postal_code: "12701",
    monthly_rent_cents: null,
    bedrooms: null,
    bathrooms: null,
    is_featured: true,
    image_url:
      "/images/properties/catskills-orchard-vineyard-30ac/listing-mountaintop-view-catskills.jpg",
    description: ORCHARD_DESCRIPTION,
    floor_plan_url: null,
    pricing_summary:
      "Day pass (5:00 AM–10:00 PM): $200 up to 15 people, then $10/person after 15.",
    gallery_urls: [
      "/images/properties/catskills-orchard-vineyard-30ac/hero-ridgetop-view.jpg",
      "/images/properties/catskills-orchard-vineyard-30ac/gallery-lookout-towers-birding.jpg",
      "/images/properties/catskills-orchard-vineyard-30ac/gallery-fruit-salad-orchard.jpg",
      "/images/properties/catskills-orchard-vineyard-30ac/gallery-vineyard-rows.jpg",
      "/images/properties/catskills-orchard-vineyard-30ac/gallery-whitetail-deer.jpg",
      "/images/properties/catskills-orchard-vineyard-30ac/gallery-wild-turkey.jpg",
    ],
    created_at: "2025-07-01T00:00:00.000Z",
  },
];
