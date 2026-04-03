"use client";
import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { ClientList } from "@/components/clientes/ClientList";
import { ClientForm } from "@/components/clientes/ClientForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";

export default function ClientesPage() {
  const { clients, loading, add, remove } = useClients();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-primary-600" />
          <h1 className="text-lg font-bold text-gray-900">Clientes</h1>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Agregar
        </Button>
      </div>

      {loading ? (
        <PageLoader />
      ) : (
        <ClientList clients={clients} onDelete={remove} />
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Nuevo cliente">
        <ClientForm
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
