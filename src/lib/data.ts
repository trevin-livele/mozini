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

export const products: Product[] = [
  // Watches
  { id: 1, name: "Classic Gold Men's Watch", brand: "Mozini", category: "Men's Watches", price: 4500, oldPrice: 6500, icon: "⌚", badge: "sale", tag: "featured", desc: "Elegant gold-tone men's watch with stainless steel band. Water resistant, perfect for everyday wear." },
  { id: 2, name: "Rose Gold Ladies Watch", brand: "Mozini", category: "Women's Watches", price: 3800, oldPrice: 0, icon: "⌚", badge: "", tag: "featured", desc: "Beautiful rose gold ladies watch with crystal accents. Delicate and stylish for any occasion." },
  { id: 3, name: "Sports Digital Watch", brand: "Mozini", category: "Men's Watches", price: 2500, oldPrice: 3200, icon: "⌚", badge: "sale", tag: "featured", desc: "Multi-function digital sports watch with stopwatch, alarm, and backlight. Perfect for active lifestyles." },
  { id: 4, name: "Minimalist Silver Watch", brand: "Mozini", category: "Unisex Watches", price: 3200, oldPrice: 0, icon: "⌚", badge: "", tag: "featured", desc: "Clean minimalist design with genuine leather strap. Timeless elegance for him or her." },
  { id: 5, name: "Luxury Chronograph Watch", brand: "Mozini", category: "Men's Watches", price: 7500, oldPrice: 9000, icon: "⌚", badge: "sale", tag: "best", desc: "Premium chronograph with date display and luminous hands. Statement piece for the distinguished gentleman." },
  { id: 6, name: "Diamond Accent Ladies Watch", brand: "Mozini", category: "Women's Watches", price: 5500, oldPrice: 0, icon: "⌚", badge: "hot", tag: "best", desc: "Stunning ladies watch with genuine diamond accents. Luxury meets everyday elegance." },
  { id: 7, name: "Vintage Leather Watch", brand: "Mozini", category: "Men's Watches", price: 3000, oldPrice: 3500, icon: "⌚", badge: "sale", tag: "best", desc: "Classic vintage-inspired design with genuine brown leather strap. Timeless sophistication." },
  { id: 8, name: "Smart Casual Watch", brand: "Mozini", category: "Unisex Watches", price: 2800, oldPrice: 0, icon: "⌚", badge: "", tag: "best", desc: "Versatile watch that transitions from office to weekend. Mesh band in brushed silver." },
  
  // Perfumes
  { id: 9, name: "Oud Royale Perfume 100ml", brand: "Mozini", category: "Men's Perfumes", price: 4500, oldPrice: 5500, icon: "🧴", badge: "sale", tag: "new", desc: "Rich Arabian oud fragrance with notes of sandalwood and amber. Long-lasting luxury scent." },
  { id: 10, name: "Floral Dreams EDP 50ml", brand: "Mozini", category: "Women's Perfumes", price: 3200, oldPrice: 0, icon: "🌸", badge: "", tag: "new", desc: "Delicate floral bouquet with jasmine, rose, and lily. Fresh and feminine all day." },
  { id: 11, name: "Ocean Breeze Cologne 100ml", brand: "Mozini", category: "Men's Perfumes", price: 2800, oldPrice: 3500, icon: "🧴", badge: "sale", tag: "new", desc: "Fresh aquatic fragrance with citrus top notes. Perfect for the modern man." },
  { id: 12, name: "Vanilla Musk Perfume 50ml", brand: "Mozini", category: "Women's Perfumes", price: 3500, oldPrice: 0, icon: "🌸", badge: "hot", tag: "new", desc: "Warm vanilla and musk blend. Sensual and captivating evening fragrance." },
  { id: 13, name: "Black Intense EDT 100ml", brand: "Mozini", category: "Men's Perfumes", price: 3800, oldPrice: 4500, icon: "🧴", badge: "sale", tag: "featured", desc: "Bold and mysterious with leather and spice notes. Make a lasting impression." },
  { id: 14, name: "Cherry Blossom EDP 75ml", brand: "Mozini", category: "Women's Perfumes", price: 4200, oldPrice: 0, icon: "🌸", badge: "", tag: "best", desc: "Light cherry blossom with hints of peach. Fresh, youthful, and irresistible." },
  
  // Gift Sets
  { id: 15, name: "Men's Watch & Perfume Set", brand: "Mozini", category: "Gift Sets", price: 6500, oldPrice: 8000, icon: "🎁", badge: "sale", tag: "featured", desc: "Perfect gift combo: Classic watch paired with Oud Royale perfume in premium gift box." },
  { id: 16, name: "Ladies Gift Collection", brand: "Mozini", category: "Gift Sets", price: 5800, oldPrice: 0, icon: "🎁", badge: "hot", tag: "best", desc: "Elegant ladies watch with matching perfume. Beautifully packaged for gifting." },
];

export const categories: Category[] = [
  { name: "Men's Watches", icon: "⌚", count: 5 },
  { name: "Women's Watches", icon: "⌚", count: 3 },
  { name: "Unisex Watches", icon: "⌚", count: 2 },
  { name: "Men's Perfumes", icon: "🧴", count: 3 },
  { name: "Women's Perfumes", icon: "🌸", count: 3 },
  { name: "Gift Sets", icon: "🎁", count: 2 },
];

export const formatPrice = (n: number) => 'KES ' + n.toLocaleString();
