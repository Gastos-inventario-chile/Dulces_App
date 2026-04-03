import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Client, ClientInput } from "@/types";

const COL = "clients";

export async function getClients(userId: string): Promise<Client[]> {
  const q = query(
    collection(db, COL),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Client));
}

export async function createClient(userId: string, data: ClientInput): Promise<Client> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    userId,
    totalSpent: 0,
    createdAt: serverTimestamp(),
  });

  return {
    id: ref.id,
    userId,
    ...data,
    totalSpent: 0,
    createdAt: serverTimestamp() as any,
  };
}

export async function deleteClient(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

export async function incrementClientSpent(clientId: string, amount: number): Promise<void> {
  await updateDoc(doc(db, COL, clientId), {
    totalSpent: increment(amount),
  });
}
