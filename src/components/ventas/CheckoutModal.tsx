"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PaymentStatus } from "@/types";

interface Props {
  open: boolean;
  total: number;
  onClose: () => void;
  onConfirm: (data: {
    paymentStatus: PaymentStatus;
    amountPaid: number;
    dueDate?: Date | null;
  }) => Promise<void>;
  loading: boolean;
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

export function CheckoutModal({ open, total, onClose, onConfirm, loading }: Props) {
  const [status, setStatus] = useState<PaymentStatus>("pagado");
  const [amountPaid, setAmountPaid] = useState(total);
  const [dueDate, setDueDate] = useState("");

  const handleConfirm = async () => {
    const paid = status === "pagado" ? total : Number(amountPaid);
    await onConfirm({
      paymentStatus: status,
      amountPaid: Math.min(paid, total),
      dueDate: dueDate ? new Date(dueDate + "T00:00:00") : null,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Confirmar pago">
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
          <span className="text-sm text-gray-600">Total a cobrar</span>
          <span className="text-xl font-bold text-gray-900">{fmt(total)}</span>
        </div>

        {/* Estado de pago */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Estado del pago</p>
          <div className="grid grid-cols-3 gap-2">
            {(["pagado", "parcial", "fiado"] as PaymentStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s);
                  if (s === "pagado") setAmountPaid(total);
                  if (s === "fiado") setAmountPaid(0);
                }}
                className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  status === s
                    ? s === "pagado"
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : s === "parcial"
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-red-500 text-white border-red-500"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Monto pagado (solo para parcial) */}
        {status === "parcial" && (
          <Input
            label={`Monto pagado (máx ${fmt(total)})`}
            type="number"
            step="0.01"
            max={total}
            value={amountPaid}
            onChange={(e) => setAmountPaid(Number(e.target.value))}
          />
        )}

        {/* Fecha límite (para fiado o parcial) */}
        {(status === "fiado" || status === "parcial") && (
          <Input
            label="Fecha límite de pago (opcional)"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        )}

        {/* Resumen */}
        {status !== "pagado" && (
          <div className="bg-amber-50 rounded-xl p-3 text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Pagado</span>
              <span className="font-semibold text-gray-900">
                {fmt(status === "fiado" ? 0 : Number(amountPaid))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pendiente</span>
              <span className="font-semibold text-amber-700">
                {fmt(total - (status === "fiado" ? 0 : Number(amountPaid)))}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1" loading={loading} onClick={handleConfirm}>
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
