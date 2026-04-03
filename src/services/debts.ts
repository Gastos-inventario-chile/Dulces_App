import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Debt, DebtStatus } from "@/types";
import { isAfter } from "date-fns";

const COL = "debts";

function computeStatus(debt: Debt): DebtStatus {
  if (debt.status === "pagado") return "pagado";
  if (debt.dueDate && isAfter(new Date(), debt.dueDate.toDate())) return "vencido";
  return "pendiente";
}

export async function getDebts(userId: string): Promise<Debt[]> {
  const q = query(
    collection(db, COL),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  const allDebts = snap.docs.map((d) => {
    const data = { id: d.id, ...d.data() } as Debt;
    return { ...data, status: computeStatus(data) };
  });
  // Filter out paid debts and sort by dueDate
  return allDebts
    .filter((d) => d.status !== "pagado")
    .sort((a, b) => {
      const aTime = a.dueDate?.toMillis?.() ?? 0;
      const bTime = b.dueDate?.toMillis?.() ?? 0;
      return aTime - bTime;
    });
}

export async function getAllDebts(userId: string): Promise<Debt[]> {
  const q = query(
    collection(db, COL),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  const debts = snap.docs.map((d) => {
    const data = { id: d.id, ...d.data() } as Debt;
    return { ...data, status: computeStatus(data) };
  });
  return debts.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.toMillis?.() ?? 0;
    return bTime - aTime;
  });
}

export async function markDebtPaid(debtId: string): Promise<void> {
  await updateDoc(doc(db, COL, debtId), { status: "pagado" });
}

export async function getTotalPending(userId: string): Promise<number> {
  const debts = await getDebts(userId);
  return debts.reduce((sum, d) => sum + d.amountPending, 0);
}

