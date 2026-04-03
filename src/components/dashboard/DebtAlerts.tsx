"use client";
import { Debt } from "@/types";
import { AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  alerts: Debt[];
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

export function DebtAlerts({ alerts }: Props) {
  if (!alerts.length) return null;

  return (
    <div className="mb-5 space-y-2">
      {alerts.map((d) => (
        <div
          key={d.id}
          className={`flex items-start gap-3 p-3 rounded-2xl border ${
            d.status === "vencido"
              ? "bg-red-50 border-red-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <AlertTriangle
            size={16}
            className={d.status === "vencido" ? "text-red-500 mt-0.5" : "text-amber-500 mt-0.5"}
          />
          <div>
            <p className={`text-xs font-semibold ${d.status === "vencido" ? "text-red-700" : "text-amber-700"}`}>
              {d.status === "vencido" ? "Deuda vencida" : "Vence pronto"} — {fmt(d.amountPending)}
            </p>
            {d.dueDate && (
              <p className="text-xs text-gray-500">
                Fecha: {format(d.dueDate.toDate(), "d MMM yyyy", { locale: es })}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
