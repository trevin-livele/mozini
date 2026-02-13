'use client';

import { useState, useEffect } from 'react';
import {
  getAllDeliveryZones,
  addDeliveryZoneArea,
  updateDeliveryZoneArea,
  deleteDeliveryZoneArea,
} from '@/lib/actions/delivery-zones';
import type { DeliveryZone } from '@/lib/supabase/types';

function formatKES(n: number) {
  return `KES ${n.toLocaleString()}`;
}

export default function AdminDeliveryZonesPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFee, setEditFee] = useState('');
  const [editArea, setEditArea] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newZone, setNewZone] = useState({ zone_name: '', zone_label: '', area_name: '', fee: '' });
  const [saving, setSaving] = useState(false);

  const loadZones = async () => {
    try {
      const data = await getAllDeliveryZones();
      setZones(data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { loadZones(); }, []);

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveEdit = async (id: number) => {
    setSaving(true);
    const result = await updateDeliveryZoneArea(id, {
      area_name: editArea,
      fee: parseInt(editFee) || 0,
    });
    if (result.error) flash(`Error: ${result.error}`);
    else { flash('Updated!'); setEditingId(null); await loadZones(); }
    setSaving(false);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const result = await deleteDeliveryZoneArea(id);
    if (result.error) flash(`Error: ${result.error}`);
    else { flash('Deleted!'); await loadZones(); }
  };

  const handleToggle = async (z: DeliveryZone) => {
    const result = await updateDeliveryZoneArea(z.id, { is_active: !z.is_active });
    if (result.error) flash(`Error: ${result.error}`);
    else await loadZones();
  };

  const handleAdd = async () => {
    if (!newZone.zone_name || !newZone.zone_label || !newZone.area_name || !newZone.fee) {
      flash('Error: All fields are required');
      return;
    }
    setSaving(true);
    const result = await addDeliveryZoneArea({
      zone_name: newZone.zone_name,
      zone_label: newZone.zone_label,
      area_name: newZone.area_name,
      fee: parseInt(newZone.fee) || 0,
    });
    if (result.error) flash(`Error: ${result.error}`);
    else {
      flash('Area added!');
      setNewZone({ zone_name: '', zone_label: '', area_name: '', fee: '' });
      setShowAdd(false);
      await loadZones();
    }
    setSaving(false);
  };

  // Group by zone for display
  const grouped = new Map<string, DeliveryZone[]>();
  const filtered = zones.filter(
    (z) =>
      !filter ||
      z.area_name.toLowerCase().includes(filter.toLowerCase()) ||
      z.zone_name.toLowerCase().includes(filter.toLowerCase()) ||
      z.zone_label.toLowerCase().includes(filter.toLowerCase())
  );
  for (const z of filtered) {
    if (!grouped.has(z.zone_name)) grouped.set(z.zone_name, []);
    grouped.get(z.zone_name)!.push(z);
  }

  // Unique zone names for the add form dropdown
  const existingZones = [...new Set(zones.map((z) => `${z.zone_name}|${z.zone_label}`))];

  if (loading) return <div className="py-10 text-center text-gray-500">Loading delivery zones...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Zones</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search areas..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:outline-none w-48"
          />
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            {showAdd ? 'Cancel' : '+ Add Area'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Add new area form */}
      {showAdd && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Delivery Area</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Zone Name</label>
              <div className="flex gap-1">
                <select
                  value={newZone.zone_name ? `${newZone.zone_name}|${newZone.zone_label}` : ''}
                  onChange={(e) => {
                    if (e.target.value === '__new__') {
                      setNewZone({ ...newZone, zone_name: '', zone_label: '' });
                    } else if (e.target.value) {
                      const [zn, zl] = e.target.value.split('|');
                      setNewZone({ ...newZone, zone_name: zn, zone_label: zl });
                    }
                  }}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">Select zone...</option>
                  {existingZones.map((z) => {
                    const [zn, zl] = z.split('|');
                    return <option key={z} value={z}>{zn} — {zl}</option>;
                  })}
                  <option value="__new__">+ New Zone</option>
                </select>
              </div>
              {newZone.zone_name === '' && (
                <input
                  placeholder="e.g. Zone J"
                  value={newZone.zone_name}
                  onChange={(e) => setNewZone({ ...newZone, zone_name: e.target.value })}
                  className="mt-1 w-full px-2 py-2 border border-gray-300 rounded text-sm"
                />
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Road / Label</label>
              <input
                placeholder="e.g. Thika Road"
                value={newZone.zone_label}
                onChange={(e) => setNewZone({ ...newZone, zone_label: e.target.value })}
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Area Name</label>
              <input
                placeholder="e.g. Kasarani"
                value={newZone.area_name}
                onChange={(e) => setNewZone({ ...newZone, area_name: e.target.value })}
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Fee (KES)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="300"
                  value={newZone.fee}
                  onChange={(e) => setNewZone({ ...newZone, fee: e.target.value })}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={handleAdd}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? '...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mb-4">{zones.length} areas across {new Set(zones.map((z) => z.zone_name)).size} zones</p>

      {/* Zone tables */}
      <div className="space-y-6 overflow-x-auto">
        {Array.from(grouped.entries()).map(([zoneName, areas]) => (
        <div key={zoneName} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold text-gray-800">{zoneName}</span>
            <span className="text-xs text-gray-500">— {areas[0]?.zone_label}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{areas.length} areas</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                  <th className="px-4 py-2.5">Area</th>
                  <th className="px-4 py-2.5 w-28">Fee</th>
                  <th className="px-4 py-2.5 w-16">Active</th>
                  <th className="px-4 py-2.5 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((z) => (
                  <tr key={z.id} className={`border-t border-gray-100 ${!z.is_active ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-2.5">
                      {editingId === z.id ? (
                        <input
                          value={editArea}
                          onChange={(e) => setEditArea(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm w-full"
                        />
                      ) : (
                        <span className="text-gray-800">{z.area_name}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {editingId === z.id ? (
                        <input
                          type="number"
                          min="0"
                          value={editFee}
                          onChange={(e) => setEditFee(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                        />
                      ) : (
                        <span className="font-medium text-gray-700">{formatKES(z.fee)}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => handleToggle(z)}
                        className={`w-8 h-5 rounded-full transition-colors relative ${z.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                        aria-label={z.is_active ? 'Deactivate' : 'Activate'}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${z.is_active ? 'left-3.5' : 'left-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {editingId === z.id ? (
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => handleSaveEdit(z.id)}
                            disabled={saving}
                            className="px-2.5 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => { setEditingId(z.id); setEditFee(String(z.fee)); setEditArea(z.area_name); }}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(z.id, z.area_name)}
                            className="px-2.5 py-1 bg-red-50 text-red-700 rounded text-xs hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {grouped.size === 0 && (
        <div className="text-center py-10 text-gray-400">
          {filter ? 'No areas match your search.' : 'No delivery zones configured yet. Click "+ Add Area" to get started.'}
        </div>
      )}
    </div>
  );
}
