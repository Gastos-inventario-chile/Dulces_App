"use client";
import { useAuthContext } from "@/store/authContext";
import { useSalesToday, useRecentSales } from "@/hooks/useSales";
import { useClients } from "@/hooks/useClients";
import { useDebts } from "@/hooks/useDebts";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { DebtAlerts } from "@/components/dashboard/DebtAlerts";
import { logoutUser } from "@/services/auth";
import { useRouter } from "next/navigation";
import { LogOut, Candy } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const { sales: salesToday, loading: loadingToday } = useSalesToday();
  const { sales: recentSales, loading: loadingRecent } = useRecentSales(5);
  const { clients } = useClients();
  const { debts, totalPending, alerts } = useDebts();
  const router = useRouter();

  const totalSoldToday = salesToday.reduce((s, sale) => s + sale.amountPaid, 0);
  const salesTodayCount = salesToday.length;

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <Candy size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Bienvenido</p>
            <h1 className="text-base font-bold text-gray-900 leading-tight">
              {user?.displayName || "Usuario"}
            </h1>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Alertas de deudas */}
      {alerts.length > 0 && <DebtAlerts alerts={alerts} />}

      {/* Stats */}
      <DashboardStats
        salesToday={salesTodayCount}
        totalSoldToday={totalSoldToday}
        totalPending={totalPending}
        totalClients={clients.length}
        loading={loadingToday}
      />

      {/* Ventas recientes */}
      <div className="mt-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Últimas ventas</h2>
        <RecentSales sales={recentSales} loading={loadingRecent} />
      </div>
    </div>
  );
}
