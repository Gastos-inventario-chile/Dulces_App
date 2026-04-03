"use client";
import { Sale } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PageLoader } from "@/components/ui/Spinner";

interface Props {
  sales: Sale[];
  loading: boolean;
}

const statusVariant = {
  pagado: "green",
  parcial: "yellow",
  fiado: "red",
} as const;

const statusLabel = {
  pagado: "Pagado",
  parcial: "Parcial",
  fiado: "Fiado",
};

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

export function RecentSales({ sales, loading }: Props) {
  if (loading) return <PageLoader />;

  if (!sales.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <p className="text-gray-400 text-sm">No hay ventas aún</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sales.map((sale) => {
        const date = sale.createdAt?.toDate?.();
        return (
          <div key={sale.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={statusVariant[sale.paymentStatus]}>
                  {statusLabel[sale.paymentStatus]}
                </Badge>
                {date && (
                  <span className="text-xs text-gray-400">
                    {format(date, "d MMM, HH:mm", { locale: es })}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {sale.items.length} {sale.items.length === 1 ? "producto" : "productos"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{fmt(sale.total)}</p>
              {sale.amountPending > 0 && (
                <p className="text-xs text-amber-600">Pendiente: {fmt(sale.amountPending)}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
