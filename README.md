# Teddy Bear Kenya

Premium teddy bear e-commerce site for Kenya — inspired by [Teddy Bear Haven](https://teddybearhaven.co.ke/), built with Next.js 14.

## Features

- **Home** – Hero, exclusive collections, shop by category, trending bears, customer reviews, Instagram feed
- **Shop** – 16 teddy bear products with search, filters, sorting, pagination
- **Product pages** – Size variants, name customisation, wishlist, add to cart
- **Cart drawer** – Slide-out cart with quantity controls
- **Checkout** – Delivery form, M-Pesa till / card / cash on delivery
- **Wishlist** – Save favourites (persisted in browser)
- **Account** – Register / login, order history
- **Contact** – Yala Towers location, Google Maps, WhatsApp, M-Pesa details

All prices in **Kenyan Shillings (KSh)**. Cart, wishlist, auth, and orders persist in `localStorage` (no backend required).

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Lucide icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for production

```bash
npm run build
npm start
```

## Go live (Vercel)

1. Push this repo to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Set environment variable: `NEXT_PUBLIC_SITE_URL=https://yourdomain.co.ke`
4. Deploy — Vercel runs `npm run build` automatically

Update business details in **`src/lib/site.ts`** (phone, M-Pesa till, address, domain).

## Product images

Images live in **`public/images/`**:

| File | Use |
|------|-----|
| `image1.jpg` … `image16.webp` | Product photos (see `src/lib/images.ts`) |
| `hero.webp` | Homepage hero |
| `logo.png` | Site logo |
| `category-giant.webp`, `category-personalised.webp` | Category banners |
| `testimonial1.jpg` … `testimonial7.jpg` | Customer review photos |

Replace any file to update photos — refresh the browser after uploading.

## Customize

- **Products**: `src/data/products.ts`
- **Categories**: `src/data/categories.ts`
- **Business info**: `src/lib/site.ts`
- **Branding / colors**: `tailwind.config.ts`

## Deploy elsewhere

Works on Netlify, Railway, or any Node.js host. For live M-Pesa payments, integrate [Safaricom Daraja API](https://developer.safaricom.co.ke/) in checkout.
