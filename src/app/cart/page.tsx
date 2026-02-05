'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { formatPrice, products } from '@/lib/data';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQty, getCartTotal } = useStore();
  
  const subtotal = getCartTotal();
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <>
        <div className="bg-[var(--bg-soft)] py-12 text-center">
          <div className="max-w-6xl mx-auto px-5">
            <h1 className="font-serif text-4xl text-[var(--dark)] mb-2">Shopping Cart</h1>
            <div className="text-sm text-[var(--text-light)]">
              <Link href="/" className="text-[var(--copper)] hover:underline">Home</Link> / Cart
            </div>
          </div>
        </div>
        <div className="py-12 pb-20">
          <div className="max-w-6xl mx-auto px-5 text-center py-20">
            <div className="text-6xl mb-5 opacity-60">🛒</div>
            <h2 className="font-serif text-2xl text-[var(--dark)] mb-3">Your Cart is Empty</h2>
            <p className="text-[var(--text-light)] mb-7">Looks like you haven&apos;t added any items yet.</p>
            <Link href="/shop" className="inline-block bg-[var(--copper)] text-white px-8 py-3 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors">
              Start Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-[var(--bg-soft)] py-12 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="font-serif text-4xl text-[var(--dark)] mb-2">Shopping Cart</h1>
          <div className="text-sm text-[var(--text-light)]">
            <Link href="/" className="text-[var(--copper)] hover:underline">Home</Link> / Cart
          </div>
        </div>
      </div>

      <div className="py-12 pb-20">
        <div className="max-w-6xl mx-auto px-5">
          {/* Cart Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[var(--border)]">
                  <th className="text-left p-4 text-sm font-semibold uppercase tracking-wide text-[var(--dark)]">Product</th>
                  <th className="text-left p-4 text-sm font-semibold uppercase tracking-wide text-[var(--dark)]">Price</th>
                  <th className="text-left p-4 text-sm font-semibold uppercase tracking-wide text-[var(--dark)]">Qty</th>
                  <th className="text-left p-4 text-sm font-semibold uppercase tracking-wide text-[var(--dark)]">Total</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.id} className="border-b border-[var(--border)]">
                    <td className="p-4">
                      <Link href={`/product/${item.id}`} className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-[var(--bg-soft)] rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[var(--dark)] hover:text-[var(--copper)]">{item.name}</div>
                          <div className="text-[11px] text-[var(--text-light)] uppercase tracking-wide">{item.brand}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="p-4 text-[15px] font-semibold text-[var(--copper)]">{formatPrice(item.price)}</td>
                    <td className="p-4">
                      <div className="flex items-center border border-[var(--border)] rounded overflow-hidden w-fit">
                        <button onClick={() => updateCartQty(item.id, -1)} className="w-10 h-10 flex items-center justify-center text-lg hover:bg-[var(--bg-soft)] hover:text-[var(--copper)] transition-colors">−</button>
                        <input type="text" value={item.qty} readOnly className="w-12 h-10 text-center text-[15px] font-medium border-x border-[var(--border)]" />
                        <button onClick={() => updateCartQty(item.id, 1)} className="w-10 h-10 flex items-center justify-center text-lg hover:bg-[var(--bg-soft)] hover:text-[var(--copper)] transition-colors">+</button>
                      </div>
                    </td>
                    <td className="p-4 text-[15px] font-semibold text-[var(--copper)]">{formatPrice(item.price * item.qty)}</td>
                    <td className="p-4">
                      <button onClick={() => removeFromCart(item.id)} className="text-[var(--red)] text-lg p-1.5 rounded-full hover:bg-red-50 transition-colors">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
            <div className="flex gap-2.5">
              <input type="text" placeholder="Coupon code" className="flex-1 px-4 py-3 border border-[var(--border)] rounded text-sm" />
              <button className="bg-[var(--copper)] text-white px-6 py-3 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors">Apply</button>
            </div>

            <div className="bg-[var(--bg-soft)] p-8 rounded-xl">
              <h3 className="font-serif text-xl mb-5 text-[var(--dark)]">Cart Totals</h3>
              <div className="flex justify-between py-3 border-b border-[var(--border)] text-sm">
                <span>Subtotal</span>
                <span className="text-[var(--copper)] font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[var(--border)] text-sm">
                <span>Shipping</span>
                <span className="text-[var(--copper)] font-semibold">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              {shipping === 0 && (
                <div className="text-xs text-[var(--green)] py-1">✅ Free shipping above KES 10,000</div>
              )}
              <div className="flex justify-between py-4 text-lg font-bold text-[var(--dark)]">
                <span>Total</span>
                <span className="text-[var(--copper)]">{formatPrice(total)}</span>
              </div>
              <Link href="/checkout" className="block w-full bg-[var(--copper)] text-white text-center py-3 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors mt-4">
                Proceed to Checkout
              </Link>
              <Link href="/shop" className="block w-full border-2 border-[var(--copper)] text-[var(--copper)] text-center py-3 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper)] hover:text-white transition-colors mt-2.5">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
