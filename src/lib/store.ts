'use client';

import { create } from 'zustand';
import type { Product } from './data';
import { addToCart as addToCartServer, removeFromCart as removeFromCartServer, updateCartItemQty, getCart, clearCart as clearCartServer } from './actions/cart';
import { toggleWishlistItem, getWishlistIds } from './actions/wishlist';

export interface CartItem {
  cartItemId: string; // Supabase cart_items.id
  id: number;         // product_id
  name: string;
  brand: string;
  price: number;
  icon: string;
  qty: number;
}

interface StoreState {
  cart: CartItem[];
  wishlist: number[];
  loading: boolean;
  // Sync from Supabase
  syncCart: () => Promise<void>;
  syncWishlist: () => Promise<void>;
  // Cart actions (call Supabase then sync)
  addToCart: (product: Product, qty?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateCartQty: (cartItemId: string, newQty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  // Wishlist actions
  toggleWishlist: (productId: number) => Promise<void>;
  isInWishlist: (id: number) => boolean;
  // Computed
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useStore = create<StoreState>()((set, get) => ({
  cart: [],
  wishlist: [],
  loading: false,

  syncCart: async () => {
    try {
      const items = await getCart();
      set({
        cart: items.map((item) => ({
          cartItemId: item.id,
          id: item.product_id,
          name: item.product.name,
          brand: item.product.brand,
          price: item.product.price,
          icon: item.product.icon,
          qty: item.quantity,
        })),
      });
    } catch {
      // Not logged in or error — empty cart
      set({ cart: [] });
    }
  },

  syncWishlist: async () => {
    try {
      const ids = await getWishlistIds();
      set({ wishlist: ids });
    } catch {
      set({ wishlist: [] });
    }
  },

  addToCart: async (product, qty = 1) => {
    set({ loading: true });
    try {
      await addToCartServer(product.id, qty);
      await get().syncCart();
    } finally {
      set({ loading: false });
    }
  },

  removeFromCart: async (cartItemId) => {
    set({ loading: true });
    try {
      await removeFromCartServer(cartItemId);
      await get().syncCart();
    } finally {
      set({ loading: false });
    }
  },

  updateCartQty: async (cartItemId, newQty) => {
    set({ loading: true });
    try {
      await updateCartItemQty(cartItemId, newQty);
      await get().syncCart();
    } finally {
      set({ loading: false });
    }
  },

  clearCart: async () => {
    try {
      await clearCartServer();
      set({ cart: [] });
    } catch {
      set({ cart: [] });
    }
  },

  toggleWishlist: async (productId) => {
    try {
      await toggleWishlistItem(productId);
      await get().syncWishlist();
    } catch {
      // Not logged in — ignore
    }
  },

  isInWishlist: (id) => get().wishlist.includes(id),

  getCartTotal: () => get().cart.reduce((sum, i) => sum + i.price * i.qty, 0),

  getCartCount: () => get().cart.reduce((sum, i) => sum + i.qty, 0),
}));
