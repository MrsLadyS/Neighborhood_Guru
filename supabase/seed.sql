-- Marina Grande — Marina Tower · Unit 2406 (Riviera Beach, FL)
-- Building name is commonly “Marina Grande” (Marina + Beach towers at Lake Shore Dr).
-- Stack 06 floor plan: developer materials cite 3 BR / 3.5 BA + den/media, ~2,287 SF + ~303 SF balcony
--   Source: https://www.marina-grande.com/2013/01/stack-locations.html
-- Floor plan file (Stack 06): https://docs.google.com/file/d/0B0u8B4-sXBCGaGhUbEZ2WTFQWUk
-- Preview images ship in repo: public/images/properties/marina-grande-marina-tower-2406/

insert into public.properties (
  slug,
  name,
  unit_label,
  address_line,
  city,
  region,
  postal_code,
  monthly_rent_cents,
  bedrooms,
  bathrooms,
  is_featured,
  image_url,
  description,
  floor_plan_url,
  gallery_urls
)
values (
  'marina-grande-marina-tower-2406',
  'Marina Grande — Marina Tower',
  'Unit 2406 · 24th floor',
  '2650 Lake Shore Drive, Unit 2406',
  'Riviera Beach',
  'FL',
  '33404',
  null,
  3,
  3.5,
  true,
  '/images/properties/marina-grande-marina-tower-2406/mg-sideview.png',
  $desc$
Furnished condo on the 24th floor of the Marina Tower at Marina Grande, Riviera Beach—set up for short-term, extended, or non-traditional stays.

The residence sits at the gateway to Singer Island with long views of the Atlantic Ocean, the Intracoastal Waterway (ICW), and the Singer Island shoreline. The 06 line is one of the building’s larger layouts: original developer materials describe approximately 3 bedrooms, 3.5 bathrooms, plus a den/media room, with about 2,287 square feet of living space and a substantial balcony (often quoted around 303 sq. ft.). Square footage and layout details should be verified with current condo documents and an in-person visit.

Bedroom setup: bedroom 1 has a California king; bedroom 2 has two full-size beds; bedroom 3 has a queen daybed with trundle.

You are only minutes from public beaches and a short trip to Phil Foster Park and the Blue Heron Bridge—one of South Florida’s most popular walk-in shore diving and snorkeling areas. The Marina Grande community offers resort-style amenities and a full-service marina setting on the water.

The gallery leads with the official 06 stack marketing floor plan (from the building’s original materials), followed by illustrative interior photos in a style common to South Florida luxury rental marketing—wide, bright, and similar in kind to listings you may see on sites like Zillow, but they are not this unit’s archived MLS photos. Schedule a tour for real finishes and sightlines.
  $desc$,
  'https://drive.google.com/file/d/0B0u8B4-sXBCGaGhUbEZ2WTFQWUk/view?usp=sharing',
  '[
    "/images/properties/marina-grande-marina-tower-2406/mg-sideview.png",
    "/images/properties/marina-grande-marina-tower-2406/mg-view-2.png"
  ]'::jsonb
)
on conflict (slug) do update set
  name = excluded.name,
  unit_label = excluded.unit_label,
  address_line = excluded.address_line,
  city = excluded.city,
  region = excluded.region,
  postal_code = excluded.postal_code,
  monthly_rent_cents = excluded.monthly_rent_cents,
  bedrooms = excluded.bedrooms,
  bathrooms = excluded.bathrooms,
  is_featured = excluded.is_featured,
  image_url = excluded.image_url,
  description = excluded.description,
  floor_plan_url = excluded.floor_plan_url,
  gallery_urls = excluded.gallery_urls;

-- 50-acre Catskills-area woodland / camping (Monticello, NY — near Resorts World Catskills)
-- Images: public/images/properties/catskills-woodland-50ac/

