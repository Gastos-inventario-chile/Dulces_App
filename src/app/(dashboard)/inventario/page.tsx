"use client";
import { useState } from "react";
import { Plus, Package } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ProductList } from "@/components/inventario/ProductList";
import { ProductForm } from "@/components/inventario/ProductForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";

export default function InventarioPage() {
  const { products, loading, add, update, remove } = useProducts();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Package size={20} className="text-primary-600" />
          <h1 className="text-lg font-bold text-gray-900">Inventario</h1>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Agregar
        </Button>
      </div>

      {loading ? (
        <PageLoader />
      ) : (
        <ProductList products={products} onUpdate={update} onDelete={remove} />
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Nuevo producto">
        <ProductForm
          onSubmit={async (data) => {
            await add(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
}
