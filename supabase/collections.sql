-- ============================================
-- COLLECTIONS (dynamic product groupings like Valentine's Day, Women's Day)
-- ============================================

create table if not exists public.collections (
  id serial primary key,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collection_products (
  id serial primary key,
  collection_id integer references public.collections(id) on delete cascade not null,
  product_id integer references public.products(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(collection_id, product_id)
);

create index idx_collections_slug on public.collections(slug);
create index idx_collections_active on public.collections(is_active);
create index idx_collection_products_col on public.collection_products(collection_id);
create index idx_collection_products_prod on public.collection_products(product_id);

-- Updated_at trigger
create trigger set_updated_at before update on public.collections
  for each row execute function public.update_updated_at();

-- RLS
alter table public.collections enable row level security;
alter table public.collection_products enable row level security;

create policy "Anyone can read active collections"
  on public.collections for select using (is_active = true);

create policy "Admins can manage collections"
  on public.collections for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin')));

create policy "Anyone can read collection products"
  on public.collection_products for select using (true);

create policy "Admins can manage collection products"
  on public.collection_products for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin')));
