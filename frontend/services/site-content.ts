import { cache } from "react";
import {
  AemQueryResult,
  asImagePath,
  asNumber,
  asOptionalBoolean,
  asOptionalString,
  asPlainText,
  firstActiveItem,
  queryFirstMatch,
} from "@/services/aem-client";
import {
  defaultFeatureFlags,
  defaultHero,
  defaultNavigationLinks,
  defaultSections,
  defaultSiteSettings,
} from "@/services/seed-site-content";
import {
  FeatureFlags,
  HeroContent,
  LinkGroup,
  NavigationLink,
  PageSection,
  SiteContent,
  SiteSettings,
} from "@/types/site-content";

/**
 * Site shell content authored in AEM.
 *
 * Each stream has ordered query variants because the generated GraphQL schema
 * follows the deployed Content Fragment Models. A stream that AEM cannot serve
 * falls back to the bundled defaults in seed-site-content.ts, keeping the
 * storefront usable while preserving AEM as the source of truth.
 */

const SITE_SETTINGS_QUERIES = [
  `query {
    siteSettingsList {
      items {
        brandName brandTagline allItemsLabel accountLabel orderCtaLabel orderCtaHref
        currencySymbol metaTitle metaDescription { plaintext } defaultProductDescription
        vegLabel nonVegLabel addToCartLabel cartEyebrow cartTitle cartEmptyMessage
        cartSubtotalLabel checkoutLabel closeLabel storeBadgeLabel footerCompanyTitle
        footerPolicyTitle footerToolsTitle footerSocialTitle copyright
        footerNote { plaintext } bannerMessage bannerHint { plaintext }
        copyCodeLabel copiedLabel saveLabel itemSingularLabel itemPluralLabel
        perItemLabel removeLabel locale isActive
      }
    }
  }`,
  `query {
    siteSettingsList {
      items {
        brandName brandTagline allItemsLabel accountLabel orderCtaLabel orderCtaHref
        currencySymbol metaTitle defaultProductDescription vegLabel nonVegLabel
        addToCartLabel cartEyebrow cartTitle cartEmptyMessage cartSubtotalLabel
        checkoutLabel closeLabel storeBadgeLabel footerCompanyTitle footerPolicyTitle
        footerToolsTitle footerSocialTitle copyright locale isActive bannerMessage
        copyCodeLabel copiedLabel saveLabel itemSingularLabel itemPluralLabel
        perItemLabel removeLabel
      }
    }
  }`,
];

const HERO_QUERIES = [
  `query {
    heroList {
      items {
        heroId eyebrow headline subheadline description { plaintext }
        primaryCtaLabel primaryCtaHref secondaryCtaLabel secondaryCtaHref
        badgeText image { ... on ImageRef { _path } } variant displayOrder isActive
      }
    }
  }`,
  `query {
    heroList {
      items {
        heroId eyebrow headline subheadline primaryCtaLabel primaryCtaHref
        secondaryCtaLabel secondaryCtaHref badgeText variant displayOrder isActive
      }
    }
  }`,
];

const SECTION_QUERIES = [
  `query {
    pageSectionList {
      items { sectionKey eyebrow heading emptyMessage displayOrder isActive }
    }
  }`,
  `query {
    sectionList {
      items { sectionKey eyebrow heading emptyMessage displayOrder isActive }
    }
  }`,
];

const NAVIGATION_QUERIES = [
  `query {
    navigationLinkList {
      items { label href linkGroup iconKey displayOrder externalLink isActive isCta }
    }
  }`,
];

const FLAG_QUERIES = [
  `query {
    featureFlagList {
      items { flagKey label description { plaintext } enabled displayOrder }
    }
  }`,
  `query {
    featureFlagList {
      items { flagKey label enabled displayOrder }
    }
  }`,
];

const LINK_GROUPS: readonly LinkGroup[] = [
  "header",
  "footer-company",
  "footer-policy",
  "footer-tools",
  "footer-social",
  "footer-bottom",
];

function listItems(data: AemQueryResult): unknown[] {
  for (const value of Object.values(data)) {
    if (value?.items) {
      return value.items;
    }
  }
  return [];
}

