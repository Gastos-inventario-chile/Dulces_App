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
    if (!user) return;
    setLoading(true);
    try {
      const data = await getClients(user.uid);
      setClients(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const add = async (data: ClientInput) => {
    if (!user) return;
    await createClient(user.uid, data);
    await load();
  };

  const remove = async (id: string) => {
    await deleteClient(id);
    await load();
  };

  return { clients, loading, error, add, remove, reload: load };
}
