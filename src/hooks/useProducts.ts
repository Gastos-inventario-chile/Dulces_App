import { useEffect, useState, useCallback } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/services/products";
import { Product, ProductInput } from "@/types";
import { useAuthContext } from "@/store/authContext";

export function useProducts() {
  const { user } = useAuthContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getProducts(user.uid);
      setProducts(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const add = async (data: ProductInput) => {
    if (!user) return;
    await createProduct(user.uid, data);
    await load();
  };

  const update = async (id: string, data: Partial<ProductInput>) => {
    await updateProduct(id, data);
    await load();
  };

  const remove = async (id: string) => {
    await deleteProduct(id);
    await load();
  };

  return { products, loading, error, add, update, remove, reload: load };
}
