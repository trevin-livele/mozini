'use server';

import { createClient } from '@/lib/supabase/server';

const BUCKET = 'product-images';

export async function uploadProductImage(formData: FormData): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') throw new Error('Admin access required');

  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Allowed: JPEG, PNG, WebP, GIF');
  }

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File too large. Maximum 5MB.');
  }

  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function deleteProductImage(imageUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') throw new Error('Admin access required');

  // Extract file path from URL
  const url = new URL(imageUrl);
  const pathParts = url.pathname.split(`/${BUCKET}/`);
  if (pathParts.length < 2) throw new Error('Invalid image URL');

  const filePath = pathParts[1];

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([filePath]);

  if (error) throw new Error(`Delete failed: ${error.message}`);
}
