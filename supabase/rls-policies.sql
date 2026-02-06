-- ============================================
-- Row Level Security Policies
-- ============================================
-- IMPORTANT: Run this AFTER schema.sql

-- ============================================
-- Helper function to check admin role
-- SECURITY DEFINER bypasses RLS, breaking the recursion
-- ============================================
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlists enable row level security;

-- ============================================
-- PROFILES
-- ============================================
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

-- ============================================
-- PRODUCTS (public read, admin write)
-- ============================================
create policy "Anyone can view active products"
  on public.products for select
  using (is_active = true);

create policy "Admins can insert products"
  on public.products for insert
  with check (public.is_admin());

create policy "Admins can update products"
  on public.products for update
  using (public.is_admin());

create policy "Admins can delete products"
  on public.products for delete
  using (public.is_admin());

-- ============================================
-- CART ITEMS (user owns their cart)
-- ============================================
create policy "Users can view own cart"
  on public.cart_items for select
  using (auth.uid() = user_id);

create policy "Users can add to own cart"
  on public.cart_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own cart"
  on public.cart_items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete from own cart"
  on public.cart_items for delete
  using (auth.uid() = user_id);

-- ============================================
-- ORDERS (user owns their orders)
-- ============================================
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can create own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all orders"
  on public.orders for select
  using (public.is_admin());

create policy "Admins can update all orders"
  on public.orders for update
  using (public.is_admin());

-- ============================================
-- ORDER ITEMS
-- ============================================
create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Users can insert own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Admins can view all order items"
  on public.order_items for select
  using (public.is_admin());

-- ============================================
-- WISHLISTS
-- ============================================
create policy "Users can view own wishlist"
  on public.wishlists for select
  using (auth.uid() = user_id);

create policy "Users can add to own wishlist"
  on public.wishlists for insert
  with check (auth.uid() = user_id);

create policy "Users can remove from own wishlist"
  on public.wishlists for delete
  using (auth.uid() = user_id);

-- ============================================
-- STORAGE: Product Images Bucket
-- ============================================
-- Run in Supabase Dashboard > Storage > Create bucket "product-images" (public)
-- Then apply these policies:

-- create policy "Public read product images"
--   on storage.objects for select
--   using (bucket_id = 'product-images');

-- create policy "Admins can upload product images"
--   on storage.objects for insert
--   with check (bucket_id = 'product-images' and public.is_admin());

-- create policy "Admins can delete product images"
--   on storage.objects for delete
--   using (bucket_id = 'product-images' and public.is_admin());
