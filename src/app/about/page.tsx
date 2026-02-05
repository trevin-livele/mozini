import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[var(--bg-soft)] to-[var(--copper-pale)] py-20 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="font-serif text-5xl text-[var(--dark)] mb-4">About Mozini</h1>
          <p className="text-base text-[var(--text)] max-w-[600px] mx-auto leading-relaxed">
            Your premier destination for quality watches and unique gifts. We curate exceptional timepieces and thoughtful gifts that make every moment memorable.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          {/* Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            <div className="h-[400px] bg-gradient-to-br from-[var(--copper-pale)] to-[var(--bg-soft)] rounded-xl flex items-center justify-center text-[100px] opacity-50">
              ⌚
            </div>
            <div>
              <h2 className="font-serif text-3xl text-[var(--dark)] mb-4">Our Story</h2>
              <p className="text-sm leading-relaxed text-[var(--text)] mb-4">
                Mozini was born from a passion to offer quality watches and unique gifts to Kenyans. We carefully select premium timepieces and distinctive fragrances that combine style with functionality.
              </p>
              <p className="text-sm leading-relaxed text-[var(--text)]">
                Each product is chosen for its quality, design excellence, and value, ensuring our customers receive only the best.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16" style={{ direction: 'rtl' }}>
            <div className="h-[400px] bg-gradient-to-br from-[var(--copper-pale)] to-[var(--bg-soft)] rounded-xl flex items-center justify-center text-[100px] opacity-50" style={{ direction: 'ltr' }}>
              🎁
            </div>
            <div style={{ direction: 'ltr' }}>
              <h2 className="font-serif text-3xl text-[var(--dark)] mb-4">Our Mission</h2>
              <p className="text-sm leading-relaxed text-[var(--text)]">
                To provide Kenyans with access to quality watches and thoughtful gifts that celebrate life&apos;s special moments. We&apos;re committed to exceptional customer service and authentic products.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center py-10 border-t border-b border-[var(--border)]">
            <div>
              <div className="font-serif text-4xl font-bold text-[var(--copper)] mb-1">5,000+</div>
              <div className="text-sm uppercase tracking-wider text-[var(--text-light)]">Happy Customers</div>
            </div>
            <div>
              <div className="font-serif text-4xl font-bold text-[var(--copper)] mb-1">200+</div>
              <div className="text-sm uppercase tracking-wider text-[var(--text-light)]">Unique Products</div>
            </div>
            <div>
              <div className="font-serif text-4xl font-bold text-[var(--copper)] mb-1">47</div>
              <div className="text-sm uppercase tracking-wider text-[var(--text-light)]">Counties Served</div>
            </div>
            <div>
              <div className="font-serif text-4xl font-bold text-[var(--copper)] mb-1">6+</div>
              <div className="text-sm uppercase tracking-wider text-[var(--text-light)]">Years of Trust</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
