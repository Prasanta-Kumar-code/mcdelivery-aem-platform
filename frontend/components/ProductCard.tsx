"use client";
import Image from "next/image";
import { Product } from "@/types/product";
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
}: {
  readonly product: Product;
}) {
  const addToCart = useCartStore(
    (state) => state.addToCart
  );
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
          <span className="product-placeholder" aria-hidden="true"><Art /></span>
        )}
      </div>

      <div className="product-body">
        <h2 className="product-title">{product.title}</h2>

        <p className="product-description">
          {product.description || "A delicious choice for your next meal."}
        </p>

        <div className="product-meta">
          <p className="product-price">₹{product.price}</p>
          <span className={`diet-badge ${product.isVeg ? "veg" : "non-veg"}`}>
            {product.isVeg ? "Veg" : "Non-veg"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          className="add-button"
        >
          Add to order
        </button>
      </div>
    </article>
  );
}