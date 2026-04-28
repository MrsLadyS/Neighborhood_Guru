-- Marketplace products with inventory + presale controls.
-- Run this in Supabase SQL editor (or through your migrations flow).

create table if not exists public.marketplace_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  season_label text,
  unit_label text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  image_url text,
  current_inventory_units integer not null default 0 check (current_inventory_units >= 0),
  presale_enabled boolean not null default false,
  presale_limit_units integer not null default 0 check (presale_limit_units >= 0),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_marketplace_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_marketplace_products_updated_at on public.marketplace_products;
create trigger trg_marketplace_products_updated_at
before update on public.marketplace_products
for each row
execute function public.set_marketplace_products_updated_at();

-- Optional starter records matching the current UI list.
insert into public.marketplace_products (
  slug,
  name,
  description,
  season_label,
  unit_label,
  unit_price_cents,
  image_url,
  current_inventory_units,
  presale_enabled,
  presale_limit_units,
  sort_order
)
values
  (
    'wild-blueberries',
    'Wild Blueberries',
    'Small-batch wild blueberry harvest from the woodland parcel.',
    'Summer',
    '1 lb basket',
    1200,
    'https://images.unsplash.com/photo-1597479393361-2f25516f5f14?auto=format&fit=crop&w=1200&q=80',
    0,
    true,
    300,
    10
  ),
  (
    'orchard-fruit-box',
    'Orchard Fruit Box',
    'Mixed seasonal orchard fruit from current available crop.',
    'Late Summer to Fall',
    '5 lb box',
    2800,
    'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=80',
    0,
    true,
    250,
    20
  ),
  (
    'maple-syrup',
    'Small-Batch Maple Syrup',
    'Catskills maple syrup from seasonal sap collection.',
    'Spring',
    '16 oz bottle',
    1800,
    'https://images.unsplash.com/photo-1625944193455-2fba3c7dbfd8?auto=format&fit=crop&w=1200&q=80',
    0,
    true,
    200,
    30
  ),
  (
    'orchard-blossom-honey',
    'Honey (orchard blossom)',
    'Small-batch honey produced from orchard blossom forage.',
    'Year-round (limited)',
    '12 oz jar',
    1400,
    'https://images.unsplash.com/photo-1587049016823-69e11f7f3f7d?auto=format&fit=crop&w=1200&q=80',
    0,
    true,
    200,
    40
  ),
  (
    'timithy-hay',
    'Timithy hay',
    'Pre-order available. Minimum quantity is 500 bales.',
    'Pre-order',
    '50 lb bale',
    800,
    'https://images.unsplash.com/photo-1597940345275-1f6f7a4f7575?auto=format&fit=crop&w=1200&q=80',
    0,
    true,
    5000,
    50
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  season_label = excluded.season_label,
  unit_label = excluded.unit_label,
  unit_price_cents = excluded.unit_price_cents,
  image_url = excluded.image_url,
  presale_enabled = excluded.presale_enabled,
  presale_limit_units = excluded.presale_limit_units,
  sort_order = excluded.sort_order;

-- Examples for updating live quantities:
-- update public.marketplace_products
-- set current_inventory_units = 140
-- where slug = 'orchard-blossom-honey';
--
-- update public.marketplace_products
-- set presale_limit_units = 6500, presale_enabled = true
-- where slug = 'timithy-hay';
