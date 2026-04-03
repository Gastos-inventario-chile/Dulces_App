import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Promotion, PromotionInput } from "@/types";

const COL = "promotions";

export async function getPromotions(userId: string): Promise<Promotion[]> {
  const q = query(
    collection(db, COL),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  const promos = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Promotion));
  return promos.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.toMillis?.() ?? 0;
    return bTime - aTime;
  });
}

export async function createPromotion(
  userId: string,
  data: PromotionInput
): Promise<Promotion> {
  if (data.price < 0) throw new Error("El precio no puede ser negativo");
  if (!data.items.length) throw new Error("La promoción debe tener al menos un producto");

  const ref = await addDoc(collection(db, COL), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
  });

  return {
    id: ref.id,
    userId,
    ...data,
    createdAt: serverTimestamp() as any,
  };
}

export async function deletePromotion(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
