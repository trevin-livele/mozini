-- Add site_settings table for admin-configurable delivery fees
create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  label text not null default '',
  updated_at timestamptz not null default now()
);

-- Seed default delivery settings
insert into public.site_settings (key, value, label) values
  ('delivery_fee_rider', '500', 'Our Rider delivery fee (KES)'),
  ('delivery_fee_pickup_mtaani', '200', 'Pickup Mtaani fee (KES)'),
  ('delivery_fee_self_pickup', '0', 'Self Pickup fee (KES)'),
  ('free_delivery_threshold', '0', 'Free delivery threshold (KES, 0 = never free)')
on conflict (key) do nothing;

-- Allow authenticated users to read settings (needed for checkout/cart)
-- Allow admins to update settings
alter table public.site_settings enable row level security;

create policy "Anyone can read site settings"
  on public.site_settings for select
  using (true);

create policy "Admins can update site settings"
  on public.site_settings for update
  using (public.is_admin());

create policy "Admins can insert site settings"
  on public.site_settings for insert
  with check (public.is_admin());
