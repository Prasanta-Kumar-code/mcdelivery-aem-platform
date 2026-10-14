"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { formatMoney } from "@/lib/format";

const CART_MAX_QUANTITY = 20;

export default function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeCart, isOpen]);

  if (!isOpen) {
    return null;
  }

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const close = () => {
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close cart"
        onClick={close}
        className="absolute inset-0 h-full w-full bg-black/40"
      />

      <aside
        aria-label="Shopping cart"
        aria-live="polite"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#fffdf8] p-6 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[#e8dfd4] pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#bd1f2d]">
              Ready when you are
            </p>
            <h2 className="mt-1 text-2xl font-bold">Your order</h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-full px-3 py-2 text-sm font-semibold hover:bg-[#f5e8c9]"
          >
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <p className="py-8 text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-[#e8dfd4] overflow-y-auto">
              {items.map((item) => (
                <li
                  key={item.product.sku}
                  className="flex items-start justify-between gap-4 py-4"
                >
                  <div>
                    <h3 className="font-semibold">{item.product.title}</h3>
                    <p className="text-sm text-[#746a61]">
                      {formatMoney(item.product.price)} each
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.sku, item.quantity - 1)
                        }
                        className="h-8 w-8 rounded-full border border-[#e8dfd4] font-bold hover:bg-[#f5e8c9]"
                        aria-label={`Decrease ${item.product.title} quantity`}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="min-w-6 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.sku, item.quantity + 1)
                        }
                        className="h-8 w-8 rounded-full border border-[#e8dfd4] font-bold hover:bg-[#f5e8c9]"
                        aria-label={`Increase ${item.product.title} quantity`}
                        disabled={item.quantity >= CART_MAX_QUANTITY}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.sku)}
                        className="ml-2 text-sm text-[#bd1f2d] underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <span className="font-semibold">
                    {formatMoney(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-[#e8dfd4] pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <button
                type="button"
                className="mt-4 w-full rounded-lg bg-[#ffc72c] px-4 py-3 font-bold text-[#8f1420] hover:bg-[#f5b900]"
              >
                Continue to checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
