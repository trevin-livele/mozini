// Types used across the app — data comes from Supabase
export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number;
  icon: string;
  badge: string;
  tag: string;
  desc: string;
}

export interface Category {
  name: string;
  icon: string;
  count: number;
}

export const formatPrice = (n: number) => 'KES ' + n.toLocaleString();

// ============================================
// CATEGORIES — single source of truth
// ============================================
export interface CategoryDef {
  name: string;
  icon: string;
  subcategories?: string[];
}

export const CATEGORIES: CategoryDef[] = [
  { name: 'Gents Watches', icon: '⌚' },
  { name: 'Ladies Watches', icon: '⌚' },
  { name: 'Kids Watches', icon: '⌚' },
  {
    name: 'Gifts',
    icon: '🎁',
    subcategories: [
      'Flower Bouquet',
      'Watch Gift Sets',
      'Hoodie',
      'Sweatshirts',
      'Engraved Keychain',
      'Personalized Mugs',
      'Gift Cards',
      'Personalized Box',
    ],
  },
  { name: 'Jewelry', icon: '💍' },
  {
    name: 'Drinks & Candy',
    icon: '🍫',
    subcategories: [
      'Wine Stickers',
      'Wine with Personalized Wine Sticker',
      'Chocolate with Personalized Message',
    ],
  },
];

// Flat list of all category names (top-level + subcategories)
export const CATEGORY_NAMES: string[] = CATEGORIES.flatMap((c) =>
  c.subcategories ? [c.name, ...c.subcategories] : [c.name]
);

// Just the top-level names
export const TOP_LEVEL_CATEGORIES: string[] = CATEGORIES.map((c) => c.name);

// Icon lookup
const categoryIconMap: Record<string, string> = {};
CATEGORIES.forEach((c) => {
  categoryIconMap[c.name] = c.icon;
  c.subcategories?.forEach((sub) => { categoryIconMap[sub] = c.icon; });
});

export function getCategoryIcon(name: string): string {
  return categoryIconMap[name] || '🛍️';
}
