"use client";
import { useState } from "react";
import { Plus, Tag } from "lucide-react";
import { usePromotions } from "@/hooks/usePromotions";
import { useProducts } from "@/hooks/useProducts";
import { PromoList } from "@/components/promociones/PromoList";
import { PromoForm } from "@/components/promociones/PromoForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";

export default function PromocionesPage() {
  const { promotions, loading, add, remove } = usePromotions();
  const { products } = useProducts();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Tag size={20} className="text-primary-600" />
          <h1 className="text-lg font-bold text-gray-900">Promociones</h1>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Crear combo
        </Button>
      </div>

      {loading ? (
        <PageLoader />
      ) : (
        <PromoList promotions={promotions} products={products} onDelete={remove} />
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Nuevo combo" size="lg">
        <PromoForm
          products={products}
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
