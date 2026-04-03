"use client";
import { Sale, Client } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Props {
  sales: Sale[];
  clients: Client[];
}

const statusVariant = {
  pagado: "green",
  parcial: "yellow",
  fiado: "red",
} as const;

const statusLabel = { pagado: "Pagado", parcial: "Parcial", fiado: "Fiado" };

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

function SaleCard({ sale, clientName }: { sale: Sale; clientName: string }) {
  const [expanded, setExpanded] = useState(false);
  const date = sale.createdAt?.toDate?.();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        className="w-full p-4 flex items-start justify-between text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-900">{clientName}</p>
            <Badge variant={statusVariant[sale.paymentStatus]}>
              {statusLabel[sale.paymentStatus]}
            </Badge>
          </div>
          {date && (
            <p className="text-xs text-gray-400">
              {format(date, "d 'de' MMMM yyyy, HH:mm", { locale: es })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-2">
          <p className="text-sm font-bold text-gray-900">{fmt(sale.total)}</p>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3">
          <p className="text-xs font-semibold text-gray-600 mb-2">Productos:</p>
          <div className="space-y-1 mb-3">
            {sale.items.map((item, i) => (
              <div key={i} className="flex justify-between text-xs text-gray-600">
                <span>{item.quantity}x {item.name}</span>
                <span>{fmt(item.totalPrice)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Pagado</span>
              <span className="font-medium text-emerald-600">{fmt(sale.amountPaid)}</span>
            </div>
            {sale.amountPending > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Pendiente</span>
                <span className="font-medium text-amber-600">{fmt(sale.amountPending)}</span>
              </div>
            )}
            {sale.dueDate && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Fecha límite</span>
                <span className="font-medium text-gray-700">
                  {format(sale.dueDate.toDate(), "d MMM yyyy", { locale: es })}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function SaleHistory({ sales, clients }: Props) {
  if (!sales.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <p className="text-gray-400 text-sm">Sin ventas registradas</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sales.map((sale) => {
        const client = clients.find((c) => c.id === sale.clientId);
        return (
          <SaleCard
            key={sale.id}
            sale={sale}
            clientName={client?.name ?? "Cliente eliminado"}
          />
        );
      })}
    </div>
  );
}
