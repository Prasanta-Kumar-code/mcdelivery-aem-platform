/**
 * Page-level content authored in AEM.
 *
 * Menu data (products, categories, offers, stores) lives in its own fragments;
 * everything in this file is the storefront shell: brand copy, hero campaign,
 * section headings, navigation, feature toggles and UI labels.
 */

export interface SiteSettings {
  brandName: string;
  brandTagline?: string;
  allItemsLabel: string;
  accountLabel: string;
  orderCtaLabel: string;
  orderCtaHref: string;
  currencySymbol: string;
  metaTitle?: string;
  metaDescription?: string;
  defaultProductDescription?: string;
  vegLabel: string;
  nonVegLabel: string;
  addToCartLabel: string;
  cartEyebrow?: string;
  cartTitle?: string;
  cartEmptyMessage?: string;
  cartSubtotalLabel?: string;
  checkoutLabel?: string;
  closeLabel?: string;
  storeBadgeLabel?: string;
  footerCompanyTitle?: string;
  footerPolicyTitle?: string;
  footerToolsTitle?: string;
  footerSocialTitle?: string;
  copyright?: string;
  footerNote?: string;
  bannerMessage?: string;
  bannerHint?: string;
  copyCodeLabel: string;
  copiedLabel: string;
  saveLabel: string;
  itemSingularLabel: string;
  itemPluralLabel: string;
  perItemLabel: string;
  removeLabel: string;
  locale?: string;
}

export interface HeroContent {
  heroId: string;
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  badgeText?: string;
  variant?: "campaign" | "deal";
  image?: { _path: string };
}

export interface PageSection {
  sectionKey: string;
  eyebrow?: string;
  heading: string;
  emptyMessage?: string;
  displayOrder: number;
  isActive?: boolean;
}

export type LinkGroup =
  | "header"
  | "footer-company"
  | "footer-policy"
  | "footer-tools"
  | "footer-social"
  | "footer-bottom";

export interface NavigationLink {
  label: string;
  href: string;
  linkGroup: LinkGroup;
  iconKey?: string;
  displayOrder: number;
  externalLink?: boolean;
  isActive?: boolean;
  isCta?: boolean;
}

export interface FeatureFlag {
  flagKey: string;
  label?: string;
  description?: string;
  enabled: boolean;
  displayOrder?: number;
}

/** Feature switches resolved to a lookup map: `features.cart === false` hides the cart. */
export type FeatureFlags = Record<string, boolean>;

export interface SiteContent {
  settings: SiteSettings;
  hero: HeroContent;
  /** Ordered, active page sections. The frontend renders the keys it knows. */
  sections: PageSection[];
  links: NavigationLink[];
  flags: FeatureFlags;
  source: "aem" | "seed" | "mixed";
  /** Names of the site-content streams that fell back to bundled defaults. */
  degraded: string[];
}
