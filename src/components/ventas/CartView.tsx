"use client";
import { useCartStore } from "@/store/cartStore";
import { Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  onCheckout: () => void;
  error?: string;
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

export function CartView({ onCheckout, error }: Props) {
  const { items, removeItem, updateQty, total, clientName } = useCartStore();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <ShoppingCart size={16} className="text-primary-600" />
        <p className="text-sm font-semibold text-gray-700">3. Carrito</p>
      </div>

      <div className="space-y-2 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
              <p className="text-xs text-gray-400">{fmt(item.unitPrice)} c/u</p>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)}
                className="w-12 text-center border border-gray-200 rounded-lg py-1 text-sm"
              />
              <p className="text-sm font-semibold text-gray-900 w-16 text-right">
                {fmt(item.totalPrice)}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="p-1.5 text-gray-300 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-3 flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-700">Total</p>
        <p className="text-lg font-bold text-gray-900">{fmt(total())}</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-3">
          {error}
        </div>
      )}

      <Button className="w-full" size="lg" onClick={onCheckout}>
        Confirmar venta
      </Button>
    </div>
  );
}
