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
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(user.uid);
      setProducts(data);
    } catch (e: any) {
      console.error("Error loading products:", e);
      setError(e.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const add = async (data: ProductInput) => {
    if (!user) return;
    try {
      await createProduct(user.uid, data);
      await load();
    } catch (e: any) {
      console.error("Error adding product:", e);
      setError(e.message);
      throw e;
    }
  };

  const update = async (id: string, data: Partial<ProductInput>) => {
    try {
      await updateProduct(id, data);
      await load();
    } catch (e: any) {
      console.error("Error updating product:", e);
      setError(e.message);
      throw e;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteProduct(id);
      await load();
    } catch (e: any) {
      console.error("Error deleting product:", e);
      setError(e.message);
      throw e;
    }
  };

  return { products, loading, error, add, update, remove, reload: load };
}

