-- ============================================
-- Mozini E-Commerce: Supabase Database Schema
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. PROFILES (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  address text,
  city text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- 2. PRODUCTS
-- ============================================
create table public.products (
  id serial primary key,
  name text not null,
  brand text not null default 'Mozini',
  category text not null,
  price integer not null check (price > 0),
  old_price integer not null default 0,
  icon text not null default '🎁',
  image_url text,
  badge text not null default '',
  tag text not null default '',
  description text not null default '',
  stock integer not null default 100 check (stock >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_category on public.products(category);
create index idx_products_tag on public.products(tag);
create index idx_products_is_active on public.products(is_active);

-- ============================================
-- 3. CART ITEMS
-- ============================================
create table public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id integer references public.products(id) on delete cascade not null,
  quantity integer not null default 1 check (quantity > 0 and quantity <= 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create index idx_cart_items_user on public.cart_items(user_id);

-- ============================================
-- 4. ORDERS
-- ============================================
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal integer not null check (subtotal >= 0),
  shipping integer not null default 0,
  total integer not null check (total >= 0),
  payment_method text not null default 'mpesa',
  shipping_name text not null,
  shipping_email text not null,
  shipping_phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  notes text,
  idempotency_key text unique, -- prevent duplicate orders
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_user on public.orders(user_id);
create index idx_orders_status on public.orders(status);
create index idx_orders_idempotency on public.orders(idempotency_key);

-- ============================================
-- 5. ORDER ITEMS
-- ============================================
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id integer references public.products(id) on delete set null,
  product_name text not null,
  product_icon text not null default '🎁',
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price > 0),
  created_at timestamptz not null default now()
);

create index idx_order_items_order on public.order_items(order_id);

-- ============================================
-- 6. WISHLIST
-- ============================================
create table public.wishlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id integer references public.products(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create index idx_wishlists_user on public.wishlists(user_id);

-- ============================================
-- 7. UPDATED_AT TRIGGER
-- ============================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.products
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.cart_items
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.orders
  for each row execute function public.update_updated_at();
