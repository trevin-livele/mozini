'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { products, formatPrice } from '@/lib/data';
import { useStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';

export default function ProductPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const product = products.find(p => p.id === productId);
  
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="font-serif text-3xl text-[var(--dark)] mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-[var(--copper)] hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const handleShare = () => {
    const message = `Check out this item from Mozini Watches & Gifts:\n\n${product.name}\nPrice: ${formatPrice(product.price)}\n\nVisit: ${window.location.href}`;
    window.open(`https://wa.me/254115757568?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <div className="bg-[var(--bg-soft)] py-6">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-sm text-[var(--text-light)]">
            <Link href="/" className="text-[var(--copper)] hover:underline">Home</Link>
            {' / '}
            <Link href="/shop" className="text-[var(--copper)] hover:underline">Shop</Link>
            {' / '}
            <span>{product.name}</span>
          </div>
        </div>
      </div>

      <div className="py-12 pb-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Image */}
            <div>
              <div className="w-full h-[450px] bg-[var(--bg-soft)] rounded-xl flex items-center justify-center text-[140px] mb-4">
                {product.icon}
              </div>
              <div className="flex gap-2.5">
                {[product.icon, '🔍', '📦', '🎁'].map((icon, i) => (
                  <div key={i} className={`w-20 h-20 bg-[var(--bg-soft)] rounded-lg flex items-center justify-center text-3xl border-2 cursor-pointer transition-all ${i === 0 ? 'border-[var(--copper)]' : 'border-transparent hover:border-[var(--copper)]'}`}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="text-xs uppercase tracking-[2px] text-[var(--copper)] mb-2">{product.brand}</div>
              <h1 className="font-serif text-3xl font-semibold text-[var(--dark)] mb-3 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#F4B942]">{'★'.repeat(4)}{'☆'.repeat(1)}</span>
                <span className="text-sm text-[var(--text-light)]">({Math.floor(Math.random() * 50 + 5)} Reviews)</span>
              </div>

              <div className="flex items-center gap-3.5 mb-6 py-4 border-t border-b border-[var(--border)] flex-wrap">
                <span className="text-3xl font-bold text-[var(--copper)]">{formatPrice(product.price)}</span>
                {product.oldPrice > 0 && (
                  <>
                    <span className="text-lg text-[var(--text-light)] line-through">{formatPrice(product.oldPrice)}</span>
                    <span className="bg-[var(--red)] text-white px-3 py-1 rounded-full text-xs font-semibold">{discount}% OFF</span>
                  </>
                )}
              </div>

              <p className="text-sm leading-relaxed text-[var(--text)] mb-6">{product.desc}</p>

              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-medium text-[var(--dark)]">Quantity:</label>
                <div className="flex items-center border border-[var(--border)] rounded overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-lg hover:bg-[var(--bg-soft)] hover:text-[var(--copper)] transition-colors">−</button>
                  <input type="text" value={qty} readOnly className="w-12 h-10 text-center text-[15px] font-medium border-x border-[var(--border)]" />
                  <button onClick={() => setQty(Math.min(20, qty + 1))} className="w-10 h-10 flex items-center justify-center text-lg hover:bg-[var(--bg-soft)] hover:text-[var(--copper)] transition-colors">+</button>
                </div>
              </div>

              <div className="flex gap-3 mb-6 flex-wrap">
                <button onClick={handleAddToCart} className="bg-[var(--copper)] text-white px-8 py-3 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors">
                  🛒 Add to Cart
                </button>
                <button 
                  onClick={() => toggleWishlist(product.id)} 
                  className={`px-5 py-3 rounded text-sm font-medium uppercase tracking-wider border-2 transition-colors ${inWishlist ? 'bg-[var(--copper)] text-white border-[var(--copper)]' : 'border-[var(--copper)] text-[var(--copper)] hover:bg-[var(--copper)] hover:text-white'}`}
                >
                  {inWishlist ? '♥ In Wishlist' : '♡ Wishlist'}
                </button>
                <button onClick={handleShare} className="px-5 py-3 rounded text-sm font-medium uppercase tracking-wider border-2 border-[var(--copper)] text-[var(--copper)] hover:bg-[var(--copper)] hover:text-white transition-colors">
                  📤 Share
                </button>
              </div>

              <div className="text-sm text-[var(--text-light)] leading-8">
                <div><strong className="text-[var(--dark)] font-medium">SKU:</strong> MZ-{String(product.id).padStart(4, '0')}</div>
                <div><strong className="text-[var(--dark)] font-medium">Category:</strong> {product.category}</div>
                <div><strong className="text-[var(--dark)] font-medium">Availability:</strong> <span className="text-[var(--green)]">In Stock</span></div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16 border-t border-[var(--border)]">
            <div className="flex border-b border-[var(--border)]">
              {['Description', 'Additional Info', 'Reviews'].map((tab, i) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === i ? 'text-[var(--copper)] border-[var(--copper)]' : 'text-[var(--text-light)] border-transparent hover:text-[var(--copper)]'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="py-8 text-sm leading-relaxed text-[var(--text)]">
              {activeTab === 0 && <p>{product.desc} Comes in signature Mozini gift box with certificate of authenticity.</p>}
              {activeTab === 1 && (
                <p>
                  <strong>Material:</strong> Premium Quality<br/>
                  <strong>Warranty:</strong> 1 Year<br/>
                  <strong>Origin:</strong> Kenya<br/>
                  <strong>Packaging:</strong> Gift Box Included
                </p>
              )}
              {activeTab === 2 && <p>No reviews yet. Be the first to review this product!</p>}
            </div>
          </div>

          {/* Related */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-serif text-3xl font-semibold text-[var(--dark)] mb-10 text-center relative after:content-[''] after:block after:w-12 after:h-0.5 after:bg-[var(--copper)] after:mx-auto after:mt-3">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
