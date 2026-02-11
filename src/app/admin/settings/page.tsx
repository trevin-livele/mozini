'use client';

import { useState, useEffect } from 'react';
import { getDeliverySettings, updateDeliverySettings } from '@/lib/actions/settings';
import type { DeliverySettings } from '@/lib/supabase/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<DeliverySettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getDeliverySettings().then(setSettings).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMessage('');
    const result = await updateDeliverySettings(settings);
    if (result.error) setMessage(`Error: ${result.error}`);
    else setMessage('Settings saved successfully!');
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  if (!settings) return <div className="py-10 text-center text-gray-500">Loading settings...</div>;

  const fields: { key: keyof DeliverySettings; label: string; desc: string }[] = [
    { key: 'delivery_fee_rider', label: 'Our Rider Fee (KES)', desc: 'Delivery fee when using your own rider' },
    { key: 'delivery_fee_pickup_mtaani', label: 'Pickup Mtaani Fee (KES)', desc: 'Fee for courier to nearest pickup point' },
    { key: 'delivery_fee_self_pickup', label: 'Self Pickup Fee (KES)', desc: 'Fee for customer self-pickup (usually 0)' },
    { key: 'free_delivery_threshold', label: 'Free Delivery Threshold (KES)', desc: 'Orders above this amount get free rider delivery. Set to 0 to always charge.' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Delivery Settings</h1>

      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 max-w-xl">
        <div className="space-y-5">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type="number"
                min="0"
                value={settings[f.key]}
                onChange={(e) => setSettings({ ...settings, [f.key]: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
