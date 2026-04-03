import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  runTransaction,
  doc,
  serverTimestamp,
  Timestamp,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CartItem, PaymentStatus, Sale } from "@/types";

const SALES_COL = "sales";
const PRODUCTS_COL = "products";
const DEBTS_COL = "debts";
const CLIENTS_COL = "clients";

export interface SalePayload {
  userId: string;
  clientId: string;
  items: CartItem[];
  total: number;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  amountPending: number;
  dueDate?: Date | null;
}

/**
 * Operación ATÓMICA: valida stock → descuenta stock → guarda venta → crea deuda si aplica
 */
export async function confirmSale(payload: SalePayload): Promise<string> {
  return await runTransaction(db, async (tx) => {
    // 1. Construir mapa de descuentos por producto
    const stockMap: Record<string, number> = {};
    for (const item of payload.items) {
      for (const bd of item.breakdown) {
        stockMap[bd.productId] = (stockMap[bd.productId] ?? 0) + bd.quantity * item.quantity;
      }
    }

    // 2. Leer y validar stock actual
    const productRefs = Object.keys(stockMap).map((pid) =>
      doc(db, PRODUCTS_COL, pid)
    );
    const productSnaps = await Promise.all(productRefs.map((ref) => tx.get(ref)));

    for (let i = 0; i < productSnaps.length; i++) {
      const snap = productSnaps[i];
      if (!snap.exists()) throw new Error(`Producto no encontrado: ${snap.id}`);
      const currentStock = snap.data().stock as number;
      const needed = stockMap[snap.id];
      if (currentStock < needed) {
        throw new Error(
          `Stock insuficiente para "${snap.data().name}". Disponible: ${currentStock}, necesario: ${needed}`
        );
      }
    }

    // 3. Descontar stock
    for (let i = 0; i < productRefs.length; i++) {
      const pid = Object.keys(stockMap)[i];
      const snap = productSnaps[i];
      tx.update(productRefs[i], {
        stock: (snap.data().stock as number) - stockMap[pid],
      });
    }

    // 4. Guardar venta
    const saleRef = doc(collection(db, SALES_COL));
    tx.set(saleRef, {
      ...payload,
      dueDate: payload.dueDate ? Timestamp.fromDate(payload.dueDate) : null,
      createdAt: serverTimestamp(),
    });

    // 5. Crear deuda si hay saldo pendiente
    if (payload.amountPending > 0) {
      const debtRef = doc(collection(db, DEBTS_COL));
      tx.set(debtRef, {
        userId: payload.userId,
        saleId: saleRef.id,
        clientId: payload.clientId,
        amountPending: payload.amountPending,
        dueDate: payload.dueDate ? Timestamp.fromDate(payload.dueDate) : null,
        status: "pendiente",
        createdAt: serverTimestamp(),
      });
    }

    // 6. Actualizar totalSpent del cliente
    const clientRef = doc(db, CLIENTS_COL, payload.clientId);
    const clientSnap = await tx.get(clientRef);
    if (clientSnap.exists()) {
      tx.update(clientRef, {
        totalSpent: (clientSnap.data().totalSpent ?? 0) + payload.amountPaid,
      });
    }

    return saleRef.id;
  });
}

export async function getSales(userId: string): Promise<Sale[]> {
  const q = query(
    collection(db, SALES_COL),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Sale));
}

export async function getRecentSales(userId: string, n = 5): Promise<Sale[]> {
  const q = query(
    collection(db, SALES_COL),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(n)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Sale));
}

export async function getSalesToday(userId: string): Promise<Sale[]> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const q = query(
    collection(db, SALES_COL),
    where("userId", "==", userId),
    where("createdAt", ">=", Timestamp.fromDate(start)),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Sale));
}
