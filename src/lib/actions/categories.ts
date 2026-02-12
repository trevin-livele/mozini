'use server';

import { createClient } from '@/lib/supabase/server';
import { isAdmin } from './auth';

export interface CategoryRow {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  icon: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryTree {
  id: number;
  name: string;
  slug: string;
  icon: string;
  image_url: string | null;
  sort_order: number;
  children: CategoryTree[];
}

/** Fetch all active categories as a tree (for storefront) */
export async function getCategoryTree(): Promise<CategoryTree[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .order('name');

  if (error || !data) return [];
  return buildTree(data as CategoryRow[], null);
}

/** Fetch flat list of all categories (for admin) */
export async function getAllCategories(): Promise<CategoryRow[]> {
  if (!(await isAdmin())) throw new Error('Unauthorized');
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
    .order('name');

  if (error) throw new Error(error.message);
  return (data || []) as CategoryRow[];
}

/** Get all category names (flat, for product assignment) */
export async function getCategoryNames(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('categories')
    .select('name')
    .eq('is_active', true)
    .order('sort_order')
    .order('name');

  return (data || []).map((c) => c.name);
}

/**
 * Resolve a category name to itself + all descendant names.
 * Used for filtering products by parent category.
 */
export async function resolveCategoryNames(name: string): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('categories')
    .select('id, name, parent_id')
    .eq('is_active', true);

  if (!data) return [name];

  const rows = data as { id: number; name: string; parent_id: number | null }[];
  const target = rows.find((r) => r.name === name);
  if (!target) return [name];

  // Collect all descendants recursively
  const names = [target.name];
  const collectChildren = (parentId: number) => {
    for (const row of rows) {
      if (row.parent_id === parentId) {
        names.push(row.name);
        collectChildren(row.id);
      }
    }
  };
  collectChildren(target.id);
  return names;
}
/**
 * Get top-level categories with aggregated product counts.
 * Counts include products in all descendant categories.
 * Used for the homepage "Shop With Us" section.
 */
export async function getTopLevelCategoriesWithCounts(): Promise<
  { id: number; name: string; slug: string; icon: string; image_url: string | null; count: number }[]
> {
  const supabase = await createClient();

  // Fetch all active categories
  const { data: catRows } = await supabase
    .from('categories')
    .select('id, name, slug, icon, image_url, parent_id, sort_order')
    .eq('is_active', true)
    .order('sort_order');

  if (!catRows) return [];

  const cats = catRows as { id: number; name: string; slug: string; icon: string; image_url: string | null; parent_id: number | null; sort_order: number }[];

  // Top-level = parent_id is null
  const topLevel = cats.filter((c) => c.parent_id === null);

  // Collect all descendant names for each top-level category
  const collectDescendantNames = (parentId: number): string[] => {
    const names: string[] = [];
    for (const c of cats) {
      if (c.parent_id === parentId) {
        names.push(c.name);
        names.push(...collectDescendantNames(c.id));
      }
    }
    return names;
  };

  // Fetch product category counts
  const { data: products } = await supabase
    .from('products')
    .select('category')
    .eq('is_active', true);

  const productCounts: Record<string, number> = {};
  for (const p of products || []) {
    productCounts[p.category] = (productCounts[p.category] || 0) + 1;
  }

  return topLevel.map((tl) => {
    const allNames = [tl.name, ...collectDescendantNames(tl.id)];
    const count = allNames.reduce((sum, n) => sum + (productCounts[n] || 0), 0);
    return { id: tl.id, name: tl.name, slug: tl.slug, icon: tl.icon, image_url: tl.image_url, count };
  });
}

/** Add a category */
export async function addCategory(input: {
  name: string;
  slug: string;
  parent_id: number | null;
  icon: string;
  image_url?: string | null;
  sort_order?: number;
}) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };
  const supabase = await createClient();

  const { error } = await supabase.from('categories').insert({
    name: input.name.trim(),
    slug: input.slug.trim().toLowerCase().replace(/\s+/g, '-'),
    parent_id: input.parent_id || null,
    icon: input.icon || '🛍️',
    image_url: input.image_url || null,
    sort_order: input.sort_order ?? 0,
  });

  if (error) {
    if (error.code === '23505') return { error: 'A category with this slug already exists' };
    return { error: error.message };
  }
  return { success: true };
}

/** Update a category */
export async function updateCategory(
  id: number,
  updates: Partial<{
    name: string;
    slug: string;
    parent_id: number | null;
    icon: string;
    image_url: string | null;
    sort_order: number;
    is_active: boolean;
  }>
) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };
  const supabase = await createClient();

  const payload: Record<string, any> = {};
  if (updates.name !== undefined) payload.name = updates.name.trim();
  if (updates.slug !== undefined) payload.slug = updates.slug.trim().toLowerCase().replace(/\s+/g, '-');
  if (updates.parent_id !== undefined) payload.parent_id = updates.parent_id || null;
  if (updates.icon !== undefined) payload.icon = updates.icon;
  if (updates.image_url !== undefined) payload.image_url = updates.image_url || null;
  if (updates.sort_order !== undefined) payload.sort_order = updates.sort_order;
  if (updates.is_active !== undefined) payload.is_active = updates.is_active;

  const { error } = await supabase.from('categories').update(payload).eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}

/** Delete a category (cascades to children) */
export async function deleteCategory(id: number) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };
  const supabase = await createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}

function buildTree(rows: CategoryRow[], parentId: number | null): CategoryTree[] {
  return rows
    .filter((r) => r.parent_id === parentId)
    .map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      icon: r.icon,
      image_url: r.image_url,
      sort_order: r.sort_order,
      children: buildTree(rows, r.id),
    }));
}
