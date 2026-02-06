'use server';

import { createClient } from '@/lib/supabase/server';
import { toProductCompat, type ProductCompat } from '@/lib/supabase/types';

export type CartItemWithProduct = {
  id: string;
  product_id: number;
  quantity: number;
  product: ProductCompat;
};

export async function getCart(): Promise<CartItemWithProduct[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('cart_items')
    .select('id, product_id, quantity, products(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch cart: ${error.message}`);

  return (data || [])
    .filter((item) => item.products)
    .map((item) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      product: toProductCompat(item.products as any),
    }));
}

export async function addToCart(productId: number, quantity = 1) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to add to cart');

  // Check if item already in cart
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single();

  if (existing) {
    const newQty = Math.min(20, existing.quantity + quantity);
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQty })
      .eq('id', existing.id);
    if (error) throw new Error(`Failed to update cart: ${error.message}`);
  } else {
    const { error } = await supabase
      .from('cart_items')
      .insert({ user_id: user.id, product_id: productId, quantity });
    if (error) throw new Error(`Failed to add to cart: ${error.message}`);
  }
}

export async function updateCartItemQty(cartItemId: string, quantity: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  const clampedQty = Math.max(1, Math.min(20, quantity));

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity: clampedQty })
    .eq('id', cartItemId)
    .eq('user_id', user.id);

  if (error) throw new Error(`Failed to update quantity: ${error.message}`);
}

export async function removeFromCart(cartItemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)
    .eq('user_id', user.id);

  if (error) throw new Error(`Failed to remove from cart: ${error.message}`);
}

export async function clearCart() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id);
}
