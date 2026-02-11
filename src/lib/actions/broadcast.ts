'use server';

import { createClient } from '@/lib/supabase/server';
import { isAdmin } from './auth';

export interface BroadcastRecipient {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
}

/**
 * Get all customers who can receive messages.
 */
export async function getBroadcastRecipients(): Promise<BroadcastRecipient[]> {
  if (!(await isAdmin())) throw new Error('Unauthorized');

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Send bulk WhatsApp messages via wa.me links.
 * Returns an array of WhatsApp deep links for each recipient.
 * The admin opens these to send messages (WhatsApp API requires business account for true automation).
 */
export async function generateWhatsAppLinks(
  recipientIds: string[],
  message: string
): Promise<{ name: string; phone: string; link: string }[]> {
  if (!(await isAdmin())) throw new Error('Unauthorized');
  if (!message.trim()) throw new Error('Message is required');

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, phone')
    .in('id', recipientIds)
    .not('phone', 'is', null);

  if (error) throw new Error(error.message);

  return (data || [])
    .filter((r) => r.phone)
    .map((r) => {
      const phone = r.phone!.replace(/\D/g, '');
      const personalised = message.replace('{name}', r.full_name || 'Customer');
      return {
        name: r.full_name || 'Unknown',
        phone: r.phone!,
        link: `https://wa.me/${phone}?text=${encodeURIComponent(personalised)}`,
      };
    });
}

/**
 * Send bulk emails using mailto links (for now).
 * For production, integrate with an email service like Resend, SendGrid, etc.
 */
export async function generateEmailBroadcast(
  recipientIds: string[],
  subject: string,
  message: string
): Promise<{ emails: string[]; mailto: string }> {
  if (!(await isAdmin())) throw new Error('Unauthorized');
  if (!subject.trim() || !message.trim()) throw new Error('Subject and message are required');

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('email')
    .in('id', recipientIds);

  if (error) throw new Error(error.message);

  const emails = (data || []).map((r) => r.email);
  const mailto = `mailto:?bcc=${emails.join(',')}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  return { emails, mailto };
}
