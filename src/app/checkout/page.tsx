'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useAuth } from '@/components/AuthProvider';
import { formatPrice } from '@/lib/data';
import { getCart, type CartItemWithProduct } from '@/lib/actions/cart';
import { createOrder } from '@/lib/actions/orders';
import { getDeliverySettings } from '@/lib/actions/settings';
import { getDeliveryZones, type DeliveryZoneGrouped } from '@/lib/actions/delivery-zones';
import type { DeliverySettings } from '@/lib/supabase/types';

const GIFT_CATEGORIES = ['Gifts', 'For Her', 'For Him', 'Couples', 'All Gifts', 'Corporate Gift Sets', 'Flower Bouquet', 'Gift Cards', 'Valentines Collection', 'Galentines Collection'];
const WATCH_CATEGORIES = ['Gents Watches', 'Ladies Watches', 'Kids Watches', 'Curren', 'Naviforce', 'Poedagar', 'Hannah Martin'];

const KENYA_COUNTIES = [
  'Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu','Garissa','Homa Bay','Isiolo','Kajiado',
  'Kakamega','Kericho','Kiambu','Kilifi','Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia',
  'Lamu','Machakos','Makueni','Mandera','Marsabit','Meru','Migori','Mombasa','Murang\'a','Nairobi',
  'Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri','Samburu','Siaya','Taita-Taveta','Tana River',
  'Tharaka-Nithi','Trans-Nzoia','Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot',
];

type DeliveryOption = 'rider' | 'pickup-mtaani' | 'self-pickup' | 'nationwide';

function getMinDeliveryDate(hasGifts: boolean): string {
  const now = new Date();
  const hoursToAdd = hasGifts ? 6 : 2;
  const min = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
  // If past 5PM EAT, push to next day 9AM
  const eatHour = min.getUTCHours() + 3; // EAT = UTC+3
  if (eatHour >= 17) {
    min.setDate(min.getDate() + 1);
  }
  return min.toISOString().split('T')[0];
}

function getTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h <= 16; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    if (h < 16) slots.push(`${h.toString().padStart(2, '0')}:30`);
  }
  slots.push('17:00');
  return slots;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const syncCart = useStore((s) => s.syncCart);
  const [serverCart, setServerCart] = useState<CartItemWithProduct[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [delivery, setDelivery] = useState<DeliveryOption>('rider');
  const idempotencyKeyRef = useRef(crypto.randomUUID());
  const [fees, setFees] = useState<DeliverySettings | null>(null);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZoneGrouped[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [areaSearch, setAreaSearch] = useState('');
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  // Nationwide delivery
  const [nwCounty, setNwCounty] = useState('');
  const [nwSubCounty, setNwSubCounty] = useState('');
  const [nwTown, setNwTown] = useState('');
  const [nwMethod, setNwMethod] = useState('');
  // Delivery date/time
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  useEffect(() => {
    if (!user) { router.push('/login?redirectTo=/checkout'); return; }
    setLoadingCart(true);
    Promise.all([
      getCart().then(setServerCart).catch(() => setServerCart([])),
      getDeliverySettings().then(setFees).catch(() => {}),
      getDeliveryZones().then(setDeliveryZones).catch(() => {}),
    ]).finally(() => setLoadingCart(false));
  }, [user, router]);

  const hasGiftItems = serverCart.some((item) => GIFT_CATEGORIES.some(gc => item.product.category.includes(gc)));
  const hasWatchItems = serverCart.some((item) => WATCH_CATEGORIES.includes(item.product.category));
  const subtotal = serverCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const riderFee = fees?.delivery_fee_rider ?? 500;
  const pickupMtaaniFee = fees?.delivery_fee_pickup_mtaani ?? 200;
  const selfPickupFee = fees?.delivery_fee_self_pickup ?? 0;
  const freeThreshold = fees?.free_delivery_threshold ?? 0;

  const selectedArea = deliveryZones
    .flatMap((z) => z.areas.map((a) => ({ ...a, zone_name: z.zone_name, zone_label: z.zone_label })))
    .find((a) => a.id === selectedAreaId);
  const zoneFee = selectedArea?.fee ?? null;

  const deliveryFee = delivery === 'rider'
    ? (zoneFee !== null ? (freeThreshold > 0 && subtotal >= freeThreshold ? 0 : zoneFee) : (freeThreshold > 0 && subtotal >= freeThreshold ? 0 : riderFee))
    : delivery === 'pickup-mtaani' ? pickupMtaaniFee
    : delivery === 'nationwide' ? 0 // fee determined by courier
    : selfPickupFee;

  const allAreas = deliveryZones.flatMap((z) => z.areas.map((a) => ({ ...a, zone_name: z.zone_name, zone_label: z.zone_label })));
  const filteredAreas = areaSearch.trim()
    ? allAreas.filter((a) => a.area_name.toLowerCase().includes(areaSearch.toLowerCase()) || a.zone_label.toLowerCase().includes(areaSearch.toLowerCase()))
    : allAreas;

  const total = subtotal + deliveryFee;

  // For gifts: must pay at least 50%
  const minPayment = hasGiftItems ? Math.ceil(total * 0.5) : total;
  const amountDueNow = hasGiftItems ? minPayment : total;
  const balanceOnDelivery = total - amountDueNow;

  const minDate = getMinDeliveryDate(hasGiftItems);
  const timeSlots = getTimeSlots();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (serverCart.length === 0 || submitting) return;
    setError('');

    if (delivery === 'rider' && deliveryZones.length > 0 && !selectedAreaId) {
      setError('Please select your delivery area.'); return;
    }
    if (delivery === 'nationwide' && (!nwCounty || !nwTown)) {
      setError('Please fill in county and town for nationwide delivery.'); return;
    }
    if (!deliveryDate || !deliveryTime) {
      setError('Please select a delivery date and time.'); return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const shippingAddress = delivery === 'self-pickup'
        ? 'Nairobi CBD Pick Up — Digital Shopping Mall, F27'
        : delivery === 'nationwide'
        ? `${nwTown}, ${nwSubCounty ? nwSubCounty + ', ' : ''}${nwCounty} County`
        : formData.get('address') as string;
      const shippingCity = delivery === 'self-pickup' ? 'Nairobi'
        : delivery === 'nationwide' ? nwCounty
        : formData.get('city') as string;

      const notes = [
        `Delivery: ${delivery}`,
        selectedArea ? `Area: ${selectedArea.area_name} (${selectedArea.zone_name} - ${selectedArea.zone_label}) | Zone Fee: KES ${selectedArea.fee}` : '',
        delivery === 'nationwide' ? `Nationwide: ${nwCounty}, ${nwSubCounty}, ${nwTown} | Method: ${nwMethod || 'Not specified'}` : '',
        `Delivery Date: ${deliveryDate} at ${deliveryTime}`,
        hasGiftItems ? `Gift order — 50% deposit: ${formatPrice(amountDueNow)}, Balance: ${formatPrice(balanceOnDelivery)}` : '',
        balanceOnDelivery > 0 ? `Balance on delivery: ${formatPrice(balanceOnDelivery)}` : '',
        formData.get('notes') ? String(formData.get('notes')) : '',
      ].filter(Boolean).join(' | ');

      await createOrder(serverCart, {
        shippingName: `${formData.get('firstName')} ${formData.get('lastName')}`,
        shippingEmail: formData.get('email') as string,
        shippingPhone: formData.get('phone') as string,
        shippingAddress,
        shippingCity,
        paymentMethod: `mpesa${hasGiftItems ? '-50pct' : ''}`,
        notes,
        idempotencyKey: idempotencyKeyRef.current,
        deliveryAreaId: selectedAreaId ?? undefined,
      });

      await syncCart();
      router.push('/orders');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
      idempotencyKeyRef.current = crypto.randomUUID();
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;
  if (loadingCart) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-3 border-[var(--border)] border-t-[var(--copper)] rounded-full animate-spin" />
      <p className="text-sm text-[var(--text-light)]">Loading checkout...</p>
    </div>
  );
  if (serverCart.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-serif text-3xl text-[var(--dark)] mb-4">Cart is Empty</h1>
        <Link href="/shop" className="text-[var(--copper)] hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[var(--bg-soft)] py-12 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="font-serif text-4xl text-[var(--dark)] mb-2">Checkout</h1>
          <div className="text-sm text-[var(--text-light)]">
            <Link href="/" className="text-[var(--copper)] hover:underline">Home</Link>{' / '}<Link href="/cart" className="text-[var(--copper)] hover:underline">Cart</Link>{' / Checkout'}
          </div>
        </div>
      </div>

      <div className="py-8 md:py-12 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-5">
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>}

          {hasGiftItems && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
              🎁 Your cart contains gift items. A minimum deposit of 50% ({formatPrice(minPayment)}) is required to place this order. The remaining balance of {formatPrice(balanceOnDelivery)} is due on delivery.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 md:gap-12 items-start">
              <div>
                <h2 className="font-serif text-xl md:text-2xl mb-5 text-[var(--dark)]">Your Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">First Name *</label>
                    <input name="firstName" required className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Last Name *</label>
                    <input name="lastName" required className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Email *</label>
                  <input name="email" type="email" required defaultValue={user?.email || ''} className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm" />
                </div>
                <div className="mb-6">
                  <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Phone (M-Pesa) *</label>
                  <input name="phone" type="tel" required placeholder="+254 7XX XXX XXX" className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm" />
                </div>

                <h2 className="font-serif text-xl md:text-2xl mb-4 text-[var(--dark)]">Delivery Method</h2>
                <div className="flex flex-col gap-3 mb-6">
                  <label onClick={() => setDelivery('rider')} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${delivery === 'rider' ? 'border-[var(--copper)] bg-[rgba(44,95,99,0.05)]' : 'border-[var(--border)]'}`}>
                    <input type="radio" name="delivery" value="rider" checked={delivery === 'rider'} readOnly className="accent-[var(--copper)] mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-[var(--dark)]">🏍️ Our Rider (Nairobi)</div>
                      <div className="text-xs text-[var(--text-light)] mt-0.5">Doorstep delivery within Nairobi & surroundings.</div>
                    </div>
                  </label>
                  <label onClick={() => { setDelivery('self-pickup'); setSelectedAreaId(null); setAreaSearch(''); }} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${delivery === 'self-pickup' ? 'border-[var(--copper)] bg-[rgba(44,95,99,0.05)]' : 'border-[var(--border)]'}`}>
                    <input type="radio" name="delivery" value="self-pickup" checked={delivery === 'self-pickup'} readOnly className="accent-[var(--copper)] mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-[var(--dark)]">🏬 Nairobi CBD Pick Up{selfPickupFee === 0 ? ' — Free' : ` — KES ${selfPickupFee}`}</div>
                      <div className="text-xs text-[var(--text-light)] mt-0.5">Collect from Digital Shopping Mall, F27, Nairobi CBD.</div>
                    </div>
                  </label>
                  <label onClick={() => { setDelivery('pickup-mtaani'); setSelectedAreaId(null); setAreaSearch(''); }} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${delivery === 'pickup-mtaani' ? 'border-[var(--copper)] bg-[rgba(44,95,99,0.05)]' : 'border-[var(--border)]'}`}>
                    <input type="radio" name="delivery" value="pickup-mtaani" checked={delivery === 'pickup-mtaani'} readOnly className="accent-[var(--copper)] mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-[var(--dark)]">📦 Pick Up Mtaani — KES {pickupMtaaniFee}</div>
                      <div className="text-xs text-[var(--text-light)] mt-0.5">Courier to your nearest pickup point. 1–2 business days.</div>
                    </div>
                  </label>
                  <label onClick={() => { setDelivery('nationwide'); setSelectedAreaId(null); setAreaSearch(''); }} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${delivery === 'nationwide' ? 'border-[var(--copper)] bg-[rgba(44,95,99,0.05)]' : 'border-[var(--border)]'}`}>
                    <input type="radio" name="delivery" value="nationwide" checked={delivery === 'nationwide'} readOnly className="accent-[var(--copper)] mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-[var(--dark)]">🚌 Nationwide Delivery</div>
                      <div className="text-xs text-[var(--text-light)] mt-0.5">Delivery across Kenya via shuttle/coach. Fee depends on destination.</div>
                    </div>
                  </label>
                </div>

                {/* Rider area selector */}
                {delivery === 'rider' && deliveryZones.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Select Delivery Area *</label>
                    <div className="relative">
                      <input type="text" placeholder="Search area..." value={areaSearch} onChange={(e) => { setAreaSearch(e.target.value); setShowAreaDropdown(true); }} onFocus={() => setShowAreaDropdown(true)} className="w-full px-3 py-2.5 border border-[var(--border)] rounded text-sm" />
                      {selectedArea && !showAreaDropdown && (
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <span className="bg-[rgba(44,95,99,0.1)] text-[var(--copper)] px-3 py-1.5 rounded-full text-xs font-medium">📍 {selectedArea.area_name} — KES {selectedArea.fee}</span>
                          <button type="button" onClick={() => { setSelectedAreaId(null); setAreaSearch(''); }} className="text-xs text-red-500">Change</button>
                        </div>
                      )}
                      {showAreaDropdown && (
                        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                          {filteredAreas.length === 0 ? (
                            <div className="px-4 py-3 text-xs text-gray-400">No areas found.</div>
                          ) : (
                            <>
                              {deliveryZones.filter((z) => filteredAreas.some((a) => a.zone_name === z.zone_name)).map((zone) => (
                                <div key={zone.zone_name}>
                                  <div className="px-3 py-1.5 bg-gray-50 text-xs font-semibold text-gray-500 uppercase sticky top-0">{zone.zone_name} — {zone.zone_label}</div>
                                  {filteredAreas.filter((a) => a.zone_name === zone.zone_name).map((area) => (
                                    <button key={area.id} type="button" onClick={() => { setSelectedAreaId(area.id); setAreaSearch(''); setShowAreaDropdown(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex justify-between">
                                      <span>{area.area_name}</span>
                                      <span className="text-xs font-semibold text-[var(--copper)]">KES {area.fee}</span>
                                    </button>
                                  ))}
                                </div>
                              ))}
                              <button type="button" onClick={() => setShowAreaDropdown(false)} className="w-full text-center py-2 text-xs text-gray-400 border-t">Close</button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Nationwide delivery fields */}
                {delivery === 'nationwide' && (
                  <div className="mb-6 space-y-3">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">County *</label>
                      <select value={nwCounty} onChange={(e) => setNwCounty(e.target.value)} required className="w-full px-3 py-2.5 border border-[var(--border)] rounded text-sm">
                        <option value="">Select County</option>
                        {KENYA_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Sub-County</label>
                      <input value={nwSubCounty} onChange={(e) => setNwSubCounty(e.target.value)} placeholder="e.g. Westlands" className="w-full px-3 py-2.5 border border-[var(--border)] rounded text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Town *</label>
                      <input value={nwTown} onChange={(e) => setNwTown(e.target.value)} placeholder="e.g. Nakuru Town" required className="w-full px-3 py-2.5 border border-[var(--border)] rounded text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Preferred Delivery Method</label>
                      <input value={nwMethod} onChange={(e) => setNwMethod(e.target.value)} placeholder="e.g. Easy Coach, Enna Coach, shuttle to Nakuru..." className="w-full px-3 py-2.5 border border-[var(--border)] rounded text-sm" />
                      <p className="text-xs text-[var(--text-light)] mt-1">Specify your preferred courier/shuttle service. Delivery fee will be communicated.</p>
                    </div>
                  </div>
                )}

                {/* Address for rider / pickup-mtaani */}
                {(delivery === 'rider' || delivery === 'pickup-mtaani') && (
                  <>
                    <div className="mb-4">
                      <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">{delivery === 'pickup-mtaani' ? 'Nearest Pickup Point *' : 'Delivery Address *'}</label>
                      <input name="address" required className="w-full px-3 py-2.5 border border-[var(--border)] rounded text-sm" />
                    </div>
                    <div className="mb-6">
                      <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Town / City *</label>
                      <input name="city" required placeholder="Nairobi" className="w-full px-3 py-2.5 border border-[var(--border)] rounded text-sm" />
                    </div>
                  </>
                )}

                {/* Delivery Date & Time */}
                <h2 className="font-serif text-xl md:text-2xl mb-4 text-[var(--dark)]">Delivery Date & Time</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Date *</label>
                    <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} min={minDate} required className="w-full px-3 py-2.5 border border-[var(--border)] rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Time (9AM - 5PM EAT) *</label>
                    <select value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} required className="w-full px-3 py-2.5 border border-[var(--border)] rounded text-sm">
                      <option value="">Select time</option>
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-light)] mb-6">
                  {hasGiftItems ? '🎁 Gift items require at least 6 hours lead time.' : '⌚ Orders require at least 2 hours lead time.'} Delivery hours: 9AM – 5PM EAT.
                </p>

                <div className="mb-6">
                  <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Order Notes</label>
                  <textarea name="notes" placeholder="Special instructions..." className="w-full px-3 py-2.5 border border-[var(--border)] rounded text-sm min-h-[80px] resize-y"></textarea>
                </div>

                {/* M-Pesa Payment */}
                <h2 className="font-serif text-xl md:text-2xl mb-4 text-[var(--dark)]">Payment — M-Pesa</h2>
                <div className="bg-[#4CAF50]/10 border border-[#4CAF50]/30 rounded-lg p-5 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">📱</span>
                    <div className="text-sm font-semibold text-[var(--dark)]">Lipa na M-Pesa (Paybill)</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-xs text-[var(--text-light)]">Business Number</div>
                      <div className="font-bold text-[var(--dark)] text-lg">522533</div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--text-light)]">Account Number</div>
                      <div className="font-bold text-[var(--dark)] text-lg">1303978</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#4CAF50]/20">
                    <div className="text-xs text-[var(--text-light)]">Amount to Pay Now</div>
                    <div className="font-bold text-[#4CAF50] text-xl">{formatPrice(amountDueNow)}</div>
                    {balanceOnDelivery > 0 && <div className="text-xs text-[var(--text-light)] mt-1">Balance on delivery: {formatPrice(balanceOnDelivery)}</div>}
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="w-full bg-[var(--copper)] text-white py-3 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors lg:hidden disabled:opacity-50">
                  {submitting ? 'Processing...' : `Place Order — ${formatPrice(amountDueNow)}`}
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-[var(--bg-soft)] p-6 md:p-8 rounded-xl lg:sticky lg:top-24">
                <h3 className="font-serif text-lg md:text-xl mb-4 text-[var(--dark)]">Order Summary</h3>
                <div className="max-h-[300px] overflow-y-auto mb-4">
                  {serverCart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-3 border-b border-[var(--border)]">
                      <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center text-xl border border-[var(--border)] flex-shrink-0 overflow-hidden">
                        {item.product.image_url ? <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" /> : item.product.icon}
                      </div>
                      <div className="flex-1 text-sm font-medium text-[var(--dark)] min-w-0">
                        <div className="truncate">{item.product.name}</div>
                        <div className="text-[var(--text-light)]">× {item.quantity}</div>
                      </div>
                      <div className="text-sm font-semibold text-[var(--copper)] whitespace-nowrap">{formatPrice(item.product.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between py-2.5 border-b border-[var(--border)] text-sm">
                  <span>Subtotal</span><span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-[var(--border)] text-sm">
                  <span>Delivery</span>
                  <span className="font-semibold">{delivery === 'nationwide' ? 'TBD' : deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between py-3 text-lg font-bold text-[var(--dark)]">
                  <span>Total</span><span className="text-[var(--copper)]">{formatPrice(total)}</span>
                </div>
                {balanceOnDelivery > 0 && (
                  <>
                    <div className="flex justify-between py-2 text-xs border-t border-[var(--border)]">
                      <span className="text-[var(--text-light)]">Pay now (50% deposit)</span>
                      <span className="font-semibold text-[#4CAF50]">{formatPrice(amountDueNow)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-xs">
                      <span className="text-[var(--text-light)]">Balance on delivery</span>
                      <span className="font-semibold">{formatPrice(balanceOnDelivery)}</span>
                    </div>
                  </>
                )}
                <button type="submit" disabled={submitting} className="hidden lg:block w-full bg-[var(--copper)] text-white py-3 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors mt-5 disabled:opacity-50">
                  {submitting ? 'Processing...' : `Place Order — ${formatPrice(amountDueNow)}`}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
