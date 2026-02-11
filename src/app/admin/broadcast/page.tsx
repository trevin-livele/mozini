'use client';

import { useState, useEffect } from 'react';
import {
  getBroadcastRecipients,
  generateWhatsAppLinks,
  generateEmailBroadcast,
  type BroadcastRecipient,
} from '@/lib/actions/broadcast';

type Channel = 'whatsapp' | 'email' | 'sms';

export default function AdminBroadcast() {
  const [recipients, setRecipients] = useState<BroadcastRecipient[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [channel, setChannel] = useState<Channel>('whatsapp');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [waLinks, setWaLinks] = useState<{ name: string; phone: string; link: string }[]>([]);

  useEffect(() => {
    getBroadcastRecipients()
      .then((r) => setRecipients(r))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleAll = () => {
    if (selected.size === recipients.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(recipients.map((r) => r.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const recipientsWithPhone = recipients.filter((r) => r.phone);
  const recipientsWithEmail = recipients.filter((r) => r.email);

  const handleSend = async () => {
    if (selected.size === 0) { setResult({ type: 'error', text: 'Select at least one recipient' }); return; }
    if (!message.trim()) { setResult({ type: 'error', text: 'Message is required' }); return; }

    setSending(true);
    setResult(null);
    setWaLinks([]);

    try {
      const ids = Array.from(selected);

      if (channel === 'whatsapp') {
        const links = await generateWhatsAppLinks(ids, message);
        if (links.length === 0) {
          setResult({ type: 'error', text: 'No recipients have phone numbers' });
        } else {
          setWaLinks(links);
          setResult({ type: 'success', text: `Generated ${links.length} WhatsApp links. Click each to send.` });
        }
      } else if (channel === 'email') {
        if (!subject.trim()) { setResult({ type: 'error', text: 'Subject is required for email' }); setSending(false); return; }
        const { emails, mailto } = await generateEmailBroadcast(ids, subject, message);
        window.open(mailto, '_blank');
        setResult({ type: 'success', text: `Opening email client for ${emails.length} recipients` });
      } else if (channel === 'sms') {
        setResult({ type: 'error', text: 'SMS integration coming soon. Use WhatsApp for now.' });
      }
    } catch (err: any) {
      setResult({ type: 'error', text: err.message });
    }
    setSending(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bulk Messaging</h1>
          <p className="text-sm text-gray-500 mt-1">Send messages to customers via WhatsApp, Email, or SMS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose */}
        <div className="lg:col-span-2 space-y-4">
          {/* Channel Selector */}
          <div className="bg-white rounded-lg shadow p-5">
            <label className="text-sm font-medium text-gray-700 mb-3 block">Channel</label>
            <div className="flex gap-3">
              {([
                { id: 'whatsapp' as Channel, label: '💬 WhatsApp', color: 'bg-[#25D366]' },
                { id: 'email' as Channel, label: '✉️ Email', color: 'bg-blue-500' },
                { id: 'sms' as Channel, label: '📱 SMS', color: 'bg-purple-500' },
              ]).map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setChannel(ch.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    channel === ch.id
                      ? `${ch.color} text-white shadow-md`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {ch.label}
                  {ch.id === 'sms' && <span className="ml-1 text-[10px] opacity-70">(Soon)</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Message Compose */}
          <div className="bg-white rounded-lg shadow p-5 space-y-4">
            {channel === 'email' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Valentine's Day Special Offers 💝"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--copper)]"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Message
                <span className="text-xs text-gray-400 ml-2">Use {'{name}'} for personalization</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder={`Hi {name}! 💝\n\nCheck out our Valentine's Day collection at Mozini Watches & Gifts!\n\nShop now: https://mozini.co.ke/shop`}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--copper)] resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {selected.size} recipient{selected.size !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleSend}
                disabled={sending || selected.size === 0}
                className="px-6 py-2.5 bg-[var(--copper)] text-white rounded-lg text-sm font-medium hover:bg-[var(--copper-dark)] transition-colors disabled:opacity-50"
              >
                {sending ? 'Sending...' : `Send via ${channel === 'whatsapp' ? 'WhatsApp' : channel === 'email' ? 'Email' : 'SMS'}`}
              </button>
            </div>

            {result && (
              <div className={`p-3 rounded-lg text-sm ${result.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {result.text}
              </div>
            )}
          </div>

          {/* WhatsApp Links */}
          {waLinks.length > 0 && (
            <div className="bg-white rounded-lg shadow p-5">
              <h3 className="text-sm font-medium text-gray-700 mb-3">WhatsApp Links — Click each to send</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {waLinks.map((link, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium">{link.name}</span>
                      <span className="text-xs text-gray-400 ml-2">{link.phone}</span>
                    </div>
                    <a
                      href={link.link}
                      target="_blank"
                      className="px-3 py-1.5 bg-[#25D366] text-white rounded text-xs font-medium hover:bg-[#1da851] transition-colors"
                    >
                      💬 Send
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recipients */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Recipients</h3>
            <button onClick={toggleAll} className="text-xs text-[var(--copper)] hover:underline">
              {selected.size === recipients.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (
            <>
              <div className="text-xs text-gray-400 mb-3">
                {recipients.length} total · {recipientsWithPhone.length} with phone · {recipientsWithEmail.length} with email
              </div>
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {recipients.map((r) => {
                  const hasChannel =
                    channel === 'whatsapp' ? !!r.phone :
                    channel === 'email' ? !!r.email : !!r.phone;

                  return (
                    <label
                      key={r.id}
                      className={`flex items-center gap-2.5 py-2 px-2 rounded cursor-pointer hover:bg-gray-50 transition-colors ${!hasChannel ? 'opacity-40' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(r.id)}
                        onChange={() => toggleOne(r.id)}
                        disabled={!hasChannel}
                        className="w-4 h-4 accent-[var(--copper)]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-800 truncate">{r.full_name || 'No name'}</div>
                        <div className="text-xs text-gray-400 truncate">{r.email}</div>
                        {r.phone && <div className="text-xs text-gray-400">{r.phone}</div>}
                        {!hasChannel && <div className="text-[10px] text-red-400">No {channel === 'email' ? 'email' : 'phone'}</div>}
                      </div>
                    </label>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
