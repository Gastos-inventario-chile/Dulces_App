"use client";
import { Client } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { User } from "lucide-react";

interface Props {
  clients: Client[];
}

export function ClientSelector({ clients }: Props) {
  const { clientId, clientName, setClient } = useCartStore();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <User size={16} className="text-primary-600" />
        <p className="text-sm font-semibold text-gray-700">1. Seleccionar cliente</p>
      </div>
      <select
        value={clientId}
        onChange={(e) => {
          const c = clients.find((cl) => cl.id === e.target.value);
          setClient(e.target.value, c?.name ?? "");
        }}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">-- Seleccionar cliente --</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      {clientName && (
        <p className="mt-2 text-xs text-emerald-600 font-medium">✓ Cliente: {clientName}</p>
      )}
    </div>
  );
}
