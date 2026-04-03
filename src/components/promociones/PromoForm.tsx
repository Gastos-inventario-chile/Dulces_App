"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Product, PromotionInput, PromoItem } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  products: Product[];
  onSubmit: (data: PromotionInput) => Promise<void>;
  onCancel: () => void;
}

export function PromoForm({ products, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<{ name: string; price: number }>();
  const [items, setItems] = useState<PromoItem[]>([{ productId: "", quantity: 1 }]);
  const [itemError, setItemError] = useState("");

  const addItem = () => setItems([...items, { productId: "", quantity: 1 }]);

  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const updateItem = (i: number, field: keyof PromoItem, val: string | number) => {
    setItems(items.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  };

  const handleFormSubmit = async (data: { name: string; price: number }) => {
    const valid = items.every((it) => it.productId && it.quantity > 0);
    if (!valid) {
      setItemError("Completa todos los productos del combo");
      return;
    }
    setItemError("");
    await onSubmit({
      name: data.name,
      price: Number(data.price),
      items: items.map((it) => ({
        productId: it.productId,
        quantity: Number(it.quantity),
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Nombre del combo"
        placeholder="Ej: Combo escolar"
        error={errors.name?.message}
        {...register("name", { required: "El nombre es requerido" })}
      />
      <Input
        label="Precio del combo ($)"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.price?.message}
        {...register("price", {
          required: "El precio es requerido",
          valueAsNumber: true,
          min: { value: 0, message: "No puede ser negativo" },
        })}
      />

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Productos del combo</p>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1">
                <select
                  value={item.productId}
                  onChange={(e) => updateItem(i, "productId", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Seleccionar...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="w-16">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(i, "quantity", parseInt(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 px-2 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="p-2.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
        {itemError && <p className="text-xs text-red-500 mt-1">{itemError}</p>}
        <button
          type="button"
          onClick={addItem}
          className="mt-2 flex items-center gap-1 text-xs text-primary-600 font-medium hover:underline"
        >
          <Plus size={14} /> Agregar producto
        </button>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" loading={isSubmitting}>
          Crear combo
        </Button>
      </div>
    </form>
  );
}
