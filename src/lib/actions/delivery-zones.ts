'use server';

import { createClient } from '@/lib/supabase/server';
import { isAdmin } from './auth';
import type { DeliveryZone } from '@/lib/supabase/types';

export type DeliveryZoneGrouped = {
  zone_name: string;
  zone_label: string;
  areas: { id: number; area_name: string; fee: number }[];
};

/** Get all active delivery zones grouped by zone */
export async function getDeliveryZones(): Promise<DeliveryZoneGrouped[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('delivery_zones')
    .select('*')
    .eq('is_active', true)
    .order('zone_name')
    .order('fee')
    .order('area_name');

  if (error || !data) return [];

  const grouped = new Map<string, DeliveryZoneGrouped>();
  for (const row of data as DeliveryZone[]) {
    if (!grouped.has(row.zone_name)) {
      grouped.set(row.zone_name, {
        zone_name: row.zone_name,
        zone_label: row.zone_label,
        areas: [],
      });
    }
    grouped.get(row.zone_name)!.areas.push({
      id: row.id,
      area_name: row.area_name,
      fee: row.fee,
    });
  }
  return Array.from(grouped.values());
}

/** Get all delivery zones (including inactive) for admin */
export async function getAllDeliveryZones(): Promise<DeliveryZone[]> {
  if (!(await isAdmin())) throw new Error('Unauthorized');
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('delivery_zones')
    .select('*')
    .order('zone_name')
    .order('fee')
    .order('area_name');

  if (error) throw new Error(error.message);
  return (data || []) as DeliveryZone[];
}

/** Get fee for a specific area by ID (server-side validation) */
export async function getDeliveryFeeByAreaId(areaId: number): Promise<number | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('delivery_zones')
    .select('fee')
    .eq('id', areaId)
    .eq('is_active', true)
    .single();

  return data?.fee ?? null;
}

/** Add a new delivery area */
export async function addDeliveryZoneArea(input: {
  zone_name: string;
  zone_label: string;
  area_name: string;
  fee: number;
}) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };
  const supabase = await createClient();

  const fee = Math.max(0, Math.round(Number(input.fee) || 0));
  const { error } = await supabase.from('delivery_zones').insert({
    zone_name: input.zone_name.trim(),
    zone_label: input.zone_label.trim(),
    area_name: input.area_name.trim(),
    fee,
  });

  if (error) {
    if (error.code === '23505') return { error: 'This area already exists in that zone' };
    return { error: error.message };
  }
  return { success: true };
}

/** Update an existing delivery area */
export async function updateDeliveryZoneArea(
  id: number,
  updates: { area_name?: string; fee?: number; zone_label?: string; is_active?: boolean }
) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };
  const supabase = await createClient();

  const payload: Record<string, any> = {};
  if (updates.area_name !== undefined) payload.area_name = updates.area_name.trim();
  if (updates.fee !== undefined) payload.fee = Math.max(0, Math.round(Number(updates.fee) || 0));
  if (updates.zone_label !== undefined) payload.zone_label = updates.zone_label.trim();
  if (updates.is_active !== undefined) payload.is_active = updates.is_active;

  const { error } = await supabase
    .from('delivery_zones')
    .update(payload)
    .eq('id', id);

  if (error) return { error: error.message };
  return { success: true };
}

/** Delete a delivery area */
export async function deleteDeliveryZoneArea(id: number) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };
  const supabase = await createClient();

  const { error } = await supabase
    .from('delivery_zones')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  return { success: true };
}
