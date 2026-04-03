import { useEffect, useState, useCallback } from "react";
import { getClients, createClient, deleteClient } from "@/services/clients";
import { Client, ClientInput } from "@/types";
import { useAuthContext } from "@/store/authContext";

export function useClients() {
  const { user } = useAuthContext();
  const [clients, setClients] = useState<Client[]>([]);
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
      const data = await getClients(user.uid);
      setClients(data);
    } catch (e: any) {
      console.error("Error loading clients:", e);
      setError(e.message || "Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const add = async (data: ClientInput) => {
    if (!user) return;
    try {
      await createClient(user.uid, data);
      await load();
    } catch (e: any) {
      console.error("Error adding client:", e);
      setError(e.message);
      throw e;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteClient(id);
      await load();
    } catch (e: any) {
      console.error("Error deleting client:", e);
      setError(e.message);
      throw e;
    }
  };

  return { clients, loading, error, add, remove, reload: load };
}