insert into public.properties (
  slug,
  name,
  unit_label,
  address_line,
  city,
  region,
  postal_code,
  monthly_rent_cents,
  bedrooms,
  bathrooms,
  is_featured,
  image_url,
  description,
  floor_plan_url,
  gallery_urls
)
values (
  'catskills-woodland-camping-50-acres',
  '50-Acre Maple Woodland Retreat',
  '50 acres · camping · foraging · seasonal stays',
  'Private wooded parcel — directions after booking',
  'Monticello',
  'NY',
  '12701',
  null,
  null,
  null,
  true,
  '/images/properties/catskills-woodland-50ac/hero-blueberry-bushes.jpg',
  $wood$
Fifty acres of heavily wooded land—maple-dominant hardwoods—with a heavenly, quiet canopy. Neighborhood Guru is planning guided stays built around camping, seasonal foraging trips, and low-impact outdoor experiences.

Just outside New York City with easy reach from the metro area, the parcel sits roughly 15 minutes from Resorts World Catskills (hotel and casino) in the Sullivan County / Monticello area—ideal for pairing a wilderness stay with dining, entertainment, or a show when you want it.

Wildlife and seasonal harvests are part of the draw: think blueberry picking, mushroom foraging, wild turkey, whitetail deer in season, and maple syrup tapping when the sap runs. Activities follow land rules, seasons, and safety—details provided when you book.

Gallery images highlight the experience—wild blueberries, mushrooms, whitetail, wild turkey (tom with hen and young), sugar maple tapping with bucket, and more—illustrative art for the site until on-site photos are added.
  $wood$,
  null,
  '[
    "/images/properties/catskills-woodland-50ac/hero-blueberry-bushes.jpg",
    "/images/properties/catskills-woodland-50ac/gallery-chicken-of-the-woods.jpg",
    "/images/properties/catskills-woodland-50ac/gallery-hen-of-the-woods-oak.jpg",
    "/images/properties/catskills-woodland-50ac/gallery-whitetail-buck.jpg",
    "/images/properties/catskills-woodland-50ac/gallery-wild-turkey-tom-hen.jpg",
    "/images/properties/catskills-woodland-50ac/gallery-sugar-maple-sap-bucket.jpg"
  ]'::jsonb
)
on conflict (slug) do update set
  name = excluded.name,
  unit_label = excluded.unit_label,
  address_line = excluded.address_line,
  city = excluded.city,
  region = excluded.region,
  postal_code = excluded.postal_code,
  monthly_rent_cents = excluded.monthly_rent_cents,
  bedrooms = excluded.bedrooms,
  bathrooms = excluded.bathrooms,
  is_featured = excluded.is_featured,
  image_url = excluded.image_url,
  description = excluded.description,
  floor_plan_url = excluded.floor_plan_url,
  gallery_urls = excluded.gallery_urls;

-- 30-acre Catskills-area orchard / vineyard / towers (Monticello, NY — companion to 50ac woodland)
-- Images: public/images/properties/catskills-orchard-vineyard-30ac/

insert into public.properties (
  slug,
  name,
  unit_label,
  address_line,
  city,
  region,
  postal_code,
  monthly_rent_cents,
  bedrooms,
  bathrooms,
  is_featured,
  image_url,
  description,
  floor_plan_url,
  gallery_urls
)
values (
  'catskills-orchard-vineyard-30-acres',
  '30-Acre Orchard, Vineyard & Ridge Views',
  '30 acres · orchard · vineyard · towers · birding · day excursions',
  'Private parcel — directions after booking',
  'Monticello',
  'NY',
  '12701',
  null,
  null,
  null,
  true,
  '/images/properties/catskills-orchard-vineyard-30ac/listing-mountaintop-view-catskills.jpg',
  $orch$
Thirty acres in the same Sullivan County / Monticello corridor as our larger woodland parcel—close enough for Resorts World Catskills and valley towns, but carved out for open sky and long sightlines. Locals call the ridgeline views “million-mile”—layers of ridge and valley fading into the distance on clear days.

This holding centers on a mixed “fruit salad” orchard (diverse fruiting trees and brambles in season), working vineyard rows, and day excursions built around fruit picking when the calendar allows (weather and crop permitting). Pair vineyard walks with harvest mornings when offerings line up.

Birders take note: two lookout towers anchor the property for quiet observation and photography—perch points above canopy and vine rows. Wildlife overlaps with our other Catskills parcels: whitetail deer and wild turkey are regular residents in season, with ethics and land rules that we provide at booking.

Neighborhood Guru is shaping stays around low-impact outdoor hospitality—availability and activity menus confirmed when you inquire or book.
  $orch$,
  null,
  '[
    "/images/properties/catskills-orchard-vineyard-30ac/hero-ridgetop-view.jpg",
    "/images/properties/catskills-orchard-vineyard-30ac/gallery-lookout-towers-birding.jpg",
    "/images/properties/catskills-orchard-vineyard-30ac/gallery-fruit-salad-orchard.jpg",
    "/images/properties/catskills-orchard-vineyard-30ac/gallery-vineyard-rows.jpg",
    "/images/properties/catskills-orchard-vineyard-30ac/gallery-whitetail-deer.jpg",
    "/images/properties/catskills-orchard-vineyard-30ac/gallery-wild-turkey.jpg"
  ]'::jsonb
)
on conflict (slug) do update set
  name = excluded.name,
  unit_label = excluded.unit_label,
  address_line = excluded.address_line,
  city = excluded.city,
  region = excluded.region,
  postal_code = excluded.postal_code,
  monthly_rent_cents = excluded.monthly_rent_cents,
  bedrooms = excluded.bedrooms,
  bathrooms = excluded.bathrooms,
  is_featured = excluded.is_featured,
  image_url = excluded.image_url,
  description = excluded.description,
  floor_plan_url = excluded.floor_plan_url,
  gallery_urls = excluded.gallery_urls;
