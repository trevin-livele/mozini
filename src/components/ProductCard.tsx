'use client';

import Link from 'next/link';
import { Product, formatPrice } from '@/lib/data';
import { useStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const getBadgeClass = () => {
    if (product.badge === 'sale') return 'bg-[var(--red)]';
    if (product.badge === 'hot') return 'bg-[var(--orange)]';
    return 'bg-[var(--copper)]';
  };

  const getBadgeText = () => {
    if (product.badge === 'sale') return 'Sale';
    if (product.badge === 'hot') return 'Hot';
    if (product.badge) return product.badge;
    return '';
  };

  return (
    <Link href={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden border border-[var(--border)] relative cursor-pointer transition-all hover:shadow-lg hover:border-transparent hover:-translate-y-1 group">
        {product.badge && (
          <span className={`absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide text-white ${getBadgeClass()}`}>
            {getBadgeText()}
          </span>
        )}
        
        <div className="relative h-[220px] bg-[var(--bg-soft)] flex items-center justify-center overflow-hidden">
          <span className="text-7xl transition-transform group-hover:scale-110 group-hover:rotate-[5deg]">{product.icon}</span>
          
          <div className="absolute bottom-[-50px] left-0 right-0 flex justify-center gap-2 p-2.5 transition-all group-hover:bottom-2.5">
            <button 
              onClick={handleAddToCart}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-[var(--copper)] hover:text-white hover:scale-110 transition-all"
              title="Add to Cart"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </button>
            <button 
              onClick={handleToggleWishlist}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all ${inWishlist ? 'bg-[var(--red)] text-white' : 'bg-white hover:bg-[var(--copper)] hover:text-white'}`}
              title="Wishlist"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="text-[11px] uppercase tracking-wider text-[var(--text-light)] mb-1">{product.brand}</div>
          <div className="text-sm font-medium text-[var(--dark)] mb-2 truncate">{product.name}</div>
          <div className="flex items-center gap-2">
            {product.oldPrice > 0 && (
              <span className="text-sm text-[var(--text-light)] line-through">{formatPrice(product.oldPrice)}</span>
            )}
            <span className="text-[15px] font-semibold text-[var(--copper)]">{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
