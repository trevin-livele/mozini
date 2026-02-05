'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './data';

export interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  icon: string;
  qty: number;
}

interface StoreState {
  cart: CartItem[];
  wishlist: number[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: number) => void;
  updateCartQty: (id: number, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      
      addToCart: (product, qty = 1) => {
        set((state) => {
          const existing = state.cart.find((i) => i.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.id === product.id ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return {
            cart: [
              ...state.cart,
              {
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                icon: product.icon,
                qty,
              },
            ],
          };
        });
      },
      
      removeFromCart: (id) => {
        set((state) => ({ cart: state.cart.filter((i) => i.id !== id) }));
      },
      
      updateCartQty: (id, delta) => {
        set((state) => ({
          cart: state.cart.map((i) => {
            if (i.id === id) {
              const newQty = Math.max(1, Math.min(20, i.qty + delta));
              return { ...i, qty: newQty };
            }
            return i;
          }),
        }));
      },
      
      clearCart: () => set({ cart: [] }),
      
      toggleWishlist: (id) => {
        set((state) => {
          const exists = state.wishlist.includes(id);
          return {
            wishlist: exists
              ? state.wishlist.filter((i) => i !== id)
              : [...state.wishlist, id],
          };
        });
      },
      
      isInWishlist: (id) => get().wishlist.includes(id),
      
      getCartTotal: () => get().cart.reduce((sum, i) => sum + i.price * i.qty, 0),
      
      getCartCount: () => get().cart.reduce((sum, i) => sum + i.qty, 0),
    }),
    {
      name: 'mozini-store',
    }
  )
);
