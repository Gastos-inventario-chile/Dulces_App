"use client";
import { useState } from "react";
import { Client } from "@/types";
import { Trash2, Users, Phone, Mail } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface Props {
  clients: Client[];
  onDelete: (id: string) => Promise<void>;
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

export function ClientList({ clients, onDelete }: Props) {
  const [deleting, setDeleting] = useState<string | null>(null);

  if (!clients.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <Users size={40} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Sin clientes aún</p>
        <p className="text-gray-300 text-xs mt-1">Agrega tu primer cliente con el botón de arriba</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {clients.map((c) => (
        <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
              <p className="text-xs text-primary-600 font-medium mt-0.5">
                Total comprado: {fmt(c.totalSpent)}
              </p>
              <div className="flex gap-3 mt-2">
                {c.phone && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Phone size={11} /> {c.phone}
                  </span>
                )}
                {c.email && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Mail size={11} /> {c.email}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setDeleting(c.id)}
              className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Eliminar cliente" size="sm">
        <p className="text-sm text-gray-600 mb-5">
          ¿Eliminar este cliente? Sus ventas e historial se conservarán.
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
