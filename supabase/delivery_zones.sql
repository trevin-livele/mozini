-- ============================================
-- DELIVERY ZONES (zone-based delivery charges)
-- ============================================
-- Run this migration in your Supabase SQL editor

create table if not exists public.delivery_zones (
  id serial primary key,
  zone_name text not null,        -- e.g. "Zone D", "Zone E"
  zone_label text not null,       -- e.g. "Juja Road", "Mombasa Road"
  area_name text not null,        -- e.g. "Kariokoo", "Nyayo Stadium"
  fee integer not null check (fee >= 0),  -- delivery fee in KES
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(zone_name, area_name)
);

create index idx_delivery_zones_active on public.delivery_zones(is_active);
create index idx_delivery_zones_zone on public.delivery_zones(zone_name);
create index idx_delivery_zones_area on public.delivery_zones(area_name);

-- Updated_at trigger
create trigger set_updated_at before update on public.delivery_zones
  for each row execute function public.update_updated_at();

-- RLS policies
alter table public.delivery_zones enable row level security;

-- Everyone can read active zones
create policy "Anyone can read active delivery zones"
  on public.delivery_zones for select
  using (is_active = true);

-- Admins can do everything
create policy "Admins can manage delivery zones"
  on public.delivery_zones for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- SEED DATA from Mozini delivery chart
-- ============================================

-- Zone D - Juja Road
insert into public.delivery_zones (zone_name, zone_label, area_name, fee) values
  ('Zone D', 'Juja Road', 'Kariokoo', 200),
  ('Zone D', 'Juja Road', 'Pangani', 300),
  ('Zone D', 'Juja Road', 'Pumwani', 300),
  ('Zone D', 'Juja Road', 'Eastleigh', 300),
  ('Zone D', 'Juja Road', 'Mathare', 300),
  ('Zone D', 'Juja Road', 'Huruma', 300);

-- Zone E - Mombasa Road
insert into public.delivery_zones (zone_name, zone_label, area_name, fee) values
  ('Zone E', 'Mombasa Road', 'Nyayo Stadium', 200),
  ('Zone E', 'Mombasa Road', 'Bunyala/Lusaka Rd', 250),
  ('Zone E', 'Mombasa Road', 'South B', 300),
  ('Zone E', 'Mombasa Road', 'South C', 300),
  ('Zone E', 'Mombasa Road', 'Nairobi West', 300),
  ('Zone E', 'Mombasa Road', 'Capital Centre', 300),
  ('Zone E', 'Mombasa Road', 'Next Gen Mall', 300),
  ('Zone E', 'Mombasa Road', 'Panari/Airtel', 300),
  ('Zone E', 'Mombasa Road', 'Industry Area', 300),
  ('Zone E', 'Mombasa Road', 'Ole Sereni', 300),
  ('Zone E', 'Mombasa Road', 'Sameer', 400),
  ('Zone E', 'Mombasa Road', 'G.M', 400),
  ('Zone E', 'Mombasa Road', 'Imara Daima', 400),
  ('Zone E', 'Mombasa Road', 'Cabanas', 400),
  ('Zone E', 'Mombasa Road', 'Southfield Mall', 400),
  ('Zone E', 'Mombasa Road', 'Airport North Road', 400),
  ('Zone E', 'Mombasa Road', 'Gateway Mall', 500),
  ('Zone E', 'Mombasa Road', 'Syokimau', 500),
  ('Zone E', 'Mombasa Road', 'Mlolongo', 600),
  ('Zone E', 'Mombasa Road', 'JKIA', 500),
  ('Zone E', 'Mombasa Road', 'Athi River', 800),
  ('Zone E', 'Mombasa Road', 'Kitengela', 800),
  ('Zone E', 'Mombasa Road', 'Lukenya', 1000);

-- Zone F - Jogoo Road
insert into public.delivery_zones (zone_name, zone_label, area_name, fee) values
  ('Zone F', 'Jogoo Road', 'City Stadium', 250),
  ('Zone F', 'Jogoo Road', 'Shauri Moyo', 300),
  ('Zone F', 'Jogoo Road', 'Makadara', 300),
  ('Zone F', 'Jogoo Road', 'Bahati', 300),
  ('Zone F', 'Jogoo Road', 'Makongeni', 300),
  ('Zone F', 'Jogoo Road', 'Mbotela', 300),
  ('Zone F', 'Jogoo Road', 'Hamza', 300),
  ('Zone F', 'Jogoo Road', 'Lumumba', 400),
  ('Zone F', 'Jogoo Road', 'Jericho', 400);

