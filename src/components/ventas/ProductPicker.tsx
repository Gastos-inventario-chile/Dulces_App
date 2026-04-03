"use client";
import { useState } from "react";
import { Product, Promotion } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { Plus, Package, Tag } from "lucide-react";

interface Props {
  products: Product[];
  promotions: Promotion[];
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

export function ProductPicker({ products, promotions }: Props) {
  const cart = useCartStore();
  const [tab, setTab] = useState<"products" | "promos">("products");
  const [qty, setQty] = useState<Record<string, number>>({});

  const getQty = (id: string) => qty[id] ?? 1;

  const addProduct = (p: Product) => {
    cart.addProduct(
      {
        type: "product",
        id: p.id,
        name: p.name,
        unitPrice: p.price,
        breakdown: [{ productId: p.id, quantity: 1 }],
      },
      getQty(p.id)
    );
  };

  const addPromotion = (promo: Promotion) => {
    const q = getQty(promo.id);
    cart.addPromotion(
      {
        type: "promotion",
        id: promo.id,
        name: promo.name,
        unitPrice: promo.price,
        breakdown: promo.items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
        })),
      },
      q
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
      <p className="text-sm font-semibold text-gray-700 mb-3">2. Agregar productos</p>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
        <button
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
            tab === "products" ? "bg-white shadow text-gray-900" : "text-gray-500"
          }`}
          onClick={() => setTab("products")}
        >
          <Package size={13} /> Productos
        </button>
        <button
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
            tab === "promos" ? "bg-white shadow text-gray-900" : "text-gray-500"
          }`}
          onClick={() => setTab("promos")}
        >
          <Tag size={13} /> Combos
        </button>
      </div>

      {tab === "products" && (
        <div className="space-y-2">
          {products.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">Sin productos en inventario</p>
          )}
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                <p className="text-xs text-gray-400">{fmt(p.price)} · Stock: {p.stock}</p>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={p.stock}
                  value={getQty(p.id)}
                  onChange={(e) => setQty({ ...qty, [p.id]: parseInt(e.target.value) || 1 })}
                  className="w-12 text-center border border-gray-200 rounded-lg py-1 text-sm"
                />
                <button
                  onClick={() => addProduct(p)}
                  disabled={p.stock === 0}
                  className="p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-40 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "promos" && (
        <div className="space-y-2">
          {promotions.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">Sin combos creados</p>
          )}
          {promotions.map((promo) => (
            <div key={promo.id} className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{promo.name}</p>
                <p className="text-xs text-gray-400">{fmt(promo.price)}</p>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  value={getQty(promo.id)}
                  onChange={(e) => setQty({ ...qty, [promo.id]: parseInt(e.target.value) || 1 })}
                  className="w-12 text-center border border-gray-200 rounded-lg py-1 text-sm"
                />
                <button
                  onClick={() => addPromotion(promo)}
                  className="p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
