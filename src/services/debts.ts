import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  Timestamp,
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
    where("userId", "==", userId),
    where("status", "!=", "pagado"),
    orderBy("status"),
    orderBy("dueDate", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = { id: d.id, ...d.data() } as Debt;
    return { ...data, status: computeStatus(data) };
  });
}

export async function getAllDebts(userId: string): Promise<Debt[]> {
  const q = query(
    collection(db, COL),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = { id: d.id, ...d.data() } as Debt;
    return { ...data, status: computeStatus(data) };
  });
}

export async function markDebtPaid(debtId: string): Promise<void> {
  await updateDoc(doc(db, COL, debtId), { status: "pagado" });
}

export async function getTotalPending(userId: string): Promise<number> {
  const debts = await getDebts(userId);
  return debts.reduce((sum, d) => sum + d.amountPending, 0);
}
