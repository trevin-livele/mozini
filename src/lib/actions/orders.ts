'use server';

import { createClient } from '@/lib/supabase/server';
import type { Order, OrderItem } from '@/lib/supabase/types';
import type { CartItemWithProduct } from './cart';

export type OrderWithItems = Order & {
  order_items: OrderItem[];
};

interface CheckoutInput {
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  paymentMethod: string;
  notes?: string;
  idempotencyKey: string;
  deliveryAreaId?: number;
}

export async function createOrder(
  cartItems: CartItemWithProduct[],
  input: CheckoutInput
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to place an order');

  // Validate input
  if (!input.shippingName || !input.shippingEmail || !input.shippingPhone ||
      !input.shippingAddress || !input.shippingCity) {
    throw new Error('All shipping fields are required');
  }

  if (cartItems.length === 0) throw new Error('Cart is empty');

  // Check for duplicate order via idempotency key
  if (input.idempotencyKey) {
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('idempotency_key', input.idempotencyKey)
      .single();

    if (existingOrder) {
      return { orderId: existingOrder.id, duplicate: true };
    }
  }

  // Validate stock for all items
  const productIds = cartItems.map((item) => item.product_id);
  const { data: currentProducts, error: stockError } = await supabase
    .from('products')
    .select('id, stock, name, price')
    .in('id', productIds);

  if (stockError) throw new Error('Failed to verify stock');

  const stockMap = new Map(currentProducts?.map((p) => [p.id, p]) || []);

  for (const item of cartItems) {
    const product = stockMap.get(item.product_id);
    if (!product) throw new Error(`Product "${item.product.name}" no longer available`);
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock} left.`);
    }
    // Verify price hasn't changed
    if (product.price !== item.product.price) {
      throw new Error(`Price changed for "${product.name}". Please refresh your cart.`);
    }
  }

  // Calculate totals from server-side data (don't trust client totals)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (stockMap.get(item.product_id)!.price * item.quantity),
    0
  );

  // Fetch delivery settings from DB
  const { data: settingsRows } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['delivery_fee_rider', 'delivery_fee_pickup_mtaani', 'delivery_fee_self_pickup', 'free_delivery_threshold']);

  const settingsMap: Record<string, number> = {};
  for (const row of settingsRows || []) {
    settingsMap[row.key] = parseInt(row.value) || 0;
  }
  const riderFee = settingsMap['delivery_fee_rider'] ?? 500;
  const pickupMtaaniFee = settingsMap['delivery_fee_pickup_mtaani'] ?? 200;
  const selfPickupFee = settingsMap['delivery_fee_self_pickup'] ?? 0;
  const freeThreshold = settingsMap['free_delivery_threshold'] ?? 0;

  // Determine delivery method from notes
  let shipping = riderFee; // default to rider
  if (input.notes?.includes('Delivery: pickup-mtaani')) {
    shipping = pickupMtaaniFee;
  } else if (input.notes?.includes('Delivery: self-pickup')) {
    shipping = selfPickupFee;
  } else if (input.notes?.includes('Delivery: nationwide')) {
    shipping = 0; // fee determined by courier, communicated separately
  } else if (input.deliveryAreaId) {
    // Zone-based delivery fee — validate from DB
    const { data: zoneRow } = await supabase
      .from('delivery_zones')
      .select('fee')
      .eq('id', input.deliveryAreaId)
      .eq('is_active', true)
      .single();
    if (zoneRow) {
      shipping = freeThreshold > 0 && subtotal >= freeThreshold ? 0 : zoneRow.fee;
    }
  } else if (freeThreshold > 0 && subtotal >= freeThreshold) {
    shipping = 0;
  }
  const total = subtotal + shipping;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      subtotal,
      shipping,
      total,
      payment_method: input.paymentMethod,
      shipping_name: input.shippingName,
      shipping_email: input.shippingEmail,
      shipping_phone: input.shippingPhone,
      shipping_address: input.shippingAddress,
      shipping_city: input.shippingCity,
      notes: input.notes || null,
      idempotency_key: input.idempotencyKey || null,
    })
    .select('id')
    .single();

  if (orderError || !order) throw new Error(`Failed to create order: ${orderError?.message}`);

  // Insert order items
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product.name,
    product_icon: item.product.icon,
    quantity: item.quantity,
    unit_price: stockMap.get(item.product_id)!.price,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw new Error(`Failed to save order items: ${itemsError.message}`);

  // Reduce stock for each product
  for (const item of cartItems) {
    const product = stockMap.get(item.product_id)!;
    const { error: stockUpdateError } = await supabase
      .from('products')
      .update({ stock: product.stock - item.quantity })
      .eq('id', item.product_id);

    if (stockUpdateError) {
      console.error(`Failed to reduce stock for product ${item.product_id}:`, stockUpdateError);
    }
  }

  // Clear user's cart
  await supabase.from('cart_items').delete().eq('user_id', user.id);

  return { orderId: order.id, duplicate: false };
}

export async function getOrders(): Promise<OrderWithItems[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch orders: ${error.message}`);
  return (data || []) as OrderWithItems[];
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single();

  if (error) return null;
  return data as OrderWithItems;
}
