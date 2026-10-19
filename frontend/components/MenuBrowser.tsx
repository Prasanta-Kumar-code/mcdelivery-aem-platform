"use client";

import { useState } from "react";
import CategoryBar from "@/components/CategoryBar";
import ProductCard from "@/components/ProductCard";
import { Category } from "@/types/category";
import { PageSection, SiteSettings } from "@/types/site-content";
import { Product } from "@/types/product";

export default function MenuBrowser({
  categories,
  products,
  section,
  settings,
  showFilters = true,
  showVegBadges = true,
}: {
  readonly categories: Category[];
  readonly products: Product[];
  readonly section: PageSection;
  readonly settings: SiteSettings;
  readonly showFilters?: boolean;
  readonly showVegBadges?: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const visibleProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="menu-wrap">
      {showFilters && (
        <CategoryBar
          categories={[
            {
              title: settings.allItemsLabel,
              slug: "all",
              displayOrder: 0,
            },
            ...categories,
          ]}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}

      <section id="menu" aria-labelledby="menu-heading">
        <div className="menu-heading-row">
          <div>
            {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
            <h1 id="menu-heading">{section.heading}</h1>
          </div>
          <span className="menu-count">
            {visibleProducts.length}{" "}
            {visibleProducts.length === 1
              ? settings.itemSingularLabel
              : settings.itemPluralLabel}
          </span>
        </div>

        {visibleProducts.length === 0 ? (
          <p className="rounded-lg border border-dashed p-8 text-gray-600">
            {section.emptyMessage ??
              "No products are available in this category."}
          </p>
        ) : (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.sku}
                product={product}
                settings={settings}
                showVegBadge={showVegBadges}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
