import { useEffect, useState, useCallback } from "react";
import { getDebts, markDebtPaid, getTotalPending } from "@/services/debts";
import { Debt } from "@/types";
import { useAuthContext } from "@/store/authContext";

export function useDebts() {
  const { user } = useAuthContext();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [data, total] = await Promise.all([
        getDebts(user.uid),
        getTotalPending(user.uid),
      ]);
      setDebts(data);
      setTotalPending(total);
    } catch (e: any) {
      console.error("Error loading debts:", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const payDebt = async (id: string) => {
    try {
      await markDebtPaid(id);
      await load();
    } catch (e: any) {
      console.error("Error paying debt:", e);
      throw e;
    }
  };

  // Alertas: vencidas o que vencen mañana
  const alerts = debts.filter((d) => {
    if (d.status === "vencido") return true;
    if (!d.dueDate) return false;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);
    const due = d.dueDate.toDate();
    return due <= tomorrow;
  });

  return { debts, totalPending, loading, payDebt, alerts, reload: load };
}
