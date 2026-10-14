"use client";

import CategoryBar from "@/components/CategoryBar";
import ProductCard from "@/components/ProductCard";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

export default function MenuBrowser({
  categories,
  products,
  selectedCategory,
}: {
  readonly categories: Category[];
  readonly products: Product[];
  readonly selectedCategory: string;
}) {
  const visibleProducts = selectedCategory === "all"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  return (
    <>
      <div className="menu-wrap">
        <CategoryBar
          categories={[
            { title: "All items", slug: "all", displayOrder: 0 },
            ...categories,
          ]}
          selectedCategory={selectedCategory}
        />

        <section aria-labelledby="menu-heading">
          <div className="menu-heading-row">
            <div>
              <p className="eyebrow">Made for your moment</p>
              <h1 id="menu-heading">Explore the menu</h1>
            </div>
            <span className="menu-count">
              {visibleProducts.length} {visibleProducts.length === 1 ? "item" : "items"}
            </span>
          </div>

          {visibleProducts.length === 0 ? (
            <p className="rounded-lg border border-dashed p-8 text-gray-600">
              No products are available in this category.
            </p>
          ) : (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}