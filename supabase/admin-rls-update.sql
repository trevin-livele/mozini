-- ============================================
-- Additional RLS Policy for Admin Product Access
-- Run this to allow admins to see all products (including inactive)
-- ============================================

-- Allow admins to view ALL products (including inactive)
create policy "Admins can view all products"
  on public.products for select
  using (public.is_admin());
