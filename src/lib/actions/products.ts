'use server';

import { createClient } from '@/lib/supabase/server';
import { toProductCompat, type ProductCompat } from '@/lib/supabase/types';

const PAGE_SIZE = 12;

export async function getProducts(options?: {
  category?: string;
  tag?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: ProductCompat[]; total: number }> {
  const supabase = await createClient();
  const { category, tag, search, sortBy, page = 1, limit = PAGE_SIZE } = options || {};

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  if (category) query = query.eq('category', category);
  if (tag) query = query.eq('tag', tag);
  if (search) query = query.ilike('name', `%${search}%`);

  // Sorting
  if (sortBy === 'price-asc') query = query.order('price', { ascending: true });
  else if (sortBy === 'price-desc') query = query.order('price', { ascending: false });
  else if (sortBy === 'name') query = query.order('name', { ascending: true });
  else query = query.order('created_at', { ascending: false });

  // Pagination
  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

  const { data, error, count } = await query;

  if (error) throw new Error(`Failed to fetch products: ${error.message}`);

  return {
    products: (data || []).map(toProductCompat),
    total: count || 0,
  };
}

export async function getProductById(id: number): Promise<ProductCompat | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return toProductCompat(data);
}

export async function getCategories(): Promise<{ name: string; count: number }[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('is_active', true);

  if (error) throw new Error(`Failed to fetch categories: ${error.message}`);

  const counts: Record<string, number> = {};
  (data || []).forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

export async function getRelatedProducts(
  category: string,
  excludeId: number,
  limit = 4
): Promise<ProductCompat[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .neq('id', excludeId)
    .limit(limit);

  if (error) return [];
  return (data || []).map(toProductCompat);
}
