"use client";
import { useForm } from "react-hook-form";
import { ProductInput } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Props {
  initial?: ProductInput;
  onSubmit: (data: ProductInput) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ initial, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<ProductInput>({
    defaultValues: initial ?? { name: "", price: 0, stock: 0 },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre del producto"
        placeholder="Ej: Gomitas surtidas"
        error={errors.name?.message}
        {...register("name", { required: "El nombre es requerido" })}
      />
      <Input
        label="Precio de venta ($)"
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
      <Input
        label="Stock inicial"
        type="number"
        placeholder="0"
        error={errors.stock?.message}
        {...register("stock", {
          required: "El stock es requerido",
          valueAsNumber: true,
          min: { value: 0, message: "No puede ser negativo" },
        })}
      />
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" loading={isSubmitting}>
          Guardar
        </Button>
      </div>
    </form>
  );
}
