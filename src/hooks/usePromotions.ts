import { useEffect, useState, useCallback } from "react";
import { getPromotions, createPromotion, deletePromotion } from "@/services/promotions";
import { Promotion, PromotionInput } from "@/types";
import { useAuthContext } from "@/store/authContext";

export function usePromotions() {
  const { user } = useAuthContext();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getPromotions(user.uid);
      setPromotions(data);
    } catch (e: any) {
      console.error("Error loading promotions:", e);
      setError(e.message || "Error al cargar promociones");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const add = async (data: PromotionInput) => {
    if (!user) return;
    try {
      await createPromotion(user.uid, data);
      await load();
    } catch (e: any) {
      console.error("Error adding promotion:", e);
      setError(e.message);
      throw e;
    }
  };

  const remove = async (id: string) => {
    try {
      await deletePromotion(id);
      await load();
    } catch (e: any) {
      console.error("Error deleting promotion:", e);
      setError(e.message);
      throw e;
    }
  };

  return { promotions, loading, error, add, remove, reload: load };
}
