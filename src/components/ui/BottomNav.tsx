"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Users, Tag, ShoppingCart, History } from "lucide-react";
import clsx from "clsx";

const NAV = [
  { href: "/", label: "Inicio", icon: LayoutDashboard },
  { href: "/inventario", label: "Stock", icon: Package },
  { href: "/ventas", label: "Venta", icon: ShoppingCart },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/historial", label: "Historial", icon: History },
];

export function BottomNav() {
  const path = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 pb-safe">
      <div className="flex items-center justify-around px-2 py-1 max-w-lg mx-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all",
                active
                  ? "text-primary-600"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className={clsx("text-[10px] font-medium", active && "font-semibold")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
