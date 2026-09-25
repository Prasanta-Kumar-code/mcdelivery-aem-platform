import Header from "@/components/Header";
import MenuBrowser from "@/components/MenuBrowser";
import CartDrawer from "@/components/CartDrawer";

import {
  getProducts,
  getCategories,
} from "@/services/aem-api";

export default async function Home() {
  const productResult =
    await getProducts();

  const categoryResult =
    await getCategories();

  const products =
    productResult.data.productList.items;

  const categories =
    categoryResult.data.categoryList.items;

  return (
    <main className="site-shell">
      <Header />

      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <span className="eyebrow">Your favourites, freshly made</span>
          <h1 id="hero-heading">Good food.<br />Good mood.</h1>
          <p>
            Build a meal that hits the spot. Browse the menu, choose your favourites,
            and get ordering.
          </p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="hero-note">Made for sharing</span>
        </div>
      </section>

      <MenuBrowser
        categories={categories}
        products={products}
      />

      <CartDrawer />
    </main>
  );
}