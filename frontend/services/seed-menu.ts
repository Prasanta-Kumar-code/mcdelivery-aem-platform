import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Offer } from "@/types/offer";
import { Store } from "@/types/store";

/**
 * Bundled seed content.
 *
 * Mirrors the sample Content Fragments shipped in mcd-aem (see
 * mcd-aem/scripts/generate-sample-content.py). It is only rendered when the
 * AEM GraphQL endpoint cannot be reached, so the experience still works like
 * the live site while the AEM SDK is starting up or is not configured.
 *
 * Keep this file in sync with the AEM seed content.
 */

export const seedCategories: Category[] = [
  { title: "Burgers & Wraps", slug: "burgers", displayOrder: 1, isActive: true, locale: "en-IN" },
  { title: "Chicken & McNuggets", slug: "chicken", displayOrder: 2, isActive: true, locale: "en-IN" },
  { title: "Fries & Sides", slug: "sides", displayOrder: 3, isActive: true, locale: "en-IN" },
  { title: "Beverages", slug: "beverages", displayOrder: 4, isActive: true, locale: "en-IN" },
  { title: "Desserts & Shakes", slug: "desserts", displayOrder: 5, isActive: true, locale: "en-IN" },
  { title: "Breakfast", slug: "breakfast", displayOrder: 6, isActive: true, locale: "en-IN" },
];

export const seedProducts: Product[] = [
  { title: "McAloo Tikki", sku: "MCD-BUR-001", price: 149, currency: "INR", category: "burgers", isVeg: true, availability: "AVAILABLE", isActive: true, description: "The Indian classic: a spiced potato patty, tangy tomato sauce and crunchy onions in a soft sesame bun." },
  { title: "McVeggie", sku: "MCD-BUR-002", price: 219, currency: "INR", category: "burgers", isVeg: true, availability: "AVAILABLE", isActive: true, description: "A crisp vegetable patty layered with fresh lettuce, cheese and our signature sauce." },
  { title: "McSpicy Paneer", sku: "MCD-BUR-003", price: 259, currency: "INR", category: "burgers", isVeg: true, availability: "AVAILABLE", isActive: true, description: "Grilled paneer patty with spicy sauce and shredded lettuce, toasted in a buttered bun." },
  { title: "Big Mac", sku: "MCD-BUR-004", price: 329, currency: "INR", category: "burgers", isVeg: false, availability: "AVAILABLE", isActive: true, description: "Two beef patties, special sauce, lettuce, cheese, pickles and onions in a three part sesame bun." },
  { title: "McChicken", sku: "MCD-BUR-005", price: 219, currency: "INR", category: "burgers", isVeg: false, availability: "AVAILABLE", isActive: true, description: "A crispy chicken patty with shredded lettuce and creamy mayonnaise in a toasted bun." },
  { title: "McSpicy Chicken Burger", sku: "MCD-BUR-006", price: 269, currency: "INR", category: "burgers", isVeg: false, availability: "AVAILABLE", isActive: true, description: "A fiery crispy chicken fillet with cool mayo and lettuce for the heat lovers." },
  { title: "Filet-O-Fish", sku: "MCD-BUR-007", price: 279, currency: "INR", category: "burgers", isVeg: false, availability: "AVAILABLE", isActive: true, description: "A flaky fish fillet with tartar sauce and a slice of cheese in a steamed bun." },

  { title: "4 pc Chicken McNuggets", sku: "MCD-CHK-001", price: 229, currency: "INR", category: "chicken", isVeg: false, availability: "AVAILABLE", isActive: true, description: "Four golden crispy nuggets made with 100 percent chicken breast, served with a dip." },
  { title: "9 pc Chicken McNuggets", sku: "MCD-CHK-002", price: 429, currency: "INR", category: "chicken", isVeg: false, availability: "AVAILABLE", isActive: true, description: "Nine crispy nuggets for sharing, or not. Choose your favourite dip." },
  { title: "6 pc Spicy Chicken Wings", sku: "MCD-CHK-003", price: 349, currency: "INR", category: "chicken", isVeg: false, availability: "AVAILABLE", isActive: true, description: "Crispy wings tossed in a smoky spicy glaze. Best finished with a cold drink." },

  { title: "World Famous Fries (M)", sku: "MCD-SID-001", price: 129, currency: "INR", category: "sides", isVeg: true, availability: "AVAILABLE", isActive: true, description: "Golden, crispy, salty fries that go with literally everything." },
  { title: "World Famous Fries (L)", sku: "MCD-SID-002", price: 169, currency: "INR", category: "sides", isVeg: true, availability: "AVAILABLE", isActive: true, description: "The larger size of our iconic fries for the truly hungry." },
  { title: "Peri Peri Fries", sku: "MCD-SID-003", price: 179, currency: "INR", category: "sides", isVeg: true, availability: "AVAILABLE", isActive: true, description: "Classic fries dusted with a zesty peri peri seasoning." },
  { title: "Butter Corn Cup", sku: "MCD-SID-004", price: 109, currency: "INR", category: "sides", isVeg: true, availability: "AVAILABLE", isActive: true, description: "Sweet corn kernels tossed in butter and a hint of seasoning." },

  { title: "Coca-Cola (M)", sku: "MCD-BEV-001", price: 109, currency: "INR", category: "beverages", isVeg: true, availability: "AVAILABLE", isActive: true, description: "Ice cold Coca-Cola to pair with your meal." },
  { title: "Coca-Cola (L)", sku: "MCD-BEV-002", price: 139, currency: "INR", category: "beverages", isVeg: true, availability: "AVAILABLE", isActive: true, description: "The big cup of ice cold Coca-Cola." },
  { title: "McCafe Iced Coffee", sku: "MCD-BEV-003", price: 199, currency: "INR", category: "beverages", isVeg: true, availability: "AVAILABLE", isActive: true, description: "Chilled coffee over ice with milk for a smooth caffeine lift." },
  { title: "McCafe Cappuccino", sku: "MCD-BEV-004", price: 219, currency: "INR", category: "beverages", isVeg: true, availability: "AVAILABLE", isActive: true, description: "Espresso steamed with milk and a light foam cap, freshly brewed." },

  { title: "Oreo McFlurry", sku: "MCD-DES-001", price: 229, currency: "INR", category: "desserts", isVeg: true, availability: "AVAILABLE", isActive: true, description: "Creamy soft serve blended with crunchy Oreo cookie pieces." },
  { title: "Chocolate Sundae", sku: "MCD-DES-002", price: 179, currency: "INR", category: "desserts", isVeg: true, availability: "AVAILABLE", isActive: true, description: "Classic soft serve topped with rich chocolate fudge sauce." },
  { title: "Baked Apple Pie", sku: "MCD-DES-003", price: 119, currency: "INR", category: "desserts", isVeg: true, availability: "AVAILABLE", isActive: true, description: "Warm baked pie with a soft apple filling inside a crispy shell." },
  { title: "Vanilla Soft Serve Cone", sku: "MCD-DES-004", price: 79, currency: "INR", category: "desserts", isVeg: true, availability: "AVAILABLE", isActive: true, description: "Swirled vanilla soft serve in a crisp wafer cone." },

  { title: "Egg and Cheese Muffin", sku: "MCD-BKF-001", price: 179, currency: "INR", category: "breakfast", isVeg: false, availability: "AVAILABLE", isActive: true, description: "A folded egg and melted cheese in a toasted English muffin." },
  { title: "Veggie Breakfast Muffin", sku: "MCD-BKF-002", price: 169, currency: "INR", category: "breakfast", isVeg: true, availability: "AVAILABLE", isActive: true, description: "Grilled veggie patty, cheese and sauce in a warm muffin for a quick morning bite." },
];

