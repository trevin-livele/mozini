'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/data';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useStore();
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  
  const subtotal = getCartTotal();
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    alert('🎉 Order placed! Thank you for shopping with Mozini.');
    clearCart();
    router.push('/');
  };

  if (cart.length === 0) {
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
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 md:gap-12 items-start">
            {/* Form */}
            <div>
              <h2 className="font-serif text-xl md:text-2xl mb-5 md:mb-6 text-[var(--dark)]">Billing Details</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-5">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">First Name *</label>
                    <input required placeholder="John" className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Last Name *</label>
                    <input required placeholder="Doe" className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                  </div>
                </div>
                <div className="mb-4 md:mb-5">
                  <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Email *</label>
                  <input type="email" required placeholder="john@example.com" className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                </div>
                <div className="mb-4 md:mb-5">
                  <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Phone *</label>
                  <input type="tel" required placeholder="+254 7XX XXX XXX" className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                </div>
                <div className="mb-4 md:mb-5">
                  <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">County *</label>
                  <select required className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors">
                    <option value="">Select County</option>
                    <option>Nairobi</option>
                    <option>Mombasa</option>
                    <option>Kisumu</option>
                    <option>Nakuru</option>
                    <option>Kiambu</option>
                    <option>Machakos</option>
                    <option>Nyeri</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="mb-4 md:mb-5">
                  <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Address *</label>
                  <input required placeholder="Street address, apartment, etc." className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-5">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Town / City *</label>
                    <input required placeholder="Nairobi" className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Postal Code</label>
                    <input placeholder="00100" className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                  </div>
                </div>
                <div className="mb-6 md:mb-8">
                  <label className="block text-xs md:text-sm font-medium text-[var(--dark)] mb-1.5">Order Notes</label>
                  <textarea placeholder="Notes about your order..." className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors min-h-[80px] md:min-h-[100px] resize-y"></textarea>
                </div>

                <h2 className="font-serif text-xl md:text-2xl mb-4 md:mb-5 text-[var(--dark)]">Payment Method</h2>
                <div className="flex flex-col gap-2 md:gap-2.5 mb-5 md:mb-6">
                  {[
                    { value: 'mpesa', label: '📱 M-PESA' },
                    { value: 'card', label: '💳 Credit/Debit Card' },
                    { value: 'cod', label: '🚚 Cash on Delivery' },
                  ].map(option => (
                    <label 
                      key={option.value}
                      className={`flex items-center gap-2.5 p-3 md:p-3.5 border rounded cursor-pointer transition-all text-sm ${paymentMethod === option.value ? 'border-[var(--copper)] bg-[rgba(44,95,99,0.05)]' : 'border-[var(--border)] hover:border-[var(--copper)]'}`}
                    >
                      <input 
                        type="radio" 
                        name="payment" 
                        value={option.value}
                        checked={paymentMethod === option.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-[var(--copper)]"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>

                <button type="submit" className="w-full bg-[var(--copper)] text-white py-3 md:py-3.5 rounded text-xs md:text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors lg:hidden">
                  Place Order — {formatPrice(total)}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-[var(--bg-soft)] p-6 md:p-8 rounded-xl lg:sticky lg:top-24">
              <h3 className="font-serif text-lg md:text-xl mb-4 md:mb-5 text-[var(--dark)]">Order Summary</h3>
              <div className="max-h-[300px] overflow-y-auto mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-2.5 md:gap-3.5 py-2.5 md:py-3 border-b border-[var(--border)]">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-md flex items-center justify-center text-xl md:text-2xl border border-[var(--border)] flex-shrink-0">{item.icon}</div>
                    <div className="flex-1 text-xs md:text-sm font-medium text-[var(--dark)] min-w-0">
                      <div className="truncate">{item.name}</div>
                      <div className="text-[var(--text-light)]">× {item.qty}</div>
                    </div>
                    <div className="text-xs md:text-sm font-semibold text-[var(--copper)] whitespace-nowrap">{formatPrice(item.price * item.qty)}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between py-2.5 md:py-3 border-b border-[var(--border)] text-xs md:text-sm">
                <span>Subtotal</span>
                <span className="text-[var(--copper)] font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between py-2.5 md:py-3 border-b border-[var(--border)] text-xs md:text-sm">
                <span>Shipping</span>
                <span className="text-[var(--copper)] font-semibold">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between py-3 md:py-4 text-base md:text-lg font-bold text-[var(--dark)]">
                <span>Total</span>
                <span className="text-[var(--copper)] text-lg md:text-xl">{formatPrice(total)}</span>
              </div>
              <button 
                type="submit"
                form="checkoutForm"
                onClick={handleSubmit}
                className="hidden lg:block w-full bg-[var(--copper)] text-white py-3 md:py-3.5 rounded text-xs md:text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors mt-4 md:mt-5"
              >
                Place Order — {formatPrice(total)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
