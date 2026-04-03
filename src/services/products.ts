import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, ProductInput } from "@/types";

const COL = "products";

export async function getProducts(userId: string): Promise<Product[]> {
  const q = query(
    collection(db, COL),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  const products = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  // Sort in JS to avoid needing a Firestore composite index
  return products.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.toMillis?.() ?? 0;
    return bTime - aTime;
  });
}

export async function createProduct(userId: string, data: ProductInput): Promise<Product> {
  if (data.price < 0) throw new Error("El precio no puede ser negativo");
  if (data.stock < 0) throw new Error("El stock no puede ser negativo");

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

export async function updateProduct(id: string, data: Partial<ProductInput>): Promise<void> {
  if (data.price !== undefined && data.price < 0)
    throw new Error("El precio no puede ser negativo");
  if (data.stock !== undefined && data.stock < 0)
    throw new Error("El stock no puede ser negativo");
  await updateDoc(doc(db, COL, id), { ...data });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
