"use client";

import { useCartStore } from "@/store/cart-store";

export default function Header() {
  const count = useCartStore(
    (state) => state.count
  );
  const openCart = useCartStore(
    (state) => state.openCart
  );

  return (
    <header className="topbar">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true">M</div>
        <div>
          <div className="brand-name">McDelivery</div>
          <span className="brand-subtitle">Good food, right away</span>
        </div>
      </div>

      <button
        type="button"
        onClick={openCart}
        className="cart-trigger"
        aria-label={`Open cart with ${count} item${count === 1 ? "" : "s"}`}
      >
        <span aria-hidden="true">Bag</span>
        <span className="cart-count">{count}</span>
      </button>
    </header>
  );
}