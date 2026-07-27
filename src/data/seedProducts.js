// Ported as-is from the original vanilla-JS project's data/products.js.
// Used to seed Firestore once (see scripts/seedProducts.js) and as an
// offline fallback if Firestore is unreachable.
export const seedProducts = [
  {
    id: "tea-trica-bha-foam",
    name: "Tea-Trica BHA Foam",
    price: 9.69,
    image: "/images/skin1004-tea-trica-bha-foam-.webp",
    description:
      "A deep-cleansing foam with BHA and Tea Tree that unclogs pores and removes dead skin cells for a visibly clearer, refreshed complexion.",
    category: "Cleanser",
    badge: null,
  },
  {
    id: "poremizing-deep-cleansing-foam",
    name: "Poremizing Deep Cleansing Foam",
    price: 9.69,
    image: "/images/skin1004-poremizing-deep-cleansing-foam.webp",
    description:
      "A rich, creamy cleanser with Mineral Salts, Kaolin, and Papain that draws out impurities and excess sebum like a magnet.",
    category: "Cleanser",
    badge: "Bestseller",
  },
  {
    id: "hyalu-cica-brightening-toner",
    name: "Hyalu-Cica Brightening Toner",
    price: 11.99,
    image: "/images/skin1004-toner-madagascar-centella-hyalu-cica-brightening-toner.webp",
    description:
      "A deeply hydrating toner with AHA and LHA that gently exfoliates while soothing and brightening for a more even skin tone.",
    category: "Toner",
    badge: null,
  },
  {
    id: "hyalu-cica-first-ampoule",
    name: "Hyalu-Cica First Ampoule",
    price: 11.99,
    image: "/images/skin1004-ampoule-serum.webp",
    description:
      "A lightweight ampoule with 5 Hyaluronic Acids, Birch Sap, and Ivy that instantly floods skin with moisture and primes it for the next step.",
    category: "Serum",
    badge: "New",
  },
  {
    id: "hyalu-cica-moisture-cream",
    name: "Hyalu-Cica Moisture Cream",
    price: 10.99,
    image: "/images/skin1004-cream-hyalu-cica-moisture-cream.webp",
    description:
      "A featherweight cream with 5 Hyaluronic Acids and Hydrolyzed Collagen that locks in deep hydration for up to 100 hours.",
    category: "Moisturizer",
    badge: null,
  },
  {
    id: "hyalu-cica-water-fit-sun-serum-uv",
    name: "Hyalu-Cica Water-Fit Sun Serum UV",
    price: 14.99,
    image: "/images/skin1004-50ml-hyalu-cica-water-fit-sun-serum-uv.webp",
    description:
      "A serum-weight sunscreen that hydrates and soothes with zero white cast. Reformulated with Panthenol and Rice, Oat, and Soybean extracts for all-day comfort.",
    category: "Sunscreen",
    badge: null,
  },
  {
    id: "poremizing-quick-clay-stick-mask",
    name: "Poremizing Quick Clay Stick Mask",
    price: 14.99,
    image: "/images/skin1004-poremizing-quick-clay-stick-mask.webp",
    description:
      "A smooth stick mask with 5 clays (18% Kaolin) and Red Bean Powder to absorb excess sebum and visibly tighten enlarged pores.",
    category: "Clay Mask",
    badge: null,
  },
];
