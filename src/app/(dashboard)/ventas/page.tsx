"use client";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { usePromotions } from "@/hooks/usePromotions";
import { useClients } from "@/hooks/useClients";
import { useCartStore } from "@/store/cartStore";
import { ClientSelector } from "@/components/ventas/ClientSelector";
import { ProductPicker } from "@/components/ventas/ProductPicker";
import { CartView } from "@/components/ventas/CartView";
import { CheckoutModal } from "@/components/ventas/CheckoutModal";
import { confirmSale } from "@/services/sales";
import { useAuthContext } from "@/store/authContext";
import { useRouter } from "next/navigation";

export default function VentasPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { products } = useProducts();
  const { promotions } = usePromotions();
  const { clients } = useClients();
  const cart = useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (paymentData: {
    paymentStatus: "pagado" | "parcial" | "fiado";
    amountPaid: number;
    dueDate?: Date | null;
  }) => {
    if (!user || !cart.clientId) return;
    setLoading(true);
    setError("");
    try {
      await confirmSale({
        userId: user.uid,
        clientId: cart.clientId,
        items: cart.items,
        total: cart.total(),
        paymentStatus: paymentData.paymentStatus,
        amountPaid: paymentData.amountPaid,
        amountPending: cart.total() - paymentData.amountPaid,
        dueDate: paymentData.dueDate,
      });
      cart.clearCart();
      setShowCheckout(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push("/historial");
      }, 2000);
    } catch (e: any) {
      setError(e.message);
      setShowCheckout(false);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-20 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">✅</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">¡Venta registrada!</h2>
        <p className="text-gray-500 text-sm mt-2">Redirigiendo al historial...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center gap-2 mb-5">
        <ShoppingCart size={20} className="text-primary-600" />
        <h1 className="text-lg font-bold text-gray-900">Nueva venta</h1>
      </div>

      {/* Paso 1: Cliente */}
      <ClientSelector clients={clients} />

      {/* Paso 2: Productos y Promociones */}
      {cart.clientId && (
        <ProductPicker products={products} promotions={promotions} />
      )}

      {/* Carrito */}
      {cart.items.length > 0 && (
        <CartView onCheckout={() => setShowCheckout(true)} error={error} />
      )}

      <CheckoutModal
        open={showCheckout}
        total={cart.total()}
        onClose={() => setShowCheckout(false)}
        onConfirm={handleConfirm}
        loading={loading}
      />
    </div>
  );
}
