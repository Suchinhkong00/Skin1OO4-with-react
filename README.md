# SKIN1004 — React + Firebase

Migrated from the original vanilla HTML/CSS/JS site. Same design, branding, and copy —
now running on React (Vite) with Firebase Authentication + Firestore.

## What was reused vs. rebuilt

- **Design & branding**: 100% reused. `src/styles/legacy.css` is your original `style.css`,
  byte-for-byte, unchanged. `src/styles/additions.css` contains *only* the new rules needed for
  features that didn't exist before (cart page styling, admin dashboard, auth forms, loaders).
- **Copy/content**: every heading, paragraph, and testimonial from `about.html`,
  `why-choose-us.html`, `contact.html`, `products.html` is carried over verbatim into the
  matching React page component.
- **Product data**: `data/products.js` became `src/data/seedProducts.js`, used to seed Firestore
  once (see below) and as an offline fallback.
- **Cart logic**: `js/storage.js` became `src/context/CartContext.jsx` (same localStorage
  behavior, now as a React context/hook).
- **New**: Firebase Auth (Login/Register/Forgot Password), Firestore-backed product CRUD, an
  Admin Dashboard, product detail pages, search + category filtering, pagination, toast
  notifications, loading states, and a 404/error page.

## 1. Install dependencies

```bash
npm install
```

## 2. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com) → **Add project**.
2. In your project, go to **Build → Authentication → Sign-in method** and enable **Email/Password**.
3. Go to **Build → Firestore Database → Create database** (start in production mode).
4. Go to **Project settings → General → Your apps → Add app → Web**, copy the config values.

## 3. Configure environment variables

```bash
cp .env.example .env
```

Paste your Firebase config values into `.env`.

## 4. Deploy Firestore security rules

Using the Firebase CLI (`npm install -g firebase-tools`, then `firebase login`, `firebase init firestore`),
deploy the included `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

These rules let anyone read products, but only admins create/update/delete them, and users can
only read/write their own account document.

## 5. Seed the product catalog (optional but recommended)

```bash
npm run seed
```

This pushes the 7 original products into your `products` Firestore collection. Without this
step, the storefront still works using local fallback data, but nothing you add via the Admin
Dashboard will be visible to other users until Firestore has real data.

## 6. Run the app

```bash
npm run dev
```

## 7. Make yourself an admin

By default, every new registered account gets `role: "customer"` in Firestore
(`users/{uid}`). To make an account an admin:

1. Register normally through the app.
2. In the Firebase Console, go to **Firestore Database → users → (your uid)**.
3. Change the `role` field from `"customer"` to `"admin"`.
4. Refresh the app — the "Dashboard" link now appears in the navbar, and `/admin` is accessible.

This manual step is intentional: it keeps privilege escalation out of client-side code (see
`firestore.rules`, which blocks a user from setting their own role).

## Project structure

```
src/
├── components/     Navbar, Footer, ProductCard, Loader, ProtectedRoute, AdminRoute, etc.
├── context/         AuthContext, CartContext, ProductsContext (Firestore CRUD)
├── data/            seedProducts.js (original catalog, used for seeding + fallback)
├── firebase/        config.js (reads .env)
├── pages/           Home, About, Contact, Products, ProductDetails, Cart, Login,
│                    Register, ForgotPassword, NotFound, admin/AdminDashboard, admin/ProductForm
├── styles/          legacy.css (original, untouched) + additions.css (new components only)
scripts/
└── seedProducts.js  one-time Firestore seed script
```

## Known follow-ups / not implemented

- Checkout is UI-only (button present, no payment integration — out of scope for this assignment).
- Image uploads aren't wired to Firebase Storage; the Admin form takes an image URL/path.
- `/unused` (project root, outside `src/`) holds 4 images from the original project
  (`1.webp`, `MAINPIC.webp`, `hero1.jpg`, `product.jpg`) that weren't referenced anywhere —
  kept per your Phase 1 instruction instead of deleted.
