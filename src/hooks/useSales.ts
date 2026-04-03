import { useEffect, useState, useCallback } from "react";
import { getSales, getRecentSales, getSalesToday } from "@/services/sales";
import { Sale } from "@/types";
import { useAuthContext } from "@/store/authContext";

export function useSales() {
  const { user } = useAuthContext();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getSales(user.uid);
      setSales(data);
    } catch (e: any) {
      console.error("Error loading sales:", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);
  return { sales, loading, reload: load };
}

export function useSalesToday() {
  const { user } = useAuthContext();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    getSalesToday(user.uid)
      .then((d) => { setSales(d); })
      .catch((e) => { console.error("Error loading today sales:", e); })
      .finally(() => { setLoading(false); });
  }, [user]);

  return { sales, loading };
}

export function useRecentSales(n = 5) {
  const { user } = useAuthContext();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    getRecentSales(user.uid, n)
      .then((d) => { setSales(d); })
      .catch((e) => { console.error("Error loading recent sales:", e); })
      .finally(() => { setLoading(false); });
  }, [user, n]);

  return { sales, loading };
}

