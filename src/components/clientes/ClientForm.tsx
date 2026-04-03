"use client";
import { useForm } from "react-hook-form";
import { ClientInput } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Props {
  onSubmit: (data: ClientInput) => Promise<void>;
  onCancel: () => void;
}

export function ClientForm({ onSubmit, onCancel }: Props) {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<ClientInput>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre completo"
        placeholder="Juan López"
        error={errors.name?.message}
        {...register("name", { required: "El nombre es requerido" })}
      />
      <Input
        label="Teléfono (opcional)"
        type="tel"
        placeholder="555-1234"
        {...register("phone")}
      />
      <Input
        label="Email (opcional)"
        type="email"
        placeholder="cliente@email.com"
        error={errors.email?.message}
        {...register("email", {
          pattern: { value: /^\S+@\S+$/, message: "Email inválido" },
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
