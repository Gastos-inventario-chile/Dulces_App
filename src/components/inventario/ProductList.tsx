"use client";
import { useState } from "react";
import { Product, ProductInput } from "@/types";
import { Pencil, Trash2, Package } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ProductForm } from "./ProductForm";
import { Badge } from "@/components/ui/Badge";

interface Props {
  products: Product[];
  onUpdate: (id: string, data: Partial<ProductInput>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

export function ProductList({ products, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  if (!products.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <Package size={40} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Sin productos aún</p>
        <p className="text-gray-300 text-xs mt-1">Agrega tu primer producto con el botón de arriba</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {products.map((p) => (
        <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{p.name}</p>
              <p className="text-primary-600 font-bold text-base mt-0.5">{fmt(p.price)}</p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => setEditing(p)}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => setDeleting(p.id)}
                className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          <div className="mt-2">
            <Badge variant={p.stock === 0 ? "red" : p.stock < 5 ? "yellow" : "green"}>
              Stock: {p.stock}
            </Badge>
          </div>
        </div>
      ))}

      {/* Modal editar */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar producto">
        {editing && (
          <ProductForm
            initial={{ name: editing.name, price: editing.price, stock: editing.stock }}
            onSubmit={async (data) => {
              await onUpdate(editing.id, data);
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Modal confirmar borrar */}
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Eliminar producto" size="sm">
        <p className="text-sm text-gray-600 mb-5">
          ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setDeleting(null)}
          >
            Cancelar
          </button>
          <button
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600"
            onClick={async () => {
              if (deleting) {
                await onDelete(deleting);
                setDeleting(null);
              }
            }}
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}
