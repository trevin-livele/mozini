'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { type Product, formatPrice } from '@/lib/data';
import { getProductById, getRelatedProducts } from '@/lib/actions/products';
import { useStore } from '@/lib/store';
import { useAuth } from '@/components/AuthProvider';
import ProductCard from '@/components/ProductCard';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [adding, setAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    getProductById(productId)
      .then((p) => {
        setProduct(p);
        if (p) {
          getRelatedProducts(p.category, p.id).then(setRelated);
        }
      })
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return <div className="text-center py-20 text-[var(--text-light)]">Loading...</div>;
  }

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

  const handleAddToCart = async () => {
    if (!user) { router.push('/login?redirectTo=/product/' + product.id); return; }
    setAdding(true);
    await addToCart(product, qty);
    setAdding(false);
  };

  const handleToggleWishlist = async () => {
    if (!user) { router.push('/login?redirectTo=/product/' + product.id); return; }
    await toggleWishlist(product.id);
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

      <div className="py-8 md:py-12 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
            <div>
              <div className="w-full h-[300px] md:h-[400px] lg:h-[450px] bg-[var(--bg-soft)] rounded-xl flex items-center justify-center overflow-hidden mb-3 md:mb-4">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[100px] md:text-[120px] lg:text-[140px]">{[product.icon, '🔍', '📦', '🎁'][selectedImage]}</span>
                )}
              </div>
              {!product.image_url && (
              <div className="flex gap-2 md:gap-2.5 overflow-x-auto pb-2">
                {[product.icon, '🔍', '📦', '🎁'].map((icon, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 md:w-20 md:h-20 bg-[var(--bg-soft)] rounded-lg flex items-center justify-center text-2xl md:text-3xl border-2 cursor-pointer transition-all flex-shrink-0 ${selectedImage === i ? 'border-[var(--copper)]' : 'border-transparent hover:border-[var(--copper)]'}`}
                  >
                    {icon}
                  </div>
                ))}
              </div>
              )}
            </div>

            <div>
              <div className="text-xs uppercase tracking-[2px] text-[var(--copper)] mb-2">{product.brand}</div>
              <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[var(--dark)] mb-3 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#F4B942] text-sm md:text-base">{'★'.repeat(4)}{'☆'.repeat(1)}</span>
              </div>
              <div className="flex items-center gap-3 md:gap-3.5 mb-5 md:mb-6 py-3 md:py-4 border-t border-b border-[var(--border)] flex-wrap">
                <span className="text-2xl md:text-3xl font-bold text-[var(--copper)]">{formatPrice(product.price)}</span>
                {product.oldPrice > 0 && (
                  <>
                    <span className="text-base md:text-lg text-[var(--text-light)] line-through">{formatPrice(product.oldPrice)}</span>
                    <span className="bg-[var(--red)] text-white px-2.5 md:px-3 py-1 rounded-full text-xs font-semibold">{discount}% OFF</span>
                  </>
                )}
              </div>
              <p className="text-sm leading-relaxed text-[var(--text)] mb-5 md:mb-6">{product.desc}</p>
              <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6 flex-wrap">
                <label className="text-sm font-medium text-[var(--dark)]">Quantity:</label>
                <div className="flex items-center border border-[var(--border)] rounded overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-lg hover:bg-[var(--bg-soft)] hover:text-[var(--copper)] transition-colors">−</button>
                  <input type="text" value={qty} readOnly className="w-10 md:w-12 h-9 md:h-10 text-center text-sm md:text-[15px] font-medium border-x border-[var(--border)]" />
                  <button onClick={() => setQty(Math.min(20, qty + 1))} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-lg hover:bg-[var(--bg-soft)] hover:text-[var(--copper)] transition-colors">+</button>
                </div>
              </div>
              <div className="flex gap-2 md:gap-3 mb-5 md:mb-6 flex-wrap">
                <button onClick={handleAddToCart} disabled={adding} className="flex-1 min-w-[200px] bg-[var(--copper)] text-white px-6 md:px-8 py-2.5 md:py-3 rounded text-xs md:text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors disabled:opacity-50">
                  {adding ? 'Adding...' : '🛒 Add to Cart'}
                </button>
                <button onClick={handleToggleWishlist} className={`px-4 md:px-5 py-2.5 md:py-3 rounded text-xs md:text-sm font-medium uppercase tracking-wider border-2 transition-colors ${inWishlist ? 'bg-[var(--copper)] text-white border-[var(--copper)]' : 'border-[var(--copper)] text-[var(--copper)] hover:bg-[var(--copper)] hover:text-white'}`}>
                  {inWishlist ? '♥' : '♡'}
                </button>
                <button onClick={handleShare} className="px-4 md:px-5 py-2.5 md:py-3 rounded text-xs md:text-sm font-medium uppercase tracking-wider border-2 border-[var(--copper)] text-[var(--copper)] hover:bg-[var(--copper)] hover:text-white transition-colors">📤</button>
              </div>
              <div className="text-xs md:text-sm text-[var(--text-light)] leading-7 md:leading-8">
                <div><strong className="text-[var(--dark)] font-medium">SKU:</strong> MZ-{String(product.id).padStart(4, '0')}</div>
                <div><strong className="text-[var(--dark)] font-medium">Category:</strong> {product.category}</div>
                <div><strong className="text-[var(--dark)] font-medium">Availability:</strong> <span className="text-[var(--green)]">In Stock</span></div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-12 md:mt-16 border-t border-[var(--border)]">
            <div className="flex border-b border-[var(--border)] overflow-x-auto">
              {['Description', 'Additional Info', 'Reviews'].map((tab, i) => (
                <button key={tab} onClick={() => setActiveTab(i)} className={`px-5 md:px-8 py-3 md:py-4 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === i ? 'text-[var(--copper)] border-[var(--copper)]' : 'text-[var(--text-light)] border-transparent hover:text-[var(--copper)]'}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="py-6 md:py-8 text-sm leading-relaxed text-[var(--text)]">
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
          {related.length > 0 && (
            <div className="mt-12 md:mt-16">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[var(--dark)] mb-8 md:mb-10 text-center relative after:content-[''] after:block after:w-12 after:h-0.5 after:bg-[var(--copper)] after:mx-auto after:mt-3">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {related.map((p) => (
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
