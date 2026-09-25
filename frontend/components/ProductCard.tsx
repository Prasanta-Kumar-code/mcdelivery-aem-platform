"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cart-store";

export default function ProductCard({
  product,
}: {
  readonly product: Product;
}) {
  const addToCart = useCartStore(
    (state) => state.addToCart
  );

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
          <span className="product-placeholder" aria-hidden="true">M</span>
        )}
      </div>

      <div className="product-body">
        <h2 className="product-title">{product.title}</h2>

        <p className="product-description">
          {product.description?.plaintext || "A delicious choice for your next meal."}
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