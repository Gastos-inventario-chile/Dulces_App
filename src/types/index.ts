import { Timestamp } from "firebase/firestore";

// ─── AUTH ────────────────────────────────────────────────────────────────────
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Timestamp;
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  userId: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Timestamp;
}

export type ProductInput = Omit<Product, "id" | "userId" | "createdAt">;

// ─── CLIENTS ─────────────────────────────────────────────────────────────────
export interface Client {
  id: string;
  userId: string;
  name: string;
  phone?: string;
  email?: string;
  totalSpent: number;
  createdAt: Timestamp;
}

export type ClientInput = Omit<Client, "id" | "userId" | "totalSpent" | "createdAt">;

// ─── PROMOTIONS ──────────────────────────────────────────────────────────────
export interface PromoItem {
  productId: string;
  quantity: number;
  productName?: string; // virtual, para mostrar en UI
}

export interface Promotion {
  id: string;
  userId: string;
  name: string;
  price: number;
  items: PromoItem[];
  createdAt: Timestamp;
}

export type PromotionInput = Omit<Promotion, "id" | "userId" | "createdAt">;

// ─── CART ────────────────────────────────────────────────────────────────────
export interface CartItem {
  type: "product" | "promotion";
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  breakdown: { productId: string; quantity: number }[];
}

// ─── SALES ───────────────────────────────────────────────────────────────────
export type PaymentStatus = "pagado" | "parcial" | "fiado";

export interface Sale {
  id: string;
  userId: string;
  clientId: string;
  clientName?: string; // virtual
  items: CartItem[];
  total: number;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  amountPending: number;
  dueDate?: Timestamp | null;
  createdAt: Timestamp;
}

export type SaleInput = Omit<Sale, "id" | "userId" | "createdAt" | "clientName">;

// ─── DEBTS ───────────────────────────────────────────────────────────────────
export type DebtStatus = "pendiente" | "vencido" | "pagado";

export interface Debt {
  id: string;
  userId: string;
  saleId: string;
  clientId: string;
  clientName?: string; // virtual
  amountPending: number;
  dueDate: Timestamp;
  status: DebtStatus;
  createdAt: Timestamp;
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
export interface DashboardStats {
  salesToday: number;
  totalSoldToday: number;
  totalPending: number;
  totalClients: number;
  recentSales: Sale[];
}
