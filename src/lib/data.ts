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

// Category icon mapping (since DB doesn't store icons for categories)
const categoryIcons: Record<string, string> = {
  "Men's Watches": '⌚',
  "Women's Watches": '⌚',
  "Unisex Watches": '⌚',
  "Men's Perfumes": '🧴',
  "Women's Perfumes": '🌸',
  "Gift Sets": '🎁',
};

export function getCategoryIcon(name: string): string {
  return categoryIcons[name] || '🛍️';
}
