import { create } from "zustand";
import { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  clientId: string;
  clientName: string;
  setClient: (id: string, name: string) => void;
  addProduct: (item: Omit<CartItem, "quantity" | "totalPrice">, qty: number) => void;
  addPromotion: (item: Omit<CartItem, "quantity" | "totalPrice">, qty: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  clientId: "",
  clientName: "",

  setClient: (id, name) => set({ clientId: id, clientName: name }),

  addProduct: (item, qty) => {
    const items = get().items;
    const existing = items.find((i) => i.id === item.id && i.type === "product");
    if (existing) {
      set({
        items: items.map((i) =>
          i.id === item.id && i.type === "product"
            ? { ...i, quantity: i.quantity + qty, totalPrice: (i.quantity + qty) * i.unitPrice }
            : i
        ),
      });
    } else {
      set({
        items: [
          ...items,
          {
            ...item,
            quantity: qty,
            totalPrice: qty * item.unitPrice,
          },
        ],
      });
    }
  },

  addPromotion: (item, qty) => {
    const items = get().items;
    const existing = items.find((i) => i.id === item.id && i.type === "promotion");
    if (existing) {
      set({
        items: items.map((i) =>
          i.id === item.id && i.type === "promotion"
            ? { ...i, quantity: i.quantity + qty, totalPrice: (i.quantity + qty) * i.unitPrice }
            : i
        ),
      });
    } else {
      set({
        items: [
          ...items,
          {
            ...item,
            quantity: qty,
            totalPrice: qty * item.unitPrice,
          },
        ],
      });
    }
  },

  updateQty: (id, qty) => {
    if (qty <= 0) {
      set({ items: get().items.filter((i) => i.id !== id) });
      return;
    }
    set({
      items: get().items.map((i) =>
        i.id === id ? { ...i, quantity: qty, totalPrice: qty * i.unitPrice } : i
      ),
    });
  },

  removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

  clearCart: () => set({ items: [], clientId: "", clientName: "" }),

  total: () => get().items.reduce((sum, i) => sum + i.totalPrice, 0),
}));