function toSiteSettings(item: Record<string, unknown>): SiteSettings {
  return {
    brandName: asOptionalString(item.brandName) ?? defaultSiteSettings.brandName,
    brandTagline:
      asOptionalString(item.brandTagline) ?? defaultSiteSettings.brandTagline,
    allItemsLabel:
      asOptionalString(item.allItemsLabel) ?? defaultSiteSettings.allItemsLabel,
    accountLabel:
      asOptionalString(item.accountLabel) ?? defaultSiteSettings.accountLabel,
    orderCtaLabel:
      asOptionalString(item.orderCtaLabel) ?? defaultSiteSettings.orderCtaLabel,
    orderCtaHref:
      asOptionalString(item.orderCtaHref) ?? defaultSiteSettings.orderCtaHref,
    currencySymbol:
      asOptionalString(item.currencySymbol) ?? defaultSiteSettings.currencySymbol,
    metaTitle: asOptionalString(item.metaTitle) ?? defaultSiteSettings.metaTitle,
    metaDescription:
      asPlainText(item.metaDescription) ?? defaultSiteSettings.metaDescription,
    defaultProductDescription:
      asOptionalString(item.defaultProductDescription) ??
      defaultSiteSettings.defaultProductDescription,
    vegLabel: asOptionalString(item.vegLabel) ?? defaultSiteSettings.vegLabel,
    nonVegLabel:
      asOptionalString(item.nonVegLabel) ?? defaultSiteSettings.nonVegLabel,
    addToCartLabel:
      asOptionalString(item.addToCartLabel) ?? defaultSiteSettings.addToCartLabel,
    cartEyebrow:
      asOptionalString(item.cartEyebrow) ?? defaultSiteSettings.cartEyebrow,
    cartTitle: asOptionalString(item.cartTitle) ?? defaultSiteSettings.cartTitle,
    cartEmptyMessage:
      asOptionalString(item.cartEmptyMessage) ??
      defaultSiteSettings.cartEmptyMessage,
    cartSubtotalLabel:
      asOptionalString(item.cartSubtotalLabel) ??
      defaultSiteSettings.cartSubtotalLabel,
    checkoutLabel:
      asOptionalString(item.checkoutLabel) ?? defaultSiteSettings.checkoutLabel,
    closeLabel: asOptionalString(item.closeLabel) ?? defaultSiteSettings.closeLabel,
    storeBadgeLabel:
      asOptionalString(item.storeBadgeLabel) ??
      defaultSiteSettings.storeBadgeLabel,
    footerCompanyTitle:
      asOptionalString(item.footerCompanyTitle) ??
      defaultSiteSettings.footerCompanyTitle,
    footerPolicyTitle:
      asOptionalString(item.footerPolicyTitle) ??
      defaultSiteSettings.footerPolicyTitle,
    footerToolsTitle:
      asOptionalString(item.footerToolsTitle) ??
      defaultSiteSettings.footerToolsTitle,
    footerSocialTitle:
      asOptionalString(item.footerSocialTitle) ??
      defaultSiteSettings.footerSocialTitle,
    copyright:
      asOptionalString(item.copyright) ?? defaultSiteSettings.copyright,
    footerNote:
      asPlainText(item.footerNote) ?? defaultSiteSettings.footerNote,
    bannerMessage:
      asOptionalString(item.bannerMessage) ?? defaultSiteSettings.bannerMessage,
    bannerHint:
      asPlainText(item.bannerHint) ?? defaultSiteSettings.bannerHint,
    copyCodeLabel:
      asOptionalString(item.copyCodeLabel) ?? defaultSiteSettings.copyCodeLabel,
    copiedLabel:
      asOptionalString(item.copiedLabel) ?? defaultSiteSettings.copiedLabel,
    saveLabel: asOptionalString(item.saveLabel) ?? defaultSiteSettings.saveLabel,
    itemSingularLabel:
      asOptionalString(item.itemSingularLabel) ??
      defaultSiteSettings.itemSingularLabel,
    itemPluralLabel:
      asOptionalString(item.itemPluralLabel) ??
      defaultSiteSettings.itemPluralLabel,
    perItemLabel:
      asOptionalString(item.perItemLabel) ?? defaultSiteSettings.perItemLabel,
    removeLabel:
      asOptionalString(item.removeLabel) ?? defaultSiteSettings.removeLabel,
    locale: asOptionalString(item.locale) ?? defaultSiteSettings.locale,
  };
}

function toHero(item: Record<string, unknown>): HeroContent {
  return {
    heroId: asOptionalString(item.heroId) ?? defaultHero.heroId,
    eyebrow: asOptionalString(item.eyebrow),
    headline: asOptionalString(item.headline) ?? defaultHero.headline,
    subheadline: asOptionalString(item.subheadline),
    description: asPlainText(item.description),
    primaryCtaLabel: asOptionalString(item.primaryCtaLabel),
    primaryCtaHref: asOptionalString(item.primaryCtaHref),
    secondaryCtaLabel: asOptionalString(item.secondaryCtaLabel),
    secondaryCtaHref: asOptionalString(item.secondaryCtaHref),
    badgeText: asOptionalString(item.badgeText),
    variant: item.variant === "deal" ? "deal" : "campaign",
    image: asImagePath(item.image),
  };
}

