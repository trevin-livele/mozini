'use server';

import { createClient } from '@/lib/supabase/server';
import { isAdmin } from './auth';
import type { Product, Order, Profile, ContactMessage } from '@/lib/supabase/types';

// ============================================
// PRODUCTS MANAGEMENT
// ============================================

export async function getAdminProducts(options?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}): Promise<{ products: Product[]; total: number }> {
  if (!(await isAdmin())) throw new Error('Unauthorized');
  
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const from = (page - 1) * limit;

  const supabase = await createClient();
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (options?.search) {
    query = query.ilike('name', `%${options.search}%`);
  }
  if (options?.category) {
    query = query.eq('category', options.category);
  }

  query = query.range(from, from + limit - 1);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);
  return { products: data || [], total: count || 0 };
}

export async function createProduct(formData: FormData) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };
  
  const supabase = await createClient();
  const { error } = await supabase.from('products').insert({
    name: formData.get('name') as string,
    brand: formData.get('brand') as string || 'Mozini',
    category: formData.get('category') as string,
    price: parseInt(formData.get('price') as string),
    old_price: parseInt(formData.get('oldPrice') as string) || 0,
    icon: formData.get('icon') as string || '🎁',
    image_url: formData.get('imageUrl') as string || null,
    badge: formData.get('badge') as string || '',
    tag: formData.get('tag') as string || '',
    description: formData.get('description') as string || '',
    stock: parseInt(formData.get('stock') as string) || 100,
    is_active: formData.get('isActive') === 'true',
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateProduct(id: number, formData: FormData) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };
  
  const supabase = await createClient();
  const { error } = await supabase
    .from('products')
    .update({
      name: formData.get('name') as string,
      brand: formData.get('brand') as string,
      category: formData.get('category') as string,
      price: parseInt(formData.get('price') as string),
      old_price: parseInt(formData.get('oldPrice') as string) || 0,
      icon: formData.get('icon') as string,
      image_url: formData.get('imageUrl') as string || null,
      badge: formData.get('badge') as string,
      tag: formData.get('tag') as string,
      description: formData.get('description') as string,
      stock: parseInt(formData.get('stock') as string),
      is_active: formData.get('isActive') === 'true',
    })
    .eq('id', id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteProduct(id: number) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };
  
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) return { error: error.message };
  return { success: true };
}

// ============================================
// ORDERS MANAGEMENT
// ============================================

export async function getAdminOrders(): Promise<(Order & { profile?: Profile })[]> {
  if (!(await isAdmin())) throw new Error('Unauthorized');
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, profiles(*)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map((o: any) => ({ ...o, profile: o.profiles }));
}

export async function updateOrderStatus(orderId: string, status: string) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };
  
  const supabase = await createClient();
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) return { error: error.message };

  // Fetch order details for notification
  const { data: order } = await supabase
    .from('orders')
    .select('shipping_name, shipping_phone, shipping_email, total, id')
    .eq('id', orderId)
    .single();

  // Build notification link for admin to send
  let notifyLink = '';
  if (order?.shipping_phone) {
    const statusMessages: Record<string, string> = {
      confirmed: `Hi ${order.shipping_name}! ✅ Your Mozini order #${orderId.slice(0, 8)} has been *confirmed*. We're preparing it now!`,
      processing: `Hi ${order.shipping_name}! 📦 Your Mozini order #${orderId.slice(0, 8)} is being *processed* and will be shipped soon.`,
      dispatched: `Hi ${order.shipping_name}! 🚚 Great news! Your Mozini order #${orderId.slice(0, 8)} has been *dispatched*. It's on its way to you!`,
      delivered: `Hi ${order.shipping_name}! 🎉 Your Mozini order #${orderId.slice(0, 8)} has been *delivered*. Enjoy your purchase! Thank you for shopping with us 💝`,
      cancelled: `Hi ${order.shipping_name}, your Mozini order #${orderId.slice(0, 8)} has been *cancelled*. If you have questions, please reach out to us.`,
    };
    const msg = statusMessages[status];
    if (msg) {
      const phone = order.shipping_phone.replace(/\D/g, '');
      notifyLink = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    }
  }

  return { success: true, notifyLink };
}

// ============================================
// USERS MANAGEMENT
// ============================================

export async function getAdminUsers(): Promise<Profile[]> {
  if (!(await isAdmin())) throw new Error('Unauthorized');
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function updateUserRole(userId: string, role: 'customer' | 'admin' | 'super_admin') {
  if (!(await isAdmin())) return { error: 'Unauthorized' };
  
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) return { error: error.message };
  return { success: true };
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getAdminStats() {
  if (!(await isAdmin())) throw new Error('Unauthorized');
  
  const supabase = await createClient();
  
  const [products, orders, users, messages] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id, total, status'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('id, is_read', { count: 'exact' }),
  ]);

  const ordersData = orders.data || [];
  const totalRevenue = ordersData
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = ordersData.filter((o) => o.status === 'pending').length;
  const unreadMessages = (messages.data || []).filter((m) => !m.is_read).length;

  return {
    totalProducts: products.count || 0,
    totalOrders: ordersData.length,
    totalUsers: users.count || 0,
    totalRevenue,
    pendingOrders,
    totalMessages: messages.count || 0,
    unreadMessages,
  };
}

// ============================================
// CONTACT MESSAGES MANAGEMENT
// ============================================

export async function getAdminMessages(options?: {
  page?: number;
  limit?: number;
}): Promise<{ messages: ContactMessage[]; total: number }> {
  if (!(await isAdmin())) throw new Error('Unauthorized');

  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const from = (page - 1) * limit;

  const supabase = await createClient();
  const { data, error, count } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);

  if (error) throw new Error(error.message);
  return { messages: data || [], total: count || 0 };
}

export async function markMessageRead(id: string, isRead: boolean) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read: isRead })
    .eq('id', id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteMessage(id: string) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  return { success: true };
}
