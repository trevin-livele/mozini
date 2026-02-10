// Types used across the app — data comes from Supabase
export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number;
  icon: string;
  image_url?: string | null;
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
  image?: string;
  subcategories?: { name: string; image?: string }[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    name: 'Gents Watches',
    icon: '⌚',
    image: '/images/curren/image00001.jpeg',
    subcategories: [
      { name: 'Curren', image: '/images/curren/image00001.jpeg' },
      { name: 'Naviforce', image: '/images/naviforce/image00001.jpeg' },
      { name: 'Poedagar', image: '/images/poedagar/image00001.jpeg' },
    ],
  },
  {
    name: 'Ladies Watches',
    icon: '⌚',
    image: '/images/hannah-martin/image00001.jpeg',
    subcategories: [
      { name: 'Hannah Martin', image: '/images/hannah-martin/image00001.jpeg' },
    ],
  },
  {
    name: 'Kids Watches',
    icon: '⌚',
  },
  {
    name: 'Gifts',
    icon: '🎁',
    image: '/images/gift-cards/image00001.jpeg',
    subcategories: [
      { name: 'Flower Bouquet' },
      { name: 'Watch Gift Sets' },
      { name: 'Hoodie' },
      { name: 'Sweatshirts' },
      { name: 'Engraved Keychain' },
      { name: 'Personalized Mugs' },
      { name: 'Gift Cards', image: '/images/gift-cards/image00001.jpeg' },
      { name: 'Personalized Box' },
    ],
  },
  {
    name: 'Jewelry',
    icon: '💍',
    image: '/images/necklaces/image00001.jpeg',
  },
  {
    name: 'Drinks & Candy',
    icon: '🍫',
    subcategories: [
      { name: 'Wine Stickers' },
      { name: 'Wine with Personalized Wine Sticker' },
      { name: 'Chocolate with Personalized Message' },
    ],
  },
];

// Flat list of all category names (top-level + subcategories)
export const CATEGORY_NAMES: string[] = CATEGORIES.flatMap((c) =>
  c.subcategories ? [c.name, ...c.subcategories.map((s) => s.name)] : [c.name]
);

// Just the top-level names
export const TOP_LEVEL_CATEGORIES: string[] = CATEGORIES.map((c) => c.name);

// Icon lookup
const categoryIconMap: Record<string, string> = {};
CATEGORIES.forEach((c) => {
  categoryIconMap[c.name] = c.icon;
  c.subcategories?.forEach((sub) => {
    categoryIconMap[sub.name] = c.icon;
  });
});

export function getCategoryIcon(name: string): string {
  return categoryIconMap[name] || '🛍️';
}

// Image lookup
const categoryImageMap: Record<string, string> = {};
CATEGORIES.forEach((c) => {
  if (c.image) categoryImageMap[c.name] = c.image;
  c.subcategories?.forEach((sub) => {
    if (sub.image) categoryImageMap[sub.name] = sub.image;
  });
});

export function getCategoryImage(name: string): string | undefined {
  return categoryImageMap[name];
}
