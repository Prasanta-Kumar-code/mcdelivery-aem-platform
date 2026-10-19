"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import { SiteSettings } from "@/types/site-content";
import {
  artForCategory,
  Burger,
  Chicken,
  Fries,
  Beverage,
  Dessert,
  Breakfast,
} from "./FoodArt";
import { useCartStore } from "@/store/cart-store";
import { formatMoney } from "@/lib/format";

const ART_COMPONENTS = {
  burger: Burger,
  chicken: Chicken,
  fries: Fries,
  beverage: Beverage,
  dessert: Dessert,
  breakfast: Breakfast,
} as const;

export default function ProductCard({
  product,
  settings,
  showVegBadge = true,
}: {
  readonly product: Product;
  readonly settings: SiteSettings;
  readonly showVegBadge?: boolean;
}) {
  const addToCart = useCartStore((state) => state.addToCart);
  const Art = ART_COMPONENTS[artForCategory(product.category)];

  return (
    <article className="product-card">
      <div className="product-media">
        {product.image?._path ? (
          <Image
            src={`/api/aem-asset?path=${encodeURIComponent(product.image._path)}`}
            alt={product.title}
            fill
            sizes="(max-width: 560px) 100vw, (max-width: 800px) 50vw, 33vw"
          />
        ) : (
          <span className="product-placeholder" aria-hidden="true">
            <Art />
          </span>
        )}
      </div>

      <div className="product-body">
        <h2 className="product-title">{product.title}</h2>

        <p className="product-description">
          {product.description ?? settings.defaultProductDescription}
        </p>

        <div className="product-meta">
          <p className="product-price">
            {formatMoney(product.price, settings.locale, settings.currencySymbol)}
          </p>
          {showVegBadge && (
            <span className={`diet-badge ${product.isVeg ? "veg" : "non-veg"}`}>
              {product.isVeg ? settings.vegLabel : settings.nonVegLabel}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          className="add-button"
        >
          {settings.addToCartLabel}
        </button>
      </div>
    </article>
  );
}
