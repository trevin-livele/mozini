export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          role: 'customer' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          role?: 'customer' | 'admin';
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
        };
      };
      products: {
        Row: {
          id: number;
          name: string;
          brand: string;
          category: string;
          price: number;
          old_price: number;
          icon: string;
          image_url: string | null;
          badge: string;
          tag: string;
          description: string;
          stock: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          brand?: string;
          category: string;
          price: number;
          old_price?: number;
          icon?: string;
          image_url?: string | null;
          badge?: string;
          tag?: string;
          description?: string;
          stock?: number;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          brand?: string;
          category?: string;
          price?: number;
          old_price?: number;
          icon?: string;
          image_url?: string | null;
          badge?: string;
          tag?: string;
          description?: string;
          stock?: number;
          is_active?: boolean;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: number;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          product_id: number;
          quantity?: number;
        };
        Update: {
          quantity?: number;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          subtotal: number;
          shipping: number;
          total: number;
          payment_method: string;
          shipping_name: string;
          shipping_email: string;
          shipping_phone: string;
          shipping_address: string;
          shipping_city: string;
          notes: string | null;
          idempotency_key: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id?: string | null;
          status?: string;
          subtotal: number;
          shipping: number;
          total: number;
          payment_method?: string;
          shipping_name: string;
          shipping_email: string;
          shipping_phone: string;
          shipping_address: string;
          shipping_city: string;
          notes?: string | null;
          idempotency_key?: string | null;
        };
        Update: {
          status?: string;
          notes?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: number | null;
          product_name: string;
          product_icon: string;
          quantity: number;
          unit_price: number;
          created_at: string;
        };
        Insert: {
          order_id: string;
          product_id?: number | null;
          product_name: string;
          product_icon?: string;
          quantity: number;
          unit_price: number;
        };
        Update: never;
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          product_id: number;
        };
        Update: never;
      };
    };
  };
};

// Convenience types
export type Product = Database['public']['Tables']['products']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type CartItem = Database['public']['Tables']['cart_items']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];

// Product with old field names for backward compatibility with existing UI
export type ProductCompat = Product & {
  oldPrice: number;
  desc: string;
};

export function toProductCompat(p: Product): ProductCompat {
  return {
    ...p,
    oldPrice: p.old_price,
    desc: p.description,
  };
}
