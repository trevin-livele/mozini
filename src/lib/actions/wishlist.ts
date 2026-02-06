'use server';

import { createClient } from '@/lib/supabase/server';
import { toProductCompat, type ProductCompat } from '@/lib/supabase/types';

export async function getWishlist(): Promise<ProductCompat[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('wishlists')
    .select('product_id, products(*)')
    .eq('user_id', user.id);

  if (error) return [];

  return (data || [])
    .filter((item) => item.products)
    .map((item) => toProductCompat(item.products as any));
}

export async function getWishlistIds(): Promise<number[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', user.id);

  return (data || []).map((w) => w.product_id);
}

export async function toggleWishlistItem(productId: number): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  // Check if already in wishlist
  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single();

  if (existing) {
    await supabase.from('wishlists').delete().eq('id', existing.id);
    return false; // removed
  } else {
    await supabase.from('wishlists').insert({ user_id: user.id, product_id: productId });
    return true; // added
  }
}
