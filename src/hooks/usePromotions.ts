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
    if (!user) return;
    setLoading(true);
    try {
      const data = await getPromotions(user.uid);
      setPromotions(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const add = async (data: PromotionInput) => {
    if (!user) return;
    await createPromotion(user.uid, data);
    await load();
  };

  const remove = async (id: string) => {
    await deletePromotion(id);
    await load();
  };

  return { promotions, loading, error, add, remove, reload: load };
}
