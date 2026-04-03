"use client";
import { useState } from "react";
import { Promotion, Product } from "@/types";
import { Trash2, Tag } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface Props {
  promotions: Promotion[];
  products: Product[];
  onDelete: (id: string) => Promise<void>;
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

export function PromoList({ promotions, products, onDelete }: Props) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const getProductName = (pid: string) =>
    products.find((p) => p.id === pid)?.name ?? "Producto eliminado";

  if (!promotions.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <Tag size={40} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Sin combos aún</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {promotions.map((promo) => (
        <div key={promo.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{promo.name}</p>
              <p className="text-primary-600 font-bold text-base mt-0.5">{fmt(promo.price)}</p>
              <div className="mt-2 space-y-0.5">
                {promo.items.map((item, i) => (
                  <p key={i} className="text-xs text-gray-500">
                    • {item.quantity}x {getProductName(item.productId)}
                  </p>
                ))}
              </div>
            </div>
            <button
              onClick={() => setDeleting(promo.id)}
              className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Eliminar combo" size="sm">
        <p className="text-sm text-gray-600 mb-5">¿Eliminar este combo?</p>
        <div className="flex gap-3">
          <button
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
            onClick={() => setDeleting(null)}
          >
            Cancelar
          </button>
          <button
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium"
            onClick={async () => { if (deleting) { await onDelete(deleting); setDeleting(null); } }}
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}
