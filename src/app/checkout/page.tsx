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

      <div className="py-12 pb-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-start">
            {/* Form */}
            <div>
              <h2 className="font-serif text-2xl mb-6 text-[var(--dark)]">Billing Details</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">First Name *</label>
                    <input required placeholder="John" className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Last Name *</label>
                    <input required placeholder="Doe" className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Email *</label>
                  <input type="email" required placeholder="john@example.com" className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Phone *</label>
                  <input type="tel" required placeholder="+254 7XX XXX XXX" className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">County *</label>
                  <select required className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors">
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
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Address *</label>
                  <input required placeholder="Street address, apartment, etc." className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Town / City *</label>
                    <input required placeholder="Nairobi" className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Postal Code</label>
                    <input placeholder="00100" className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                  </div>
                </div>
                <div className="mb-8">
                  <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Order Notes</label>
                  <textarea placeholder="Notes about your order..." className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors min-h-[100px] resize-y"></textarea>
                </div>

                <h2 className="font-serif text-2xl mb-5 text-[var(--dark)]">Payment Method</h2>
                <div className="flex flex-col gap-2.5 mb-6">
                  {[
                    { value: 'mpesa', label: '📱 M-PESA' },
                    { value: 'card', label: '💳 Credit/Debit Card' },
                    { value: 'cod', label: '🚚 Cash on Delivery' },
                  ].map(option => (
                    <label 
                      key={option.value}
                      className={`flex items-center gap-2.5 p-3.5 border rounded cursor-pointer transition-all ${paymentMethod === option.value ? 'border-[var(--copper)] bg-[rgba(44,95,99,0.05)]' : 'border-[var(--border)] hover:border-[var(--copper)]'}`}
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

                <button type="submit" className="w-full bg-[var(--copper)] text-white py-3.5 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors lg:hidden">
                  Place Order — {formatPrice(total)}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-[var(--bg-soft)] p-8 rounded-xl sticky top-24">
              <h3 className="font-serif text-xl mb-5 text-[var(--dark)]">Order Summary</h3>
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3.5 py-3 border-b border-[var(--border)]">
                  <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center text-2xl border border-[var(--border)]">{item.icon}</div>
                  <div className="flex-1 text-sm font-medium text-[var(--dark)]">{item.name} × {item.qty}</div>
                  <div className="text-sm font-semibold text-[var(--copper)]">{formatPrice(item.price * item.qty)}</div>
                </div>
              ))}
              <div className="flex justify-between py-3 border-b border-[var(--border)] text-sm mt-4">
                <span>Subtotal</span>
                <span className="text-[var(--copper)] font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[var(--border)] text-sm">
                <span>Shipping</span>
                <span className="text-[var(--copper)] font-semibold">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between py-4 text-lg font-bold text-[var(--dark)]">
                <span>Total</span>
                <span className="text-[var(--copper)] text-xl">{formatPrice(total)}</span>
              </div>
              <button 
                type="submit"
                form="checkoutForm"
                onClick={handleSubmit}
                className="w-full bg-[var(--copper)] text-white py-3.5 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors mt-5"
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
