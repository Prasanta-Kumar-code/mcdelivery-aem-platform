import { create } from "zustand";
import { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  count: number;
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartStore>(
  (set) => ({
    count: 0,
    items: [],
    isOpen: false,

    addToCart: (product) =>
      set((state) => {
        const hasExistingItem = state.items.some(
          (item) => item.product.sku === product.sku
        );
        const items = hasExistingItem
          ? state.items.map((item) =>
              item.product.sku === product.sku
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...state.items, { product, quantity: 1 }];

        return {
          items,
          count: state.count + 1,
          isOpen: true,
        };
      }),

    removeFromCart: (sku) =>
      set((state) => {
        const item = state.items.find(
          (cartItem) => cartItem.product.sku === sku
        );
        const items = state.items.filter(
          (cartItem) => cartItem.product.sku !== sku
        );

        return {
          items,
          count: Math.max(0, state.count - (item?.quantity ?? 0)),
        };
      }),

    updateQuantity: (sku, quantity) =>
      set((state) => {
        if (quantity <= 0) {
          const item = state.items.find(
            (cartItem) => cartItem.product.sku === sku
          );

          return {
            items: state.items.filter(
              (cartItem) => cartItem.product.sku !== sku
            ),
            count: Math.max(0, state.count - (item?.quantity ?? 0)),
          };
        }

        const currentQuantity = state.items.find(
          (cartItem) => cartItem.product.sku === sku
        )?.quantity ?? 0;

        return {
          items: state.items.map((item) =>
            item.product.sku === sku ? { ...item, quantity } : item
          ),
          count: state.count + quantity - currentQuantity,
        };
      }),

    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
  })
);