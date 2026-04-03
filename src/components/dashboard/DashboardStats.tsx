"use client";
import { TrendingUp, Clock, Users, ShoppingBag } from "lucide-react";

interface Props {
  salesToday: number;
  totalSoldToday: number;
  totalPending: number;
  totalClients: number;
  loading: boolean;
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

export function DashboardStats({ salesToday, totalSoldToday, totalPending, totalClients, loading }: Props) {
  const cards = [
    {
      label: "Ventas hoy",
      value: salesToday.toString(),
      icon: ShoppingBag,
      color: "bg-primary-50 text-primary-600",
      iconBg: "bg-primary-100",
    },
    {
      label: "Cobrado hoy",
      value: fmt(totalSoldToday),
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-700",
      iconBg: "bg-emerald-100",
    },
    {
      label: "Por cobrar",
      value: fmt(totalPending),
      icon: Clock,
      color: "bg-amber-50 text-amber-700",
      iconBg: "bg-amber-100",
    },
    {
      label: "Clientes",
      value: totalClients.toString(),
      icon: Users,
      color: "bg-blue-50 text-blue-700",
      iconBg: "bg-blue-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map(({ label, value, icon: Icon, color, iconBg }) => (
        <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}>
            <Icon size={18} className={color.split(" ")[1]} />
          </div>
          <p className="text-xs text-gray-500 mb-0.5">{label}</p>
          {loading ? (
            <div className="h-5 w-16 bg-gray-100 rounded animate-pulse" />
          ) : (
            <p className="text-base font-bold text-gray-900 leading-tight">{value}</p>
          )}
        </div>
      ))}
    </div>
  );
}