export const seedOffers: Offer[] = [
  {
    offerId: "BOGO-WED",
    title: "Buy 1 Get 1 Burgers",
    description: "Buy any classic burger and get one free, every Wednesday.",
    offerType: "BOGO",
    value: 1,
    currency: "INR",
    promoCode: "BOGOWED",
    terms: "Valid on select classic burgers. Cheapest item is free.",
    isActive: true,
  },
  {
    offerId: "FREESHIP",
    title: "Free Delivery over ₹499",
    description: "Delivery fee is waived on all orders above 499.",
    offerType: "FREE_DELIVERY",
    value: 499,
    currency: "INR",
    promoCode: "FREEDEL",
    terms: "Valid within delivery zones on orders above 499 after discounts.",
    isActive: true,
  },
  {
    offerId: "STUDENT79",
    title: "Student Special ₹79 off",
    description: "Flat 79 off any meal when you order between 2 PM and 5 PM.",
    offerType: "FIXED_DISCOUNT",
    value: 79,
    currency: "INR",
    promoCode: "STUDENT79",
    terms: "One redemption per customer per day. Cannot be combined with other offers.",
    isActive: true,
  },
];

export const seedStores: Store[] = [
  {
    storeId: "MCD-001",
    name: "McDelivery MG Road",
    address: "MG Road, Central Market, Bengaluru, Karnataka 560001",
    phone: "+91 80 4000 1000",
    openingHours: "Mon-Sun 07:00-23:00",
    serviceModes: "Delivery, Takeaway, Drive-thru",
    timezone: "Asia/Kolkata",
    isActive: true,
    temporaryClosure: false,
  },
  {
    storeId: "MCD-002",
    name: "McDelivery City Centre",
    address: "42 Harbour Street, Mumbai, Maharashtra 400001",
    phone: "+91 22 4000 2000",
    openingHours: "Mon-Sun 08:00-01:00",
    serviceModes: "Delivery, Dine-in, Takeaway",
    timezone: "Asia/Kolkata",
    isActive: true,
    temporaryClosure: false,
  },
  {
    storeId: "MCD-003",
    name: "McDelivery Station Road",
    address: "Station Road, Lucknow, Uttar Pradesh 226001",
    phone: "+91 522 4000 3000",
    openingHours: "Mon-Sun 08:00-23:30",
    serviceModes: "Delivery, Takeaway",
    timezone: "Asia/Kolkata",
    isActive: true,
    temporaryClosure: false,
  },
];