-- Zone G - Langata Road
insert into public.delivery_zones (zone_name, zone_label, area_name, fee) values
  ('Zone G', 'Langata Road', 'Strathmore', 300),
  ('Zone G', 'Langata Road', 'T-Mall', 300),
  ('Zone G', 'Langata Road', 'Madaraka', 300),
  ('Zone G', 'Langata Road', 'Mbagathi', 300),
  ('Zone G', 'Langata Road', 'Highrise', 300),
  ('Zone G', 'Langata Road', 'Wilson', 300),
  ('Zone G', 'Langata Road', 'Langata', 400),
  ('Zone G', 'Langata Road', 'Carnivore', 400),
  ('Zone G', 'Langata Road', 'PR Stop', 300),
  ('Zone G', 'Langata Road', 'Galleria', 500),
  ('Zone G', 'Langata Road', 'Ongata Rongai', 650);

-- Zone H - Outer Ring Road
insert into public.delivery_zones (zone_name, zone_label, area_name, fee) values
  ('Zone H', 'Outer Ring Road', 'Lucky Summer', 350),
  ('Zone H', 'Outer Ring Road', 'Baba Dogo', 300),
  ('Zone H', 'Outer Ring Road', 'Buruburu', 300),
  ('Zone H', 'Outer Ring Road', 'Donholm', 350),
  ('Zone H', 'Outer Ring Road', 'Uhuru Estate', 400),
  ('Zone H', 'Outer Ring Road', 'Kariobangi North', 400),
  ('Zone H', 'Outer Ring Road', 'Pioneer Estate', 400),
  ('Zone H', 'Outer Ring Road', 'Fedha', 400),
  ('Zone H', 'Outer Ring Road', 'Tassia', 400),
  ('Zone H', 'Outer Ring Road', 'Savannah', 400),
  ('Zone H', 'Outer Ring Road', 'Pipeline', 400),
  ('Zone H', 'Outer Ring Road', 'Mutindwa', 400),
  ('Zone H', 'Outer Ring Road', 'Umoja 1& 2', 400),
  ('Zone H', 'Outer Ring Road', 'Obama', 400),
  ('Zone H', 'Outer Ring Road', 'Komarock', 500),
  ('Zone H', 'Outer Ring Road', 'Embakasi', 400),
  ('Zone H', 'Outer Ring Road', 'Baraka', 500),
  ('Zone H', 'Outer Ring Road', 'Nyayo Estate', 500),
  ('Zone H', 'Outer Ring Road', 'Saika', 500),
  ('Zone H', 'Outer Ring Road', 'Mihango', 500),
  ('Zone H', 'Outer Ring Road', 'Njiru', 500),
  ('Zone H', 'Outer Ring Road', 'Utawala', 600),
  ('Zone H', 'Outer Ring Road', 'Ruai', 800),
  ('Zone H', 'Outer Ring Road', 'Kamulu', 1200);

-- Zone I - Kiambu Road
insert into public.delivery_zones (zone_name, zone_label, area_name, fee) values
  ('Zone I', 'Kiambu Road', 'DCI', 300),
  ('Zone I', 'Kiambu Road', 'Balozi Estate', 300),
  ('Zone I', 'Kiambu Road', 'Muthaiga North', 300),
  ('Zone I', 'Kiambu Road', 'Ridgeways', 300),
  ('Zone I', 'Kiambu Road', 'Fourways', 300),
  ('Zone I', 'Kiambu Road', 'Delta', 350),
  ('Zone I', 'Kiambu Road', 'Quickmart', 400),
  ('Zone I', 'Kiambu Road', 'Runda', 400),
  ('Zone I', 'Kiambu Road', 'Thindigua', 400),
  ('Zone I', 'Kiambu Road', 'Edenville', 400),
  ('Zone I', 'Kiambu Road', 'Kirigiti', 400),
  ('Zone I', 'Kiambu Road', 'Kamiti Road', 500),
  ('Zone I', 'Kiambu Road', 'Kiambu Town', 600);
