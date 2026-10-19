import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DealsStrip from "@/components/DealsStrip";
import MenuBrowser from "@/components/MenuBrowser";
import StoreLocator from "@/components/StoreLocator";
import Footer from "@/components/Footer";
import SourceBanner from "@/components/SourceBanner";
import CartDrawer from "@/components/CartDrawer";
import { fetchMenuData } from "@/services/aem-api";
import {
  fetchSiteContent,
  isFeatureEnabled,
  linksForGroup,
} from "@/services/site-content";
import { PageSection } from "@/types/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const site = await fetchSiteContent();

  return {
    title: site.settings.metaTitle,
    description: site.settings.metaDescription,
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const requestedCategory =
    typeof params.category === "string" ? params.category : undefined;

  const [menu, site] = await Promise.all([fetchMenuData(), fetchSiteContent()]);

  const validCategories = new Set(menu.categories.map((category) => category.slug));
  const selectedCategory =
    requestedCategory && validCategories.has(requestedCategory)
      ? requestedCategory
      : "all";

  const feature = (flagKey: string) => isFeatureEnabled(site.flags, flagKey);

  const renderSection = (section: PageSection, index: number) => {
    const key = `${section.sectionKey}-${index}`;

    switch (section.sectionKey) {
      case "hero":
        return feature("hero") ? (
          <Hero key={key} hero={site.hero} settings={site.settings} />
        ) : null;
      case "deals":
        return feature("deals") ? (
          <DealsStrip
            key={key}
            offers={menu.offers}
            section={section}
            settings={site.settings}
          />
        ) : null;
      case "menu":
        return feature("menu") ? (
          <MenuBrowser
            key={key}
            categories={menu.categories}
            products={menu.products}
            selectedCategory={selectedCategory}
            section={section}
            settings={site.settings}
            showFilters={feature("menuFilters")}
            showVegBadges={feature("vegBadges")}
          />
        ) : null;
      case "locations":
        return feature("storeLocator") ? (
          <StoreLocator
            key={key}
            stores={menu.stores}
            section={section}
            settings={site.settings}
          />
        ) : null;
      default:
        // Unknown keys stay in AEM for future components without breaking the page.
        return null;
    }
  };

  return (
    <main className="site-shell">
      <Header
        settings={site.settings}
        navLinks={linksForGroup(site.links, "header")}
        showCart={feature("cart")}
        showAccount={feature("account")}
      />

      {site.sections.map(renderSection)}

      <Footer
        settings={site.settings}
        links={site.links}
        showSocial={feature("footerSocial")}
      />

      {(menu.source !== "aem" || site.source !== "aem") && (
        <SourceBanner
          degraded={[...menu.degraded, ...site.degraded]}
          message={site.settings.bannerMessage}
          hint={site.settings.bannerHint}
          dismissLabel={site.settings.closeLabel}
        />
      )}

      {feature("cart") && <CartDrawer settings={site.settings} />}
    </main>
  );
}
