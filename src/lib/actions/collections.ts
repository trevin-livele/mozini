'use server';

import { createClient } from '@/lib/supabase/server';
import { isAdmin } from './auth';
import type { Product } from '@/lib/supabase/types';

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CollectionWithProducts extends Collection {
  product_ids: number[];
}

export async function getCollections(): Promise<Collection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data || []) as Collection[];
}

export async function getAllCollections(): Promise<CollectionWithProducts[]> {
  if (!(await isAdmin())) throw new Error('Unauthorized');
  const supabase = await createClient();
  const { data: cols, error } = await supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  const collections = (cols || []) as Collection[];
  const result: CollectionWithProducts[] = [];

  for (const col of collections) {
    const { data: items } = await supabase
      .from('collection_products')
      .select('product_id')
      .eq('collection_id', col.id);
    result.push({ ...col, product_ids: ((items || []) as { product_id: number }[]).map(i => i.product_id) });
  }
  return result;
}

export async function createCollection(input: { name: string; description?: string; image_url?: string }) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };
  const supabase = await createClient();
  const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const { data, error } = await supabase.from('collections').insert({
    name: input.name.trim(),
    slug,
    description: input.description || null,
    image_url: input.image_url || null,
  } as any).select('id').single();

  if (error) return { error: error.message };
  return { success: true, id: (data as any)?.id };
}

export async function updateCollection(id: number, updates: Partial<{ name: string; description: string; image_url: string; is_active: boolean }>) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };
  const supabase = await createClient();
  const payload: Record<string, any> = {};
  if (updates.name !== undefined) payload.name = updates.name.trim();
  if (updates.description !== undefined) payload.description = updates.description || null;
  if (updates.image_url !== undefined) payload.image_url = updates.image_url || null;
  if (updates.is_active !== undefined) payload.is_active = updates.is_active;
  const { error } = await supabase.from('collections').update(payload as any).eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteCollection(id: number) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };
  const supabase = await createClient();
  const { error } = await supabase.from('collections').delete().eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function addProductToCollection(collectionId: number, productId: number) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };
  const supabase = await createClient();
  const { error } = await supabase.from('collection_products').insert({
    collection_id: collectionId,
    product_id: productId,
  } as any);
  if (error) {
    if (error.code === '23505') return { error: 'Product already in this collection' };
    return { error: error.message };
  }
  return { success: true };
}

export async function removeProductFromCollection(collectionId: number, productId: number) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };
  const supabase = await createClient();
  const { error } = await supabase.from('collection_products').delete().eq('collection_id', collectionId).eq('product_id', productId);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getCollectionProducts(slug: string) {
  const supabase = await createClient();
  const { data: col } = await supabase
    .from('collections')
    .select('id, name, description, image_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  if (!col) return null;

  const colData = col as any;
  const { data: items } = await supabase
    .from('collection_products')
    .select('product_id')
    .eq('collection_id', colData.id);

  // Fetch full product data for each product_id
  const productIds = ((items || []) as { product_id: number }[]).map(i => i.product_id);
  if (productIds.length === 0) return { ...colData, products: [] };

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds)
    .eq('is_active', true);

  return {
    ...colData,
    products: (products || []) as Product[],
  };
}
