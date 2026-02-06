# Mozini - Watches & Gifts Kenya

A modern e-commerce platform for watches, perfumes, and gift sets built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🛍️ **Product Catalog**: Watches (Men's, Women's, Unisex), Perfumes, and Gift Sets
- 🛒 **Shopping Cart**: Persistent cart with Zustand state management
- ❤️ **Wishlist**: Save favorite items
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop
- 💳 **Checkout**: M-PESA, Card, and Cash on Delivery options
- 🇰🇪 **Kenya-Focused**: KES currency, counties, local payment methods
- 📤 **WhatsApp Integration**: Share products directly
- 🎨 **Modern UI**: Clean design with smooth animations

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Homepage
│   ├── shop/              # Product listing
│   ├── product/[id]/      # Product details
│   ├── cart/              # Shopping cart
│   ├── wishlist/          # Saved items
│   ├── checkout/          # Checkout flow
│   ├── about/             # About page
│   └── contact/           # Contact form
├── components/            # Reusable components
│   ├── Header.tsx         # Navigation & cart
│   ├── Footer.tsx         # Footer links
│   ├── ProductCard.tsx    # Product display
│   └── Toast.tsx          # Notifications
└── lib/                   # Utilities
    ├── data.ts            # Product catalog
    └── store.ts           # Zustand store
```

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js and deploy

Or use Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Customization

### Update Products

Edit `src/lib/data.ts` to modify products, categories, and prices.

### Change Colors

Update CSS variables in `src/app/globals.css`:

```css
:root {
  --copper: #2C5F63;
  --copper-light: #3A7A7F;
  --copper-dark: #1F4447;
  /* ... */
}
```

### Contact Information

Update WhatsApp number and contact details in:
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/app/contact/page.tsx`

## Features Breakdown

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile
- Touch-friendly buttons
- Optimized images and layouts
- No horizontal scrolling

### State Management
- Cart persists in localStorage
- Wishlist syncs across tabs
- Real-time badge updates
- Optimistic UI updates

### Performance
- Static page generation
- Optimized images
- Code splitting
- Fast page transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

All rights reserved © 2026 Mozini

## Contact

- **Location**: Digital Shopping Mall, F27, Nairobi
- **WhatsApp**: +254 115 757 568
- **Email**: info@mozini.co.ke
- **Hours**: Mon–Sat: 9AM–7PM

## Social Media

- Instagram: [@mozini_gifts](https://www.instagram.com/mozini_gifts)
- TikTok: [@mozini_watches](https://www.tiktok.com/@mozini_watches)
