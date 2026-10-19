import {
  FeatureFlag,
  HeroContent,
  NavigationLink,
  PageSection,
  SiteSettings,
} from "@/types/site-content";

/**
 * Bundled fallback for the AEM-authored storefront shell.
 *
 * Mirrors the Content Fragments shipped in mcd-aem (see
 * mcd-aem/scripts/generate-sample-content.py). It is only used when the AEM
 * GraphQL endpoint cannot serve a stream, so authors stay the source of truth.
 */

export const defaultSiteSettings: SiteSettings = {
  brandName: "McDelivery",
  brandTagline: "Hot & fresh, right away",
  allItemsLabel: "All items",
  accountLabel: "Sign in",
  orderCtaLabel: "Order now",
  orderCtaHref: "#menu",
  currencySymbol: "₹",
  metaTitle: "McDelivery | Good food. Good mood.",
  metaDescription:
    "Browse the full McDelivery menu, unlock today's deals and find the restaurant nearest to you.",
  defaultProductDescription: "A delicious choice for your next meal.",
  vegLabel: "Veg",
  nonVegLabel: "Non-veg",
  addToCartLabel: "Add to order",
  cartEyebrow: "Ready when you are",
  cartTitle: "Your order",
  cartEmptyMessage: "Your cart is empty.",
  cartSubtotalLabel: "Subtotal",
  checkoutLabel: "Continue to checkout",
  closeLabel: "Close",
  storeBadgeLabel: "Accepts delivery orders",
  footerCompanyTitle: "Link",
  footerPolicyTitle: "Policy",
  footerToolsTitle: "Tools",
  footerSocialTitle: "Follow us",
  copyright:
    "© 2026 McDelivery. A learning project — not affiliated with McDonald's.",
  footerNote:
    "Learning project — built with AEM, Next.js, Spring Boot and PostgreSQL.",
  bannerMessage:
    "Showing bundled seed content because {count} content source(s) could not be reached",
  bannerHint:
    "Start the AEM SDK and install the mcd content package to load the authored experience instead.",
  copyCodeLabel: "Copy code",
  copiedLabel: "Copied",
  saveLabel: "Save",
  itemSingularLabel: "item",
  itemPluralLabel: "items",
  perItemLabel: "each",
  removeLabel: "Remove",
  locale: "en-IN",
};

export const defaultHero: HeroContent = {
  heroId: "main",
  eyebrow: "Made for your moment",
  headline: "Good food. Good mood.",
  description:
    "Freshly grilled, made to order. Browse the menu, build your favourite meal and get it delivered hot.",
  primaryCtaLabel: "Order now",
  primaryCtaHref: "#menu",
  secondaryCtaLabel: "See the deals",
  secondaryCtaHref: "#deals",
  badgeText: "Free delivery over ₹499",
  variant: "campaign",
};

export const defaultSections: PageSection[] = [
  { sectionKey: "hero", heading: "Hero", displayOrder: 1, isActive: true },
  {
    sectionKey: "menu",
    eyebrow: "Made for your moment",
    heading: "Explore the menu",
    displayOrder: 2,
    isActive: true,
  },
  {
    sectionKey: "deals",
    eyebrow: "Today's specials",
    heading: "Deals that hit the spot",
    emptyMessage: "No active offers right now. Check back soon.",
    displayOrder: 3,
    isActive: true,
  },
  {
    sectionKey: "locations",
    eyebrow: "Near by you",
    heading: "Find your nearest McDelivery",
    emptyMessage: "No active stores right now.",
    displayOrder: 4,
    isActive: true,
  },
];

export const defaultNavigationLinks: NavigationLink[] = [
  { label: "Menu", href: "#menu", linkGroup: "header", displayOrder: 1, isActive: true },
  { label: "Deals", href: "#deals", linkGroup: "header", displayOrder: 2, isActive: true },
  { label: "Locations", href: "#locations", linkGroup: "header", displayOrder: 3, isActive: true },
  { label: "Order Now", href: "#menu", linkGroup: "header", displayOrder: 4, isActive: true, isCta: true },

  { label: "Contact Us", href: "#", linkGroup: "footer-company", displayOrder: 1, isActive: true },
  { label: "Careers", href: "#", linkGroup: "footer-company", displayOrder: 2, isActive: true },
  { label: "Our History", href: "#", linkGroup: "footer-company", displayOrder: 3, isActive: true },
  { label: "Newsroom", href: "#", linkGroup: "footer-company", displayOrder: 4, isActive: true },
  { label: "Our Suppliers", href: "#", linkGroup: "footer-company", displayOrder: 5, isActive: true },
  { label: "Sustainability", href: "#", linkGroup: "footer-company", displayOrder: 6, isActive: true },

  { label: "Terms & Conditions", href: "#", linkGroup: "footer-policy", displayOrder: 1, isActive: true },
  { label: "Privacy Policy", href: "#", linkGroup: "footer-policy", displayOrder: 2, isActive: true },
  { label: "Accessibility", href: "#", linkGroup: "footer-policy", displayOrder: 3, isActive: true },
  { label: "Your Privacy Choices", href: "#", linkGroup: "footer-policy", displayOrder: 4, isActive: true },
  { label: "CA Privacy Rights", href: "#", linkGroup: "footer-policy", displayOrder: 5, isActive: true },
  { label: "Interest-Based Ads", href: "#", linkGroup: "footer-policy", displayOrder: 6, isActive: true },

  { label: "Download on the App Store", href: "#", linkGroup: "footer-tools", displayOrder: 1, isActive: true },
  { label: "Get it on Google Play", href: "#", linkGroup: "footer-tools", displayOrder: 2, isActive: true },

  { label: "Facebook", href: "#", linkGroup: "footer-social", iconKey: "facebook", displayOrder: 1, isActive: true },
  { label: "Twitter", href: "#", linkGroup: "footer-social", iconKey: "twitter", displayOrder: 2, isActive: true },
  { label: "Instagram", href: "#", linkGroup: "footer-social", iconKey: "instagram", displayOrder: 3, isActive: true },
];

export const defaultFeatureFlags: FeatureFlag[] = [
  { flagKey: "hero", label: "Hero banner", enabled: true, displayOrder: 1 },
  { flagKey: "deals", label: "Deals strip", enabled: true, displayOrder: 2 },
  { flagKey: "menu", label: "Menu browser", enabled: true, displayOrder: 3 },
  { flagKey: "menuFilters", label: "Category filters", enabled: true, displayOrder: 4 },
  { flagKey: "storeLocator", label: "Store locator", enabled: true, displayOrder: 5 },
  { flagKey: "cart", label: "Cart drawer", enabled: true, displayOrder: 6 },
  { flagKey: "account", label: "Account entry point", enabled: true, displayOrder: 7 },
  { flagKey: "vegBadges", label: "Diet badges", enabled: true, displayOrder: 8 },
  { flagKey: "footerSocial", label: "Footer social links", enabled: true, displayOrder: 9 },
];
