import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@shared/schema';

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string; // For products with sizes
  selectedPrice?: number; // Price of the selected size
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, selectedSize?: string, selectedPrice?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

// Generate unique ID for cart items (product can be in cart multiple times with different sizes)
const getCartItemId = (productId: number, selectedSize?: string) => {
  return selectedSize ? `${productId}-${selectedSize}` : `${productId}`;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, selectedSize, selectedPrice) => {
        const items = get().items;
        const cartItemId = getCartItemId(product.id, selectedSize);
        const existingItem = items.find((item) =>
          getCartItemId(item.id, item.selectedSize) === cartItemId
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              getCartItemId(item.id, item.selectedSize) === cartItemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [...items, {
              ...product,
              quantity: 1,
              selectedSize,
              selectedPrice
            }]
          });
        }
      },
      removeItem: (cartItemId) => {
        set({
          items: get().items.filter((item) =>
            getCartItemId(item.id, item.selectedSize) !== cartItemId
          )
        });
      },
      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set({
          items: get().items.map((item) =>
            getCartItemId(item.id, item.selectedSize) === cartItemId
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      total: () => {
        return get().items.reduce((sum, item) => {
          // Use selectedPrice if available (for sized items), otherwise use base price
          const itemPrice = item.selectedPrice ?? Number(item.price);
          return sum + itemPrice * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'infusionist-cart',
    }
  )
);
