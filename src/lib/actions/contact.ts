'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from('contact_messages').insert({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    subject: data.subject || null,
    message: data.message,
  });

  if (error) throw new Error(`Failed to send message: ${error.message}`);
  return { success: true };
}
