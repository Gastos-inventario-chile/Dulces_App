"use client";
import { useState } from "react";
import { History } from "lucide-react";
import { useSales } from "@/hooks/useSales";
import { useClients } from "@/hooks/useClients";
import { SaleHistory } from "@/components/historial/SaleHistory";
import { PageLoader } from "@/components/ui/Spinner";

export default function HistorialPage() {
  const { sales, loading } = useSales();
  const { clients } = useClients();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("todos");

  const filtered = sales.filter((s) => {
    const client = clients.find((c) => c.id === s.clientId);
    const matchSearch =
      !search ||
      client?.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todos" || s.paymentStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center gap-2 mb-5">
        <History size={20} className="text-primary-600" />
        <h1 className="text-lg font-bold text-gray-900">Historial de ventas</h1>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {["todos", "pagado", "parcial", "fiado"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filterStatus === s
                ? "bg-primary-600 text-white"
                : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Buscar cliente..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
      />

      {loading ? (
        <PageLoader />
      ) : (
        <SaleHistory sales={filtered} clients={clients} />
      )}
    </div>
  );
}
