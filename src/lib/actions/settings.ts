'use server';

import { createClient } from '@/lib/supabase/server';
import { isAdmin } from './auth';
import type { DeliverySettings } from '@/lib/supabase/types';

const DELIVERY_KEYS = [
  'delivery_fee_rider',
  'delivery_fee_pickup_mtaani',
  'delivery_fee_self_pickup',
  'free_delivery_threshold',
] as const;

const DEFAULTS: DeliverySettings = {
  delivery_fee_rider: 500,
  delivery_fee_pickup_mtaani: 200,
  delivery_fee_self_pickup: 0,
  free_delivery_threshold: 0,
};

export async function getDeliverySettings(): Promise<DeliverySettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', DELIVERY_KEYS as unknown as string[]);

  const settings = { ...DEFAULTS };
  for (const row of data || []) {
    if (row.key in settings) {
      (settings as any)[row.key] = parseInt(row.value) || 0;
    }
  }
  return settings;
}

export async function updateDeliverySettings(updates: Partial<DeliverySettings>) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };

  const supabase = await createClient();

  for (const [key, value] of Object.entries(updates)) {
    if (!DELIVERY_KEYS.includes(key as any)) continue;
    const numVal = Math.max(0, Math.round(Number(value) || 0));
    await supabase
      .from('site_settings')
      .upsert({ key, value: String(numVal), label: '' }, { onConflict: 'key' });
  }

  return { success: true };
}
