import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DealsStrip from "@/components/DealsStrip";
import MenuBrowser from "@/components/MenuBrowser";
import StoreLocator from "@/components/StoreLocator";
import Footer from "@/components/Footer";
import SourceBanner from "@/components/SourceBanner";
import CartDrawer from "@/components/CartDrawer";
import { fetchMenuData } from "@/services/aem-api";

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

  const menu = await fetchMenuData();

  const validCategories = new Set(menu.categories.map((category) => category.slug));
  const selectedCategory =
    requestedCategory && validCategories.has(requestedCategory)
      ? requestedCategory
      : "all";

  return (
    <main className="site-shell">
      <Header storeName={menu.stores[0]?.name} />

      <Hero />

      <DealsStrip offers={menu.offers} />

      <MenuBrowser
        categories={menu.categories}
        products={menu.products}
        selectedCategory={selectedCategory}
      />

      <StoreLocator stores={menu.stores} />

      <Footer />

      {menu.source !== "aem" && (
        <SourceBanner
          degraded={menu.degraded}
          products={menu.products}
        />
      )}

      <CartDrawer />
    </main>
  );
}
