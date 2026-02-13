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

const WATCH_CATEGORIES = ['Gents Watches', 'Ladies Watches', 'Kids Watches', 'Curren', 'Naviforce', 'Poedagar', 'Hannah Martin'];

function getPickupReadyTime(): string {
  const now = new Date();
  const ready = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour
  const hours = ready.getHours();
  const minutes = ready.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  const m = minutes < 10 ? `0${minutes}` : minutes;
  return `${h}:${m} ${ampm}`;
}

type DeliveryOption = 'rider' | 'pickup-mtaani' | 'self-pickup';
type PaymentOption = 'full' | 'delivery-only';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const syncCart = useStore((s) => s.syncCart);
  const [serverCart, setServerCart] = useState<CartItemWithProduct[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [delivery, setDelivery] = useState<DeliveryOption>('rider');
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('full');
  const idempotencyKeyRef = useRef(crypto.randomUUID());
  const [fees, setFees] = useState<DeliverySettings | null>(null);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZoneGrouped[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [areaSearch, setAreaSearch] = useState('');
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login?redirectTo=/checkout'); return; }
    setLoadingCart(true);
    Promise.all([
      getCart().then(setServerCart).catch(() => setServerCart([])),
      getDeliverySettings().then(setFees).catch(() => {}),
      getDeliveryZones().then(setDeliveryZones).catch(() => {}),
    ]).finally(() => setLoadingCart(false));
  }, [user, router]);

  // Check if cart has watch items (eligible for pay-on-delivery)
  const hasWatchItems = serverCart.some((item) =>
    WATCH_CATEGORIES.includes(item.product.category)
  );

  const subtotal = serverCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Delivery fee based on option (from admin settings)
  const riderFee = fees?.delivery_fee_rider ?? 500;
  const pickupMtaaniFee = fees?.delivery_fee_pickup_mtaani ?? 200;
  const selfPickupFee = fees?.delivery_fee_self_pickup ?? 0;
  const freeThreshold = fees?.free_delivery_threshold ?? 0;

  // Find selected area's fee from delivery zones
  const selectedArea = deliveryZones
    .flatMap((z) => z.areas.map((a) => ({ ...a, zone_name: z.zone_name, zone_label: z.zone_label })))
    .find((a) => a.id === selectedAreaId);
  const zoneFee = selectedArea?.fee ?? null;

  const deliveryFee = delivery === 'rider'
    ? (zoneFee !== null
        ? (freeThreshold > 0 && subtotal >= freeThreshold ? 0 : zoneFee)
        : (freeThreshold > 0 && subtotal >= freeThreshold ? 0 : riderFee))
    : delivery === 'pickup-mtaani' ? pickupMtaaniFee
    : selfPickupFee;

  // All areas flattened for search
  const allAreas = deliveryZones.flatMap((z) =>
    z.areas.map((a) => ({ ...a, zone_name: z.zone_name, zone_label: z.zone_label }))
  );
  const filteredAreas = areaSearch.trim()
    ? allAreas.filter(
        (a) =>
          a.area_name.toLowerCase().includes(areaSearch.toLowerCase()) ||
          a.zone_label.toLowerCase().includes(areaSearch.toLowerCase()) ||
          a.zone_name.toLowerCase().includes(areaSearch.toLowerCase())
      )
    : allAreas;

  const total = subtotal + deliveryFee;

  // Amount due now
  const amountDueNow = paymentOption === 'delivery-only' && hasWatchItems
    ? deliveryFee
    : total;

  const balanceOnDelivery = paymentOption === 'delivery-only' && hasWatchItems
    ? total - deliveryFee
    : 0;

  const pickupReadyTime = getPickupReadyTime();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (serverCart.length === 0 || submitting) return;
    setError('');

    // Validate area selection for rider delivery
    if (delivery === 'rider' && deliveryZones.length > 0 && !selectedAreaId) {
      setError('Please select your delivery area to proceed.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      await createOrder(serverCart, {
        shippingName: `${formData.get('firstName')} ${formData.get('lastName')}`,
        shippingEmail: formData.get('email') as string,
        shippingPhone: formData.get('phone') as string,
        shippingAddress: delivery === 'self-pickup'
          ? 'Self Pickup — Digital Shopping Mall, F27'
          : formData.get('address') as string,
        shippingCity: delivery === 'self-pickup'
          ? 'Nairobi'
          : formData.get('city') as string,
        paymentMethod: `mpesa${paymentOption === 'delivery-only' ? '-partial' : ''}`,
        notes: `Delivery: ${delivery}${selectedArea ? ` | Area: ${selectedArea.area_name} (${selectedArea.zone_name} - ${selectedArea.zone_label}) | Zone Fee: KES ${selectedArea.fee}` : ''}${delivery === 'self-pickup' ? ` (Ready by ${pickupReadyTime})` : ''}${paymentOption === 'delivery-only' ? ` | Balance on delivery: ${formatPrice(balanceOnDelivery)}` : ''}${formData.get('notes') ? ` | ${formData.get('notes')}` : ''}`,
        idempotencyKey: idempotencyKeyRef.current,
        deliveryAreaId: selectedAreaId ?? undefined,
      });

      await syncCart();
      router.push('/orders');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      idempotencyKeyRef.current = crypto.randomUUID();
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;
  if (loadingCart) return <div className="text-center py-20 text-[var(--text-light)]">Loading checkout...</div>;
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
            <Link href="/" className="text-[var(--copper)] hover:underline">Home</Link>
            {' / '}
            <Link href="/cart" className="text-[var(--copper)] hover:underline">Cart</Link>
            {' / Checkout'}
          </div>
        </div>
      </div>

      <div className="py-8 md:py-12 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-5">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 md:gap-12 items-start">
              <div>
                {/* Billing Details */}
                <h2 className="font-serif text-xl md:text-2xl mb-5 text-[var(--dark)]">Your Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">First Name *</label>
                    <input name="firstName" required placeholder="John" className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Last Name *</label>
                    <input name="lastName" required placeholder="Doe" className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Email *</label>
                  <input name="email" type="email" required placeholder="john@example.com" defaultValue={user?.email || ''} className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                </div>
                <div className="mb-6">
                  <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Phone (M-Pesa) *</label>
                  <input name="phone" type="tel" required placeholder="+254 7XX XXX XXX" className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                </div>

                {/* Delivery Options */}
                <h2 className="font-serif text-xl md:text-2xl mb-4 text-[var(--dark)]">Delivery Method</h2>
                <div className="flex flex-col gap-3 mb-6">
                  <label
                    onClick={() => setDelivery('rider')}
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${delivery === 'rider' ? 'border-[var(--copper)] bg-[rgba(44,95,99,0.05)]' : 'border-[var(--border)] hover:border-[var(--copper)]'}`}
                  >
                    <input type="radio" name="delivery" value="rider" checked={delivery === 'rider'} readOnly className="accent-[var(--copper)] mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-[var(--dark)]">🏍️ Our Rider</div>
                      <div className="text-xs text-[var(--text-light)] mt-0.5">We deliver to your doorstep within Nairobi & surroundings. {freeThreshold > 0 && subtotal >= freeThreshold ? 'Free delivery!' : selectedArea ? `KES ${selectedArea.fee} to ${selectedArea.area_name}.` : 'Select your area below to see the delivery fee.'}</div>
                    </div>
                  </label>
                  <label
                    onClick={() => { setDelivery('pickup-mtaani'); setSelectedAreaId(null); setAreaSearch(''); }}
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${delivery === 'pickup-mtaani' ? 'border-[var(--copper)] bg-[rgba(44,95,99,0.05)]' : 'border-[var(--border)] hover:border-[var(--copper)]'}`}
                  >
                    <input type="radio" name="delivery" value="pickup-mtaani" checked={delivery === 'pickup-mtaani'} readOnly className="accent-[var(--copper)] mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-[var(--dark)]">📦 Pick Up Mtaani</div>
                      <div className="text-xs text-[var(--text-light)] mt-0.5">We send to your nearest pickup point via courier. KES {pickupMtaaniFee} flat rate. Typically arrives within 1–2 business days.</div>
                    </div>
                  </label>
                  <label
                    onClick={() => { setDelivery('self-pickup'); setSelectedAreaId(null); setAreaSearch(''); }}
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${delivery === 'self-pickup' ? 'border-[var(--copper)] bg-[rgba(44,95,99,0.05)]' : 'border-[var(--border)] hover:border-[var(--copper)]'}`}
                  >
                    <input type="radio" name="delivery" value="self-pickup" checked={delivery === 'self-pickup'} readOnly className="accent-[var(--copper)] mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-[var(--dark)]">🏬 Self Pick Up{selfPickupFee === 0 ? ' — Free' : ` — KES ${selfPickupFee}`}</div>
                      <div className="text-xs text-[var(--text-light)] mt-0.5">
                        Collect from Digital Shopping Mall, F27, Nairobi. Your order will be ready by <span className="font-semibold text-[var(--copper)]">{pickupReadyTime}</span> (1 hour after order).
                      </div>
                    </div>
                  </label>
                </div>

                {/* Area selector for rider delivery */}
                {delivery === 'rider' && deliveryZones.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">
                      Select Your Delivery Area *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search area e.g. Westlands, Buruburu, Langata..."
                        value={areaSearch}
                        onChange={(e) => { setAreaSearch(e.target.value); setShowAreaDropdown(true); }}
                        onFocus={() => setShowAreaDropdown(true)}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors"
                      />
                      {selectedArea && !showAreaDropdown && (
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                          <span className="bg-[rgba(44,95,99,0.1)] text-[var(--copper)] px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-medium break-words max-w-full">
                            📍 {selectedArea.area_name} — {selectedArea.zone_label} ({selectedArea.zone_name}) — KES {selectedArea.fee}
                          </span>
                          <button
                            type="button"
                            onClick={() => { setSelectedAreaId(null); setAreaSearch(''); }}
                            className="text-[10px] md:text-xs text-red-500 hover:text-red-700 whitespace-nowrap"
                          >
                            Change
                          </button>
                        </div>
                      )}
                      {showAreaDropdown && (
                        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-[var(--border)] rounded-lg shadow-lg max-h-[min(16rem,50vh)] overflow-y-auto overscroll-contain">
                          {filteredAreas.length === 0 ? (
                            <div className="px-4 py-3 text-xs text-[var(--text-light)]">No areas found. Try a different search.</div>
                          ) : (
                            <>
                              {deliveryZones
                                .filter((z) => filteredAreas.some((a) => a.zone_name === z.zone_name))
                                .map((zone) => (
                                  <div key={zone.zone_name}>
                                    <div className="px-3 py-1.5 bg-gray-50 text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide sticky top-0 z-10">
                                      {zone.zone_name} — {zone.zone_label}
                                    </div>
                                    {filteredAreas
                                      .filter((a) => a.zone_name === zone.zone_name)
                                      .map((area) => (
                                        <button
                                          key={area.id}
                                          type="button"
                                          onClick={() => {
                                            setSelectedAreaId(area.id);
                                            setAreaSearch('');
                                            setShowAreaDropdown(false);
                                          }}
                                          className={`w-full text-left px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm hover:bg-[rgba(44,95,99,0.05)] flex justify-between items-center gap-2 transition-colors ${selectedAreaId === area.id ? 'bg-[rgba(44,95,99,0.08)]' : ''}`}
                                        >
                                          <span className="text-[var(--dark)] truncate">{area.area_name}</span>
                                          <span className="text-[10px] md:text-xs font-semibold text-[var(--copper)] whitespace-nowrap">KES {area.fee}</span>
                                        </button>
                                      ))}
                                  </div>
                                ))}
                              <button
                                type="button"
                                onClick={() => setShowAreaDropdown(false)}
                                className="w-full text-center py-2 text-xs text-[var(--text-light)] hover:bg-gray-50 border-t border-[var(--border)]"
                              >
                                Close
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {delivery === 'rider' && !selectedArea && (
                      <p className="text-xs text-amber-600 mt-1.5">Please select your delivery area to see the exact delivery fee.</p>
                    )}
                  </div>
                )}

                {/* Address fields (hidden for self-pickup) */}
                {delivery !== 'self-pickup' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">
                        {delivery === 'pickup-mtaani' ? 'Nearest Pickup Point / Area *' : 'Delivery Address *'}
                      </label>
                      <input name="address" required placeholder={delivery === 'pickup-mtaani' ? 'e.g. Westlands, CBD, Eastleigh' : 'Street address, apartment, etc.'} className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Town / City *</label>
                        <input name="city" required placeholder="Nairobi" className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">County</label>
                        <select name="county" className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors">
                          <option value="">Select County</option>
                          <option>Nairobi</option><option>Mombasa</option><option>Kisumu</option><option>Nakuru</option><option>Kiambu</option><option>Machakos</option><option>Nyeri</option><option>Other</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div className="mb-6">
                  <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Order Notes</label>
                  <textarea name="notes" placeholder="Special instructions..." className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors min-h-[80px] resize-y"></textarea>
                </div>

                {/* Payment Option for watches */}
                {hasWatchItems && (
                  <>
                    <h2 className="font-serif text-xl md:text-2xl mb-4 text-[var(--dark)]">Payment Option</h2>
                    <div className="flex flex-col gap-3 mb-6">
                      <label
                        onClick={() => setPaymentOption('full')}
                        className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${paymentOption === 'full' ? 'border-[var(--copper)] bg-[rgba(44,95,99,0.05)]' : 'border-[var(--border)] hover:border-[var(--copper)]'}`}
                      >
                        <input type="radio" name="payOption" value="full" checked={paymentOption === 'full'} readOnly className="accent-[var(--copper)] mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-[var(--dark)]">💰 Pay Full Amount Now</div>
                          <div className="text-xs text-[var(--text-light)] mt-0.5">Pay {formatPrice(total)} via M-Pesa and we ship immediately.</div>
                        </div>
                      </label>
                      <label
                        onClick={() => setPaymentOption('delivery-only')}
                        className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${paymentOption === 'delivery-only' ? 'border-[var(--copper)] bg-[rgba(44,95,99,0.05)]' : 'border-[var(--border)] hover:border-[var(--copper)]'}`}
                      >
                        <input type="radio" name="payOption" value="delivery-only" checked={paymentOption === 'delivery-only'} readOnly className="accent-[var(--copper)] mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-[var(--dark)]">🚚 Pay Delivery Fee Only</div>
                          <div className="text-xs text-[var(--text-light)] mt-0.5">
                            Pay {deliveryFee === 0 ? 'nothing now' : `${formatPrice(deliveryFee)} delivery fee`} now. Pay the remaining {formatPrice(subtotal)} on delivery after inspecting your items.
                          </div>
                        </div>
                      </label>
                    </div>
                  </>
                )}

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
                    {balanceOnDelivery > 0 && (
                      <div className="text-xs text-[var(--text-light)] mt-1">Balance on delivery: {formatPrice(balanceOnDelivery)}</div>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-light)] mt-3">
                    Send payment to the paybill above, then place your order. We&apos;ll confirm and process it within minutes.
                  </p>
                </div>

                <button type="submit" disabled={submitting} className="w-full bg-[var(--copper)] text-white py-3 md:py-3.5 rounded text-xs md:text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors lg:hidden disabled:opacity-50">
                  {submitting ? 'Processing...' : `Place Order — ${formatPrice(amountDueNow)}`}
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-[var(--bg-soft)] p-6 md:p-8 rounded-xl lg:sticky lg:top-24">
                <h3 className="font-serif text-lg md:text-xl mb-4 text-[var(--dark)]">Order Summary</h3>
                <div className="max-h-[300px] overflow-y-auto mb-4">
                  {serverCart.map((item) => (
                    <div key={item.id} className="flex items-center gap-2.5 md:gap-3.5 py-2.5 md:py-3 border-b border-[var(--border)]">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-md flex items-center justify-center text-xl md:text-2xl border border-[var(--border)] flex-shrink-0 overflow-hidden">
                        {item.product.image_url ? <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" /> : item.product.icon}
                      </div>
                      <div className="flex-1 text-xs md:text-sm font-medium text-[var(--dark)] min-w-0">
                        <div className="truncate">{item.product.name}</div>
                        <div className="text-[var(--text-light)]">× {item.quantity}</div>
                      </div>
                      <div className="text-xs md:text-sm font-semibold text-[var(--copper)] whitespace-nowrap">{formatPrice(item.product.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between py-2.5 border-b border-[var(--border)] text-xs md:text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-[var(--border)] text-xs md:text-sm">
                  <span>Delivery ({delivery === 'rider' ? (selectedArea ? selectedArea.area_name : 'Our Rider') : delivery === 'pickup-mtaani' ? 'Pickup Mtaani' : 'Self Pickup'})</span>
                  <span className="font-semibold">{deliveryFee === 0 ? 'Free' : delivery === 'rider' && !selectedArea && deliveryZones.length > 0 ? '—' : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between py-3 text-base md:text-lg font-bold text-[var(--dark)]">
                  <span>Total</span>
                  <span className="text-[var(--copper)]">{formatPrice(total)}</span>
                </div>
                {balanceOnDelivery > 0 && (
                  <div className="flex justify-between py-2 text-xs border-t border-[var(--border)]">
                    <span className="text-[var(--text-light)]">Pay now</span>
                    <span className="font-semibold text-[#4CAF50]">{formatPrice(amountDueNow)}</span>
                  </div>
                )}
                {balanceOnDelivery > 0 && (
                  <div className="flex justify-between py-2 text-xs">
                    <span className="text-[var(--text-light)]">Balance on delivery</span>
                    <span className="font-semibold">{formatPrice(balanceOnDelivery)}</span>
                  </div>
                )}
                <button type="submit" disabled={submitting} className="hidden lg:block w-full bg-[var(--copper)] text-white py-3 md:py-3.5 rounded text-xs md:text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors mt-5 disabled:opacity-50">
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