function toSections(items: unknown[]): PageSection[] {
  return items
    .map((raw): PageSection | null => {
      const item = raw as Record<string, unknown>;
      const sectionKey = asOptionalString(item.sectionKey);
      const heading = asOptionalString(item.heading);

      if (!sectionKey || !heading) {
        return null;
      }

      return {
        sectionKey,
        heading,
        eyebrow: asOptionalString(item.eyebrow),
        emptyMessage: asOptionalString(item.emptyMessage),
        displayOrder: asNumber(item.displayOrder),
        isActive: asOptionalBoolean(item.isActive),
      };
    })
    .filter((section): section is PageSection => section !== null)
    .filter((section) => section.isActive !== false)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

function toLinks(items: unknown[]): NavigationLink[] {
  return items
    .map((raw): NavigationLink | null => {
      const item = raw as Record<string, unknown>;
      const label = asOptionalString(item.label);
      const href = asOptionalString(item.href);
      const group = asOptionalString(item.linkGroup) as LinkGroup | undefined;

      if (!label || !href || !group || !LINK_GROUPS.includes(group)) {
        return null;
      }

      return {
        label,
        href,
        linkGroup: group,
        iconKey: asOptionalString(item.iconKey),
        displayOrder: asNumber(item.displayOrder),
        externalLink: asOptionalBoolean(item.externalLink),
        isActive: asOptionalBoolean(item.isActive),
        isCta: asOptionalBoolean(item.isCta),
      };
    })
    .filter((link): link is NavigationLink => link !== null)
    .filter((link) => link.isActive !== false)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

function toFlags(items: unknown[]): FeatureFlags {
  const flags: FeatureFlags = {};

  for (const raw of items) {
    const item = raw as Record<string, unknown>;
    const flagKey = asOptionalString(item.flagKey);
    if (!flagKey) {
      continue;
    }

    // An authored flag is enabled unless it explicitly says false.
    flags[flagKey] = item.enabled === undefined || item.enabled === null
      ? true
      : Boolean(item.enabled);
  }

  return flags;
}

/**
 * The bundled defaults are the safety net, so the map always contains every
 * feature the components know about. AEM entries win when present.
 */
function defaultFlagMap(): FeatureFlags {
  return Object.fromEntries(
    defaultFeatureFlags.map((flag) => [flag.flagKey, flag.enabled])
  );
}

async function loadStream<T>(
  name: string,
  loader: () => Promise<T>,
  fallback: T,
  degraded: string[]
): Promise<T> {
  try {
    return await loader();
  } catch {
    degraded.push(name);
    return fallback;
  }
}

async function getSiteSettings(): Promise<SiteSettings> {
  const data = await queryFirstMatch(SITE_SETTINGS_QUERIES);
  const item = firstActiveItem(data, "siteSettingsList");

  if (!item) {
    throw new Error("siteSettingsList returned no active configuration");
  }

  return toSiteSettings(item);
}

async function getHero(): Promise<HeroContent> {
  const data = await queryFirstMatch(HERO_QUERIES);
  const item = firstActiveItem(data, "heroList");

  if (!item) {
    throw new Error("heroList returned no active hero");
  }

  return toHero(item);
}

async function getSections(): Promise<PageSection[]> {
  const data = await queryFirstMatch(SECTION_QUERIES);
  const sections = toSections(listItems(data));

  if (sections.length === 0) {
    throw new Error("page sections returned no active items");
  }

  return sections;
}

async function getNavigationLinks(): Promise<NavigationLink[]> {
  const data = await queryFirstMatch(NAVIGATION_QUERIES);
  const links = toLinks(listItems(data));

  if (links.length === 0) {
    throw new Error("navigation links returned no active items");
  }

  return links;
}

async function getFeatureFlags(): Promise<FeatureFlags> {
  const data = await queryFirstMatch(FLAG_QUERIES);
  const flags = toFlags(listItems(data));

  if (Object.keys(flags).length === 0) {
    throw new Error("feature flags returned no items");
  }

  return { ...defaultFlagMap(), ...flags };
}

/** Deduplicated per request so metadata and the page share one AEM read. */
export const fetchSiteContent = cache(async (): Promise<SiteContent> => {
  const degraded: string[] = [];

  const [settings, hero, sections, links, flags] = await Promise.all([
    loadStream("site settings", getSiteSettings, defaultSiteSettings, degraded),
    loadStream("hero", getHero, defaultHero, degraded),
    loadStream("sections", getSections, defaultSections, degraded),
    loadStream("navigation", getNavigationLinks, defaultNavigationLinks, degraded),
    loadStream("features", getFeatureFlags, defaultFlagMap(), degraded),
  ]);

  const source: SiteContent["source"] =
    degraded.length === 0 ? "aem" : degraded.length === 5 ? "seed" : "mixed";

  return { settings, hero, sections, links, flags, source, degraded };
});

/** Feature flags are opt-out: absent AEM entries keep the feature enabled. */
export function isFeatureEnabled(
  flags: FeatureFlags,
  flagKey: string
): boolean {
  return flags[flagKey] !== false;
}

/** Links for one authored navigation group, already sorted by display order. */
export function linksForGroup(
  links: NavigationLink[],
  group: LinkGroup
): NavigationLink[] {
  return links.filter((link) => link.linkGroup === group);
}
